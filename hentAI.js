const Discord = require('discord.js');
const fs = require("fs");

const options = require("./options.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

client.once('ready', () => {
    console.log(`Logged in with ${client.user.tag}`);
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', message => {
    const args = message.content.trim().toLowerCase().split(/ +/);
    const commandName = args[0] === 'nyaa' ? args[1] : args[0]

    let command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        || client.commands.find(cmd => message.content.startsWith(cmd.name));
    
    if (!command) return

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
})

const { playMusic, stopMusic, getQueue } = require('./music.js');
const Twitch = require('./twitch');

client.on('message', async msg => {
    const args2 = msg.content.slice(('nyaa').length).trim().split(' ');
    const command = args2.shift().toLowerCase();

    switch (command) {
        case 'play':
            await playMusic(msg, args2[0])
            break

        case 'stop':
        case 'die':
            await stopMusic(msg)
            break

        case 'queue':
            getQueue(msg)
            break
        case 'settwitchchannel':
            twitch.setNotificationChannel(msg);
            break;
        case 'settwitchrole':
            twitch.setNotificationRole(msg);
            break;
    }
});

client.login(options.Token);

const twitch = new Twitch(client);