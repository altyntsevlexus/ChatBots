const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

//npm imports
const _ = require('lodash')
const shortid = require('shortid')

//bots imports
const bots = require('./bots')

//randomizer



const storage = {
    users: [...bots],
    rooms: []
}



io.on('connection', socket => {

    let myUserId = ''

    storage.users.find(user => user.id === 'Spam-bot').spamming(socket, myUserId, storage);


    //setting and sending new user data
    socket.on('set-new-user', myUser => {

        myUserId = myUser.id

        //adding my user to all user's list
        storage.users.push(myUser)

        // sending myUser and users list to client
        socket.emit('connected', myUser, storage.users.filter(user => user.id !== myUserId))

        //sending myUser to other clients
        socket.broadcast.emit('add-new-user', myUser)

        console.log('new user connected');
    })

    //sending old user data
    socket.on('get-old-user', id => {

        const myUser = storage.users.find(user => user.id === id)
        const otherUsers = storage.users.filter(user => user.id !== id)

        myUserId = id;

        //sendin myUser info to client
        socket.emit('get-old-user', myUser, otherUsers)

        //sending online status to other clients
        socket.broadcast.emit('old-user-online', id)

        //updating online status
        storage.users.find(user => user.id === id).online = true

        console.log('old user connected');
    })

    socket.on('get-active-chat', (roomId) => {
        const activeRoom = storage.rooms.find(room => room.roomId === roomId)
        let activeChat = null

        if (!activeRoom) {
            storage.rooms.push({ roomId, chat: [] }) //adding new chat room to the storage
            activeChat = storage.rooms.find(room => room.roomId === roomId).chat
        } else {
            activeChat = activeRoom.chat
        }

        socket.emit('get-active-chat', activeChat)
    })

    socket.on('user-joined', roomId => {
        console.log(myUserId, ' joined room: ', storage.rooms.find(room => room.roomId === roomId).roomId);

        socket.join(roomId)
        socket.emit('user-joined', roomId)
    })
    socket.on('user-left', roomId => {
        console.log(myUserId, ' left room: ', storage.rooms.find(room => room.roomId === roomId).roomId);
        socket.leave(roomId)
    })

    //listen client message
    socket.on('chat-message', (message, roomId) => {

        const activeChat = storage.rooms.find(room => room.roomId === roomId).chat

        activeChat.push(message)

        // handling messages to bots/users
        if (message.receiverId.includes('bot')) {
            const bot = storage.users.find(user => user.id === message.receiverId)
            const answer = bot.answer(message)

            if (answer) {
                activeChat.push(answer)
                socket.emit('chat-message', answer, roomId) //emiting to myself
            }
        } else {
            socket.broadcast.to(roomId).emit('chat-message', message, roomId) //io => socket
        }
    })


    //showing is typing
    socket.on('is-typing', (roomId, typerName) => {


        socket.broadcast.to(roomId).emit('is-typing', typerName)
    })

    socket.on('no-longer-typing', (roomId, typerName) => {

        socket.broadcast.to(roomId).emit('no-longer-typing', typerName, 'from: ', typerName)
    })

    //disconnecting
    socket.on('disconnect', () => {

        const currentUser = storage.users.find(user => user.id === myUserId)

        if (currentUser) {
            socket.broadcast.emit('user-disconnected', currentUser.id)

            currentUser.online = false
        }

        console.log('User disconnected');
    })


})

http.listen(4000, () => {
    console.log('listening on port 4000');
})