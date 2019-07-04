const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: process.env.SLACK_TOKEN,
  name: 'Smile Bot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':smile:'
  };

  bot.postMessageToChannel(
    'general',
    'Hi, I\'m Smile Bot!',
    params
  );
});

// Error Handler
bot.on('error', err => console.log(err));

// Message Handler
bot.on('message', data => {
  if (data.type !== 'message') {
    return;
  }

  handleMessage(data.text);
});

// Respons to Data
function handleMessage(message) {
//   TODO
}