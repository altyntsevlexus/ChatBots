
import React from 'react'
import styles from './ChatActiveUser.module.css'


const ChatActiveUser = ({ name, description, avatar }) => (

    <div className={styles.ActiveUser}>
        <div className={styles.UserAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className={styles.UserAbout}>
            <p className={styles.UserName}>{name}</p>
            <p>{description}</p>
        </div>

    </div>
)

export default ChatActiveUser