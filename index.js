const TelegramApi =require ('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6177399514:AAEzj6y0GYEqaHuWjYV1MLol22kqesvY0zA'

const bot = new TelegramApi(token, { polling: true });

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру від 0 до 9, ти маєш її відгадати')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Відгадай', gameOptions)
}

const start = () => {
    bot.setMyCommands ([
        {command: '/start', description: 'Привітання'},
        {command: '/info', description: 'Інформація про користувача'},
        {command: '/game', description: 'Гра на відгадування чисел'},
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker (chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.jpg')
            return bot.sendMessage(chatId, 'Вітаю тебе у моєму боті')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Твоє ім'я ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text ==='/game') {
            return startGame(chatId);
        }
        return bot.sendMessage (chatId, 'Я тебе не розумію')
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage (chatId, `Вітаю, ти вгадав число ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage (chatId, `Ти не вгадав , бот загадав число ${chats[chatId]}`, againOptions)
        }
    })
}

start ()