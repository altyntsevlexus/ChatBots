import React, { Component } from 'react'
import ChatListItem from './ChatListItem/ChatListItem'

import styles from './ChatList.module.css'


class ChatList extends Component {
    state = {
        searchOnline: true,
        filter: '',
    }

    handleSetActiveUser = e => {
        const li = e.target.closest('li')
        const activeUser = this.props.users.find(user => user.id === li.id)

        if (activeUser.activeUser === true) {
            return
        } else {
            this.props.onSetActiveUser(li.id)
        }
    }

    handleSearchOnline = (e) => {
        this.setState({
            searchOnline: true
        })
    }

    handleSearchAll = (e) => {
        this.setState({
            searchOnline: false
        })
    }

    handleSearch = (e) => {
        this.setState({
            filter: e.target.value
        })
    }

    render() {
        const { users } = this.props
        const { searchOnline, filter } = this.state
        const onlineUsers = users.filter(user => user.online === true)

        const fileteredOnline = onlineUsers.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))
        const filteredAll = users.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))

        return (
            <div className={styles.ChatListBox}>

                <div className={styles.ButtonsBox}>
                    <button onClick={this.handleSearchOnline} className={searchOnline ? styles.ButtonActive : styles.Button}>Online</button>

                    <button onClick={this.handleSearchAll} className={searchOnline ? styles.Button : styles.ButtonActive}>All</button>
                </div>

                <div className={styles.ChatList}>
                    <ul onClick={this.handleSetActiveUser}>
                        {searchOnline ?
                            fileteredOnline.map(user => (
                                <ChatListItem user={user} key={user.id} />
                            ))
                            :
                            filteredAll.map(user => (
                                <ChatListItem user={user} key={user.id} />
                            ))
                        }

                    </ul>
                </div>

                <input className={styles.Search} value={filter} onChange={this.handleSearch} />

            </div >
        )
    }
}

export default ChatList