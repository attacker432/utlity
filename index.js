const { readdirSync } = require('fs');
const { Client, Collection, GatewayIntentBits  } = require('discord.js');
const client = new Client({
  partials: ['MESSAGE', 'REACTION'],
  intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,]
});

let commands = [];
client.commands = new Collection();
readdirSync('./Commands').forEach(folder => {
  readdirSync(`./Commands/${folder}`).forEach(file => {
    const command = require(`./Commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
    if (command.data.name !== 'help') commands.push(command.data.toJSON());
  });
}); 
module.exports = commands;

readdirSync('./Events').forEach(folder => {
  readdirSync(`./Events/${folder}`).forEach(file => {
    const event = require(`./Events/${folder}/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.login(process.env.token);