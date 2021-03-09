import React, { Component } from 'react'
import Header from './Header/Header'
import ChatList from './ChatList/ChatList'
import ChatMain from './ChatMain/ChatMain'

import styles from './App.module.css'
import bunnyImg from '../bunny.jpg'

import { io } from "socket.io-client";

const shortid = require('shortid')
const randomName = require('random-name')

const sortFunction = (a, b) => a.id.localeCompare(b.id)

class App extends Component {

    state = {
        socket: io('http://localhost:4000'),
        users: [],
        myUser: {},
        roomId: '',
        currentChat: [],
        isTyping: []
    }
    componentDidMount() {

        if (localStorage.getItem('myUser')) {
            this.state.socket.emit('get-old-user', localStorage.getItem('myUser'))
            this.state.socket.on('get-old-user', (myUser, otherUsers) => {
                this.setState(state => (
                    {
                        ...state,
                        users: [...otherUsers].sort(sortFunction),
                        myUser: myUser
                    }
                ))
            })
        } else {
            // creating new unique User
            const myUserId = shortid.generate()
            const myUserName = randomName.first()
            const myUser = {
                id: myUserId,
                name: myUserName,
                lastMessage: 'Hello I am new in this chat!',
                description: 'Here should be my description',
                online: true,
                activeUser: false,
                type: 'user',
                avatar: bunnyImg
            }

            this.state.socket.emit('set-new-user', myUser)
        }

        //listen myUser and myUserStorage
        this.state.socket.on('connected', (myUser, myUserStorage) => {

            localStorage.setItem('myUser', myUser.id)

            this.setState(state => (
                {
                    ...state,
                    users: [...myUserStorage].sort(sortFunction),
                    myUser: myUser
                }
            ))
        })

        //(broadcast) myUser added to the list
        this.state.socket.on('add-new-user', (user) => {
            this.setState(state => (
                {
                    ...state,
                    users: [...state.users, user].sort(sortFunction)
                }
            ))
        })

        //old user connected - updating status
        this.state.socket.on('old-user-online', id => {

            this.setState(state => {

                const otherUsers = state.users.filter(user => user.id !== id)
                const connectedUser = state.users.find(user => user.id === id)

                return {
                    ...state,
                    users: [...otherUsers, { ...connectedUser, online: true }].sort(sortFunction)
                }
            })
        })

        this.state.socket.on('get-active-chat', activeChat => {
            this.setState({
                currentChat: activeChat
            })
        })

        //(to(socketID)) message added on socket as !fromMe
        this.state.socket.on('chat-message', (message, roomId) => {

            console.log('message received');

            if (this.state.roomId === roomId) {
                this.setState((state) => ({
                    currentChat: [...state.currentChat, message]
                }))
            }
        })

        //showing is-typing
        this.state.socket.on('is-typing', typerName => {

            console.log('YES: ', typerName);

            this.setState((state) => {
                const newArray = [...state.isTyping, typerName]
                return {
                    isTyping: [...new Set(newArray)]
                }
            })
        })

        this.state.socket.on('no-longer-typing', typerName => {

            console.log('NO: ', typerName);

            this.setState((state) => {

                const isTyping = state.isTyping
                const index = isTyping.indexOf(typerName)

                isTyping.splice(index, 1)

                return {
                    isTyping: isTyping
                }
            })
        })



        // user discconected - updating status
        this.state.socket.on('user-disconnected', id => {

            this.setState(state => {

                const otherUsers = state.users.filter(user => user.id !== id)
                const disconnectedUser = state.users.find(user => user.id === id)

                return {
                    ...state,
                    users: [...otherUsers, { ...disconnectedUser, online: false }]
                }
            })
        })
    }

    onSetActiveUser = (id, roomId) => {

        this.setState((state) => {

            const newActive = state.users.find(user => user.id === id)
            const active = state.users.find(user => user.activeUser === true)
            const other = state.users.filter(user => user.id !== id && user.activeUser !== true)

            this.state.socket.emit('get-active-chat', roomId)
            this.state.socket.emit('user-joined', roomId)
            this.state.socket.emit('user-left', state.roomId)


            if (active) {
                return {
                    users: [
                        ...other,
                        {
                            ...active,
                            activeUser: false
                        },
                        {
                            ...newActive,
                            activeUser: true
                        }
                    ].sort(sortFunction),
                    roomId: roomId,
                    isTyping: [],
                }
            } else {
                return {
                    users: [
                        ...other,
                        {
                            ...newActive,
                            activeUser: true
                        }
                    ].sort(sortFunction),
                    roomId: roomId,
                    isTyping: [],
                }
            }
        })
    }

    handleIsTyping = (e) => {

        const stoppedTyping = () => this.state.socket.emit('no-longer-typing', this.state.roomId, this.state.myUser.name)

        if (e.key === 'Enter') {
            stoppedTyping()
            return
        }

        this.state.socket.emit('is-typing', this.state.roomId, this.state.myUser.name)
    }

    onSendMessage = message => {

        this.state.socket.emit('chat-message', message, this.state.roomId)

        this.setState((state) => ({
            currentChat: [...state.currentChat, message]
        }))
    }



    render() {

        const activeUser = this.state.users.find(user => user.activeUser === true)

        return (
            <>
                <Header />
                <div className={styles.wrapper}>
                    <div className={styles.ChatBox}>
                        {activeUser ? <ChatMain activeUser={activeUser} onSendMessage={this.onSendMessage} myUserName={this.state.myUser.name} handleIsTyping={this.handleIsTyping} myUserId={this.state.myUser.id} currentChat={this.state.currentChat} isTyping={this.state.isTyping} /> : <div className={styles.ChooseUser}>Choose user</div>}
                        <ChatList users={this.state.users} onSetActiveUser={this.onSetActiveUser} myUserId={this.state.myUser.id} />
                    </div>
                </div>
            </>
        )
    }
}

export default App