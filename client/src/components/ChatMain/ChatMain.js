import React, { Component } from 'react'

import styles from './ChatMain.module.css'
import ChatMessages from './ChatMessages/ChatMessages'
import ChatSendForm from './ChatSendForm/ChatSendForm'
import ChatActiveUser from './ChatActiveUser/ChatActiveUser'

class ChatMain extends Component {

    render() {

        const { name, description, isTyping, avatar } = this.props.activeUser

        return (

            <div className={styles.ChatMain}>

                <ChatActiveUser name={name} description={description} avatar={avatar} />

                <ChatMessages currentChat={this.props.currentChat} activeUserName={name} myUserName={this.props.myUserName} />

                {isTyping ? <p className={styles.IsTyping}>{name} is typing ...</p> : <p className={styles.IsTyping}></p>}

                <ChatSendForm onKeyDown={this.props.onKeyDown} onSendMessage={this.props.onSendMessage} />
            </div>
        )
    }
}

export default ChatMain