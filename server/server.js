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

//bots imports
const { bots } = require('./bots')

//randomizer
const randomInteger = (min, max) => {
    const random = min + Math.random() * (max - min + 1)
    return Math.round(random)
}

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

        // sending myUser and users list to client
        socket.emit('connected', myUser, storage[myUser.id])

        //adding my user to all user's list
        users.push({ ..._.cloneDeep(myUser), currentSocketId })

        // adding myUser to the every users' storage
        Object.values(storage).forEach(element => {
            element.push({ ...myUser, currentSocketId })
        });

        //sending myUser to other clients
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

        //sending online status to other clients
        socket.broadcast.emit('old-user-online', id)

        //updating currentSocketId
        Object.values(storage).forEach(userStorage => userStorage.find(user => user.id === id).currentSocketId = currentSocketId);
        users.find(user => user.id === id).currentSocketId = currentSocketId;

        //updating online status
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

        // hanlding messages to bots/users
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
        const date = new Date()
        const hours = date.getHours()
        let minutes = date.getMinutes()
        minutes = minutes < 10 ? '0' + minutes : minutes;

        const time = `${hours}:${minutes}`

        socket.emit('chat-message',
            {
                time: time,
                text: "SPAM",
                fromMe: false,
                id: shortid.generate()
            }, 'Spam-bot')
        setTimeout(spam, randomInteger(10000, 120000))
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