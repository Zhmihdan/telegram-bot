const TelegramApi = require('node-telegram-bot-api');
const options = require('./options');

const token = '6554026434:AAGJlw87-keQVbn_3M_gGfFirdArET002pM';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадываю число от 0 до 9, а ты должен его отгадать');
    const randomNumber =  Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'отгадывай)', options.gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Играть в угадай число'}
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Богдана`);
        }
        if (text === '/info') return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.username}`);
        if (text === '/game') return startGame(chatId);

        return bot.sendMessage(chatId, 'Ятебя не понимаю, попробуй еще раз');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') return startGame(chatId)

        if (Number(data) === chats[chatId]) return bot.sendMessage(chatId, `Поздравляю, ты отгадал число ${data}`, options.playAgain);
        else return bot.sendMessage(chatId, `К сожалению ты не угадал, это было число ${chats[chatId]}, а не ${data}`, options.playAgain);
    });
}

start();