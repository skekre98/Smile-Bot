const SlackBot = require('slackbots');
const axios = require('axios');
var natural = require('natural');
var nlp = new natural.BayesClassifier();

nlp.addDocument('Chuck Norris', 'chuck');
nlp.addDocument('chuck', 'chuck');
nlp.addDocument('random', 'rand');
nlp.addDocument('anything', 'rand');
 
nlp.train();

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
  if (data.subtype !== 'bot_message') {
    handleMessage(data.text);
  }
});

// Responds to Data
function handleMessage(message) {
    if (nlp.classify(message) === 'chuck') {
        chuckJoke()
    }
}

// Tell a Chuck Norris Joke
function chuckJoke() {
    axios.get('http://api.icndb.com/jokes/random').then(res => {
      const joke = res.data.value.joke;
  
      const params = {
        icon_emoji: ':laughing:'
      };
  
      bot.postMessageToChannel('general', joke, params);
    });
  }