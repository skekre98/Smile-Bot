const SlackBot = require('slackbots');
const axios = require('axios');
var natural = require('natural');
var nlp = new natural.BayesClassifier();

nlp.addDocument('Chuck Norris', 'chuck');
nlp.addDocument('chuck', 'chuck');
nlp.addDocument('god', 'chuck');
nlp.addDocument('random', 'rand');
nlp.addDocument('anything', 'rand');
nlp.addDocument('joke', 'rand');
 
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
    var classes = nlp.getClassifications(message);
    if (classes[0].value === classes[1].value) {
        const params = {
            icon_emoji: ':question:'
          };
        bot.postMessageToChannel('general', "Sorry I didn't understand that. Is there anything I can help you with?", params);
    } else if (classes[0].label === 'chuck') {
        chuckJoke();
    } else if (classes[0].label === 'rand') {
        randJoke();
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

function randJoke() {
    axios.get('https://sv443.net/jokeapi/category/Dark?blacklistFlags=nsfw').then(res => {
      if (res.data.type === 'twopart') {
        const params = {
            icon_emoji: ':laughing:'
        };
        bot.postMessageToChannel('general', res.data.setup, params);
        setTimeout(function() {
            bot.postMessageToChannel('general', res.data.delivery, params);
        }, 5000);
      } else {
        const params = {
            icon_emoji: ':laughing:'
        };
        bot.postMessageToChannel('general', res.data.joke, params);
      }
    });
}