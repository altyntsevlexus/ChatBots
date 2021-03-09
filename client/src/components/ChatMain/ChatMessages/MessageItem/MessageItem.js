import React from 'react'
import styles from './MessageItem.module.css'


const MessageItem = ({ message, myUserId }) => (

    <>
        {message.senderId === myUserId ?
            <li className={styles.liFromMe}>
                <div className={styles.Message}>
                    <div className={styles.MessageInfoFromMe}>
                        <p>{message.senderName}</p>
                        <p className={styles.MessageTime}>{message.time}</p>
                    </div>
                    <p className={styles.MessageText}>{message.text}</p>
                </div>
            </li>
            :
            <li className={styles.liFromOther}>
                <div className={styles.Message}>
                    <div className={styles.MessageInfoOther}>
                        <p>{message.senderName}</p>
                        <p className={styles.MessageTime}>{message.time}</p>
                    </div>
                    <p className={styles.MessageText}>{message.text}</p>
                </div>
            </li>
        }
    </>
)


export default MessageItem