import React, { Component } from 'react'
import shortid from 'shortid'

import styles from './ChatSendForm.module.css'



class ChatSendForm extends Component {

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

        const { onKeyDown } = this.props

        return (
            <form className={styles.SendMessageForm} onSubmit={this.handleSendMessage}>
                <input className={styles.SendMessageInput} name='message' value={this.state.message} onChange={this.handleWriteMessage} onKeyPress={onKeyDown} placeholder='Start chatting!' />
                <button className={styles.SendMessageButton}>Send message</button>
            </form>)
    }
}

export default ChatSendForm