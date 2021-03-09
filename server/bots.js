const shortid = require('shortid')

const randomInteger = (min, max) => {
    const random = min + Math.random() * (max - min + 1)
    return Math.round(random)
}

class Bot {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.lastMessage = params.lastMessage;
        this.description = params.description;
        this.online = true;
        this.activeUser = params.activeUser;
        this.type = 'bot';
        this.avatar = params.avatar;
    }

    botAnswer(botMessage, text) {
        return { ...botMessage, text: text, id: shortid.generate(), senderName: this.name, senderId: this.id, receiverId: botMessage.senderId }
    }
}

class Echo_bot extends Bot {
    answer(message) {
        const answer = super.botAnswer(message, message.text)
        return answer
    }
}

class Reverse_bot extends Bot {
    answer(message) {
        const text = message.text.split("").reverse().join("");
        const answer = super.botAnswer(message, text)
        return answer
    }
}

class Ignore_bot extends Bot {
    answer(message) {
        return null
    }
}

class Spam_bot extends Bot {

    constructor(params) {
        super(params)
    }

    answer(message) {
        return null
    }

    spamming(socket, myUserId, storage) {

        let interval

        socket.on('user-joined', roomId => {

            if (roomId.includes(this.id)) {
                console.log('bot stars');
                interval = setInterval(function spam() {
                    const date = new Date()
                    const hours = date.getHours()
                    let minutes = date.getMinutes()
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    const time = `${hours}:${minutes}`

                    const spamMessage = {
                        senderId: 'Spam-bot',
                        senderName: 'Spam bot',
                        receiverId: myUserId,
                        time: time,
                        text: "SPAM",
                        id: shortid.generate()
                    }

                    storage.rooms.find(room => room.roomId === roomId).chat.push(spamMessage);

                    socket.emit('chat-message', spamMessage, roomId)
                }, randomInteger(10000, 12000))
            }
        })

        socket.on('user-left', roomId => {
            if (roomId.includes(this.id)) {
                clearInterval(interval)
            }
        })
    }
}

const echoBot = new Echo_bot({
    id: 'Echo-bot',
    name: 'Echo Bot',
    lastMessage: 'I want to repeat after you',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    activeUser: false,
    avatar: 'https://shop.solo-it.ru/upload/iblock/80a/bot.png'
})

const reverseBot = new Reverse_bot({
    id: 'Reverse-bot',
    name: 'Reverse Bot',
    lastMessage: '?gniod ruoy era woH !olleH',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    activeUser: false,
    avatar: 'https://i.pinimg.com/originals/2f/08/ab/2f08ab311cb92ed2cfafc691b12a8ce2.jpg',
})

const ignoreBot = new Ignore_bot({
    id: 'Ignore-bot',
    name: 'Ignore bot',
    lastMessage: "I don't care. I never answer.",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    activeUser: false,
    avatar: 'https://images-platform.99static.com/S0pzbW3PSvO9X8ejnfJqAYv4diw=/248x480:728x960/500x500/top/smart/99designs-contests-attachments/90/90380/attachment_90380214',
})

const spamBot = new Spam_bot({
    id: 'Spam-bot',
    name: 'Spam bot',
    lastMessage: 'Hello, do you want some SPAM?',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    activeUser: false,
    avatar: 'https://i.imgur.com/5ypIQQn.jpg',
})

module.exports = [echoBot, reverseBot, ignoreBot, spamBot]

