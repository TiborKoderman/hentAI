module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: [],
	execute(message, args) {
		message.channel.send('pong');
	},
};