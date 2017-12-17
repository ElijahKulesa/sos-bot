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

//RCON stuff hereby

var Rcon = require('../node-rcon');

var conn = new Rcon(process.env.RCON_IP, 27015, process.env.RCON_PW); //27015 is default port for source games
conn.on('auth', function() {
  console.log("Authed!");

}).on('response', function(str) {
  console.log("Got response: " + str);

}).on('end', function() {
  console.log("Socket closed!");
  process.exit();

});

conn.connect();

//Discord bot stuff here
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.channel.id == "286337571095838720"){
    conn.send('say ' + message.cleanContent);
  }
});

client.login(process.env.BOT_TOKEN);
