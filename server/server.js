const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

//npm imports
const _ = require('lodash/lang')
const shortid = require('shortid')

//randomizer
const randomInteger = (min, max) => {
    const random = min + Math.random() * (max - min + 1)
    return Math.round(random)
}


const bots = [
    {
        id: 'Echo-bot',
        name: 'Echo Bot',
        lastMessage: 'I want to repeat after you',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        online: true,
        chatHistory: [],
        activeUser: true,
        type: 'bot',
        avatar: 'https://shop.solo-it.ru/upload/iblock/80a/bot.png',
        answer(message) {
            return { ...message, id: shortid.generate(), }
        }
    },
    {
        id: 'Reverse-bot',
        name: 'Reverse Bot',
        lastMessage: '?gniod ruoy era woH !olleH',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        online: true,
        chatHistory: [],
        activeUser: false,
        type: 'bot',
        avatar: 'https://i.pinimg.com/originals/2f/08/ab/2f08ab311cb92ed2cfafc691b12a8ce2.jpg',
        answer(message) {
            const answer = message.text.split("").reverse().join("");
            return {
                ...message,
                text: answer,
                id: shortid.generate(),
            }
        }
    },
    {
        id: 'Spam-bot',
        name: 'Spam bot',
        lastMessage: 'Hello, do you want some SPAM?',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        online: true,
        chatHistory: [],
        activeUser: false,
        type: 'bot',
        avatar: 'https://i.imgur.com/5ypIQQn.jpg',
        answer(message) {
            return null
        }
    },
    {
        id: 'Ignore-bot',
        name: 'Ignore bot',
        lastMessage: "I don't care. I never answer.",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        online: true,
        chatHistory: [],
        activeUser: false,
        type: 'bot',
        avatar: 'https://images-platform.99static.com/S0pzbW3PSvO9X8ejnfJqAYv4diw=/248x480:728x960/500x500/top/smart/99designs-contests-attachments/90/90380/attachment_90380214',
        answer(message) {
            return null
        }
    }
]

const users = []

const storage = {
    'Echo-bot': [],
    'Reverse-bot': [],
    'Spam-bot': [],
    'Ignore-bot': [],
}


io.on('connection', socket => {

    const currentSocketId = socket.id
    let myUserId = ''

    //setting and sending new user data
    socket.on('set-new-user', myUser => {
        //creating newUser storage
        storage[myUser.id] = [..._.cloneDeep(bots), ..._.cloneDeep(users)]

        myUserId = myUser.id

        // sending myUser and users list on client
        socket.emit('connected', myUser, storage[myUser.id])

        //adding my user to all user's list
        users.push({ ..._.cloneDeep(myUser), currentSocketId })

        // adding myUser to the every users' storage
        Object.values(storage).forEach(element => {
            element.push({ ...myUser, currentSocketId })
        });

        //sending myUser to other users
        socket.broadcast.emit('add-new-user', myUser)

        console.log('new user connected');
    })

    //sedning old user data
    socket.on('get-old-user', id => {
        const myStorage = storage[id]
        const myUser = myStorage.find(user => user.id === id)
        const otherUsers = myStorage.filter(user => user.id !== id)

        myUserId = id;

        //sendin myUser info to client
        socket.emit('get-old-user', myUser, otherUsers)

        socket.broadcast.emit('old-user-online', id)

        Object.values(storage).forEach(userStorage => userStorage.find(user => user.id === id).currentSocketId = currentSocketId);
        users.find(user => user.id === id).currentSocketId = currentSocketId;

        Object.values(storage).forEach(userStorage => userStorage.find(user => user.id === id).online = true)
        users.find(user => user.id === id).online = true

        console.log('old user connected');
    })

    //listen client message
    socket.on('chat-message', (message, receiverId, senderId) => {

        const receiverInMyStorage = storage[senderId].find(user => user.id === receiverId)
        const meInReceiverStorage = storage[receiverId].find(user => user.id === senderId)

        receiverInMyStorage.chatHistory.push(message); //adding my message to storage[sender]
        meInReceiverStorage.chatHistory.push({ ...message, fromMe: false }) //adding my message to storage[receiver]

        if (receiverInMyStorage.type === 'bot') {
            const answer = receiverInMyStorage.answer(message)
            if (answer) {
                receiverInMyStorage.chatHistory.push({ ...answer, fromMe: false })
                meInReceiverStorage.chatHistory.push(answer)
                socket.emit('chat-message', answer, receiverId)
            }
        } else {
            io.to(receiverInMyStorage.currentSocketId).emit('chat-message', message, senderId)
        }
    })

    //spamming bot functioning
    setTimeout(function spam() {
        socket.emit('chat-message',
            {
                time: '00:00',
                text: "SPAM",
                fromMe: false,
                id: shortid.generate()
            }, 'Spam-bot')
        setTimeout(spam, randomInteger(1000, 5000))
    }, randomInteger(10000, 120000))

    //showing is typing
    socket.on('is-typing', (receiverId, senderId, typing) => {
        const receiverInMyStorage = storage[senderId].find(user => user.id === receiverId)

        io.to(receiverInMyStorage.currentSocketId).emit('is-typing', senderId, typing)
    })

    //disconnecting
    socket.on('disconnect', () => {

        const currentUser = users.find(user => user.id === myUserId)

        if (currentUser) {
            socket.broadcast.emit('user-disconnected', currentUser.id)

            Object.values(storage).forEach(users => currentUser.online = false)
            currentUser.online = false
        }

        console.log('User disconnected');
    })


})

http.listen(4000, () => {
    console.log('listening on port 4000');
})