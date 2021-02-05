import React from 'react'
import styles from './ChatListItem.module.css'


const ChatListItem = ({ user }) => (
    <li id={user.id} className={user.activeUser ? styles.ActiveUser : null}>
        <div className={styles.ChatListItem}>
            <div className={styles.ItemPhoto} style={{ backgroundImage: `url(${user.avatar})` }}>
                <div className={user.online ? styles.Online : styles.Offline}></div>
            </div>
            <div className={styles.ItemInformation}>
                <p className={styles.ItemName}>{user.name}</p>
                <p className={styles.ItemLastMessage}>{user.lastMessage}</p>
            </div>
        </div>
    </li >
)

export default ChatListItem