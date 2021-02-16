import React, { Component, createRef } from 'react'
import MessageItem from './MessageItem/MessageItem'

import styles from './ChatMessages.module.css'


class ChatMessages extends Component {

    messagesRef = createRef()

    componentDidUpdate() {
        const { current } = this.messagesRef

        current.scrollTop = current.scrollHeight
    }

    render() {

        const { currentChat, activeUserName, myUserName } = this.props

        return (
            <div className={styles.ChatMessages} ref={this.messagesRef}>
                <ul>
                    {currentChat.map(message => (
                        <MessageItem message={message} key={message.id} activeUserName={activeUserName} myUserName={myUserName} />
                    ))}

                </ul>
            </div>
        )
    }
}

export default ChatMessages

