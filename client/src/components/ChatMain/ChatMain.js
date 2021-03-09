import React, { Component } from 'react'

import styles from './ChatMain.module.css'
import ChatMessages from './ChatMessages/ChatMessages'
import ChatSendForm from './ChatSendForm/ChatSendForm'
import ChatActiveUser from './ChatActiveUser/ChatActiveUser'

class ChatMain extends Component {

    render() {

        const { name, description, avatar, id } = this.props.activeUser

        return (

            <div className={styles.ChatMain}>

                <ChatActiveUser name={name} description={description} avatar={avatar} />

                <ChatMessages currentChat={this.props.currentChat} myUserId={this.props.myUserId} />

                {this.props.isTyping.length > 0 ? <p className={styles.IsTyping}>{this.props.isTyping.map(user => (user))} is typing...</p> : <p className={styles.IsTyping}></p>}

                <ChatSendForm handleIsTyping={this.props.handleIsTyping} onSendMessage={this.props.onSendMessage} myUserId={this.props.myUserId} myUserName={this.props.myUserName} activeUserId={id} />
            </div>
        )
    }
}

export default ChatMain