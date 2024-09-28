import TelegramBot from 'node-telegram-bot-api';

// Replace with your bot token from BotFather
const token = '7222735236:AAGVff8XQHNT9wahq8GkqpG7h4H6KlQ869w';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for '/start' command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const encodedUserId = encodeURIComponent(userId);
  const yourWebAppUrl = `https://www.aureus-coin.com/#/${encodedUserId}`;

  // Define the keyboard with the same web app URL for all buttons
  const keyboard = [
    [
      { text: 'Explore', web_app: { url: yourWebAppUrl } },
      { text: 'Earn', web_app: { url: yourWebAppUrl } }
    ],
    [
      { text: 'Where am I?', web_app: { url: yourWebAppUrl } }
    ]
  ];

  bot.sendMessage(chatId, 'Welcome to the Aureus era1!', {
    reply_markup: {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: false,
    }
  });
});

// Handle data received from the web app
bot.on('web_app_data', (msg) => {
  const data = JSON.parse(msg.web_app_data.data);
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Received data from web app: ${JSON.stringify(data)}`);
});

bot.on('text', (msg) => {
  const chatId = msg.chat.id;


  const keyboard = [
    [
      { text: '🌍 Explore', web_app: { url: yourWebAppUrl } },
      { text: '💰 Earn', web_app: { url: yourWebAppUrl } }
    ],
    [
      { text: '🌍 Where am I?', web_app: { url: yourWebAppUrl } }
    ]
  ];

  const buttons = [
    [{ text: 'PLAY', web_app: { url: 'https://www.aureus-coin.com/#/Ref/' } }],
    [{ text: 'Join community', url: 't.me/abc_bot' }]
  ];

  bot.sendMessage(chatId, 'Click the buttons below:', {
    reply_markup: {
      inline_keyboard: buttons,
    }
  });
});

console.log('Bot is running...');

process.once('SIGINT', () => bot.stopPolling());
process.once('SIGTERM', () => bot.stopPolling());
