const express = require('express');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
  http.get('https://strays-of-soap-bot.herokuapp.com/');
}, 900000);

//-------------------------RCON stuff here-------------------------
const rcon = require('srcds-rcon')({
  address: process.env.RCON_IP,
  password: process.env.RCON_PW
});

var connected = false;
var disconnect;
function tryconnect() {
  console.log('RCON: Connecting...')
  return rcon.connect()
    .then((data) => {
    console.log(data);
    connected = true;
    disconnect = setTimeout(() => {
      rcon.disconnect().then((data) => {
        console.log(data);
        clearTimeout(disconnect);
      },
       console.error);
    });
  })
    .catch((err) => {
    console.log(err);
    return new Promise((resolve) => {
      setTimeout(() => {
        tryconnect();
        resolve();
      }, 1000);
    });
  })
}

function refreshRCON() {
  clearTimeout(disconnect);
  setTimeout(disconnect);
}

function sendMessage(message) {
  if (connected) {
    refreshRCON()
    return rcon.command('say ' + message).then(console.log).catch(console.error);
  }
  else {
    return tryconnect().then(() => {
      return rcon.command('say ' + message).then(console.log).catch(console.error);
    });
  }
}

//-------------------------Discord bot stuff here-------------------------
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.channel.id == "286337571095838720"){
    console.log('recieved message: ' + message.cleanContent);
    Promise.resolve(sendMessage(message.cleanContent));
  }
});

client.login(process.env.BOT_TOKEN);
