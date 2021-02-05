import React, { Component } from 'react'

import styles from './ChatMain.module.css'
import shortid from 'shortid'
import ChatMessages from './ChatMessages/ChatMessages'

class ChatMain extends Component {

    state = {
        message: '',
    }

    handleWriteMessage = e => {
        this.setState({
            message: e.target.value
        })
    }

    handleSendMessage = e => {
        e.preventDefault();

        const trimText = this.state.message.trim()

        if (trimText.length > 0) {
            const date = new Date()
            const hours = date.getHours()
            let minutes = date.getMinutes()
            minutes = minutes < 10 ? '0' + minutes : minutes;

            const time = `${hours}:${minutes}`

            this.props.onSendMessage({
                fromMe: true,
                text: trimText,
                time: time,
                id: shortid.generate()
            })
        }
        this.setState({
            message: ''
        })
    }


    render() {

        const { name, description, chatHistory, isTyping, avatar } = this.props.activeUser

        return (

            <div className={styles.ChatMain}>

                <div className={styles.ActiveUser}>
                    <div className={styles.UserAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
                    <div className={styles.UserAbout}>
                        <p className={styles.UserName}>{name}</p>
                        <p>{description}</p>
                    </div>

                </div>

                <ChatMessages chatHistory={chatHistory} activeUserName={name} myUserName={this.props.myUserName} />

                {isTyping ? <p className={styles.IsTyping}>{name} is typing ...</p> : <p className={styles.IsTyping}></p>}

                <form className={styles.SendMessageForm} onSubmit={this.handleSendMessage}>
                    <input className={styles.SendMessageInput} name='message' value={this.state.message} onChange={this.handleWriteMessage} onKeyPress={this.props.onKeyDown} />
                    <button className={styles.SendMessageButton}>Send message</button>
                </form>
            </div>
        )
    }
}

export default ChatMain