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

module.exports.bots = bots