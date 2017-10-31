const Discord = require('discord.js'); // Gets The Discord.js Package
const fs = require("fs"); // Gets the fs Package
const bot = new Discord.Client(); // Our Discord Client defined as bot
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level'); // Require the packages

var config = require('./storages/config.json'); // Config File
var guildConf = require('./storages/guildConf.json');

client.settings = new Enmap({name: 'settings', persistent: true}); // create new settings

const defaultSettings = {
  modLogChannel: "mod-log"
} // Sets the mod log, change it to whatever you like

client.on("ready", ready => {
  console.log("Bot launched beta edition")
  client.guilds.forEach((g) => {
    if (!client.settings.has(g.id)) {
      client.settings.set(g.id, defaultSettings); // This checks if the guild has the settings, if it does not, create them.
    }
  });
});

client.on("guildCreate", guild => {
  client.settings.set(guild.id, defaultSettings);
}); // add the settings when the bot joins the guild

// and finnaly, the actual command!

client.on("message", (message) => {
  if (message.content === "custom!setModLog") {
  const thisConf = client.settings.get(message.guild.id); // gets the configuration
thisConf.modLogChannel = `${message.channel.name}`; // sets the modLogChannel to the channel's name the message was sent in

client.settings.set(message.guild.id, thisConf); // sets it
message.channel.send("Sucessfuly changed mod logs!") // tells you it succeded
}});

// if you want an example command:
client.on("message", (message) => {
  if (message.content === "custom!ban") {
  const thisConf = client.settings.get(message.guild.id);
const channel = message.guild.channels.find('name', `${thisConf.modLogChannel}`); // Finds the channel
channel.send("BEANED")
}})




bot.on('ready', () => { // If the Bot went on, proceed
    console.log('I\'m Online!');
});

bot.on('guildCreate', (guild) => { // If the Bot was added on a server, proceed
    if (!guildConf[guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
	guildConf[guild.id] = {
		prefix: config.prefix
	}
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
});


bot.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
     delete guildConf[guild.id]; // Deletes the Guild ID and Prefix
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
});


bot.on('message', (message) => {
    if (message.channel.type === "dm" || msg.author.bot || msg.author === client.user) return; // Checks if we're on DMs, or the Author is a Bot, or the Author is our Bot, stop.
    var args = message.content.split(' ').slice(1); // We need this later
    var command = message.content.split(' ')[0].replace(guildConf[message.guild.id].prefix, ''); // Replaces the Current Prefix with this

    if (command === "ping") { // If your command is <prefix>ping, proceed
	message.channel.send('pong!') // Reply pong!
    } else
    if (command === "prefix") {
	guildConf[message.guild.id].prefix = args[0];
	if (!guildConf[message.guild.id].prefix) {
		guildConf[message.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
	}
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
  }
});

bot.login(config.token);
