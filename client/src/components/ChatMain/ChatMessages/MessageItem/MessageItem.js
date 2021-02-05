import React from 'react'
import styles from './MessageItem.module.css'


const MessageItem = ({ message, activeUserName, myUserName }) => (

    <>
        {message.fromMe === true ?
            <li className={styles.liFromMe}>
                <div className={styles.Message}>
                    <div className={styles.MessageInfoFromMe}>
                        <p>{myUserName}</p>
                        <p className={styles.MessageTime}>{message.time}</p>
                    </div>
                    <p className={styles.MessageText}>{message.text}</p>
                </div>
            </li>
            :
            <li className={styles.liFromOther}>
                <div className={styles.Message}>
                    <div className={styles.MessageInfoOther}>
                        <p>{activeUserName}</p>
                        <p className={styles.MessageTime}>{message.time}</p>
                    </div>
                    <p className={styles.MessageText}>{message.text}</p>
                </div>
            </li>
        }
    </>
)


export default MessageItem