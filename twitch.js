const fastify = require("fastify")({ logger: true });
let permdat = require("./permdat.json");
const options = require("./options.json");
const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const {
    DirectConnectionAdapter,
    EventSubListener,
} = require("twitch-eventsub");
const { NgrokAdapter } = require("twitch-eventsub-ngrok");
const fs = require("fs");
const Discord = require("discord.js");

class Twitch {
    constructor(client) {
        this.initTwitch();
        this.notificationChannel = permdat.twitchNotificationChannel;
        this.notificationRole = permdat.twitchNotificationRole;
        this.discordClient = client;
    }

    async initTwitch() {
        const authProvider = new ClientCredentialsAuthProvider(
            options.TwitchClientID,
            options.TwitchClientSecret,
        );
        this.apiClient = new ApiClient({ authProvider });
        this.listener = new EventSubListener(
            this.apiClient,
            new NgrokAdapter(),
            options.TwitchEventSecret
        );
        await this.listener.listen();
        await this.apiClient.helix.eventSub.deleteAllSubscriptions();
        this.subscriptions = [];
        options.TwitchChannels.forEach( async (channel) => {
            const user = await this.apiClient.helix.users.getUserByName(channel);
            this.subscriptions.push(
                await this.listener.subscribeToStreamOnlineEvents(user.id, e => {
                    this.notifyUsers(e.getBroadcaster())
                })
            );
        });
    }

    async notifyUsers() {
        const user = await this.apiClient.helix.users.getUserByName('fomic');
        const channel = this.discordClient.channels.cache.get(
            this.notificationChannel
        );
        const role = channel.guild.roles.cache.get(this.notificationRole);
        const streamTitle = await user.getStream().title;
        const message = new Discord.MessageEmbed()
            .setColor("#6441a5")
            .setTitle(`${user.displayName} just went live!`)
            .setURL(`https://twitch.tv${user.name}`)
            .setThumbnail(user.profilePictureUrl)
            .setDescription(`"${streamTitle}"`)
            .setTimestamp();

        channel.send(message)
        channel.send(`${role}`);
    }

    setNotificationChannel(message) {
        this.notificationChannel = message.channel.id;
        permdat.twitchNotificationChannel = message.channel.id;
        fs.writeFileSync("./permdat.json", JSON.stringify(permdat));
        message.channel.send("Successfully set this channel as the Twitch notification channel!");
    }

    setNotificationRole(message) {
        this.notificationRole = message.mentions.roles.entries().next().value[1].id;
        permdat.twitchNotificationRole = this.notificationRole;
        fs.writeFileSync("./permdat.json", JSON.stringify(permdat));
        message.channel.send(
            "Successfully set this channel as the Twitch notification channel!"
        );
    }
}

module.exports = Twitch;
