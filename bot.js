import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { fileURLToPath } from 'url';

// Replace with your bot token from BotFather
const token = '7222735236:AAGVff8XQHNT9wahq8GkqpG7h4H6KlQ869w';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the image
const imagePath = path.join(__dirname, 'abc.JPG');

// Listen for '/start' command with referral parameter
bot.onText(/\/start(?: (.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.text; // Fetching the user ID from the message
  const referralCode = match[1]; // Extract the referral code from the match
  const encodedUserId = encodeURIComponent(userId);
  let yourWebAppUrl = `https://www.aureus-coin.com/#/${encodedUserId}`;

  if (referralCode) {
    // If a referral code is present, add it to the URL
    yourWebAppUrl += `?ref=${referralCode}`;
  }

  // Define the keyboard with the same web app URL for all buttons
  const keyboard = [
    [
      { text: '🌍 Explore', web_app: { url: yourWebAppUrl } },
      { text: '💰 Earn', web_app: { url: yourWebAppUrl } }
    ],
    [
      { text: '🌍 Where am I?', web_app: { url: yourWebAppUrl } }
    ]
  ];

  // Send the image along with the message and buttons
  bot.sendPhoto(chatId, imagePath, {
    caption: 'NOT COIN A Explore is here\nExplore the world of crypto while earning NOT_COIN in the background',
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Listen for callback queries
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = message.chat.id;
  const userId = callbackQuery.from.id; // Fetching the user ID from the callback query
  const encodedUserId = encodeURIComponent(userId);
  const yourWebAppUrl = `https://www.aureus-coin.com/#/${encodedUserId}`;

  bot.sendMessage(chatId, `Opening the web app: ${yourWebAppUrl}`, {
    reply_markup: {
      inline_keyboard: [[{ text: 'Open Web App', web_app: { url: yourWebAppUrl } }]]
    }
  });
});

console.log('Bot is running...');

process.once('SIGINT', () => bot.stopPolling());
process.once('SIGTERM', () => bot.stopPolling());
