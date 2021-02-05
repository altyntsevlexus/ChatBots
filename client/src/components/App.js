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
                chatHistory: [],
                activeUser: false,
                type: 'user',
                isTyping: false,
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

        //(to(socketID)) message added on socket as !fromMe
        this.state.socket.on('chat-message', (message, senderId) => {
            this.setState((state) => {

                const notActiveUsers = state.users.filter(user => user.id !== senderId)
                const activeUser = state.users.find(user => user.id === senderId)


                return {
                    users: [
                        ...notActiveUsers,
                        {
                            ...activeUser,
                            chatHistory: [...activeUser.chatHistory, { ...message, fromMe: false }]
                        }
                    ].sort(sortFunction)
                }
            })
        })

        //showing is-typing
        this.state.socket.on('is-typing', (senderId, typing) => {

            console.log(typing);
            this.setState((state) => {

                const notActiveUsers = state.users.filter(user => user.id !== senderId)
                const activeUser = state.users.find(user => user.id === senderId)

                return {
                    users: [
                        ...notActiveUsers,
                        {
                            ...activeUser,
                            isTyping: typing
                        }
                    ].sort(sortFunction)
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

    onSetActiveUser = id => {

        this.setState((state) => {

            const newActive = state.users.find(user => user.id === id)
            const active = state.users.find(user => user.activeUser === true)
            const other = state.users.filter(user => user.id !== id && user.activeUser !== true)

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
                ].sort(sortFunction)
            }

        })
    }

    onKeyDown = (e) => {
        if (e.key === 'Enter') { return }
        const receiverId = this.state.users.find(user => user.activeUser === true).id
        const senderId = this.state.myUser.id

        let typing = true

        const timeOutFunction = () => {
            typing = false;
            this.state.socket.emit('is-typing', receiverId, senderId, typing)
        }

        this.state.socket.emit('is-typing', receiverId, senderId, typing)
        setTimeout(timeOutFunction, 3000)
    }

    onSendMessage = message => {

        const receiverId = this.state.users.find(user => user.activeUser === true).id
        const senderId = this.state.myUser.id

        this.state.socket.emit('chat-message', message, receiverId, senderId)

        this.setState((state) => {

            const notActiveUsers = state.users.filter(user => user.activeUser === false)
            const activeUser = state.users.find(user => user.activeUser === true)


            return {
                users: [
                    ...notActiveUsers,
                    {
                        ...activeUser,
                        chatHistory: [...activeUser.chatHistory, message]
                    }
                ].sort(sortFunction)
            }
        })
    }



    render() {

        const activeUser = this.state.users.find(user => user.activeUser === true)

        return (
            <>
                <Header />
                <div className={styles.wrapper}>
                    <div className={styles.ChatBox}>
                        {activeUser ? <ChatMain activeUser={activeUser} onSendMessage={this.onSendMessage} myUserName={this.state.myUser.name} onKeyDown={this.onKeyDown} /> : <p>Choose user</p>}
                        <ChatList users={this.state.users} onSetActiveUser={this.onSetActiveUser} />
                    </div>
                </div>
            </>
        )
    }
}

export default App