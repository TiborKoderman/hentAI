const fs = require('fs');

module.exports = {
	name: '!goodbotcount',
    description: '',
    aliases: [],
	execute(message) {
        fs.readFile('./permdat.json', (err, data) => {
            if (err) {
                message.channel.send(JSON.stringify(err));
                throw err;
            }
            const permdat = JSON.parse(data);
            message.channel.send(`Good boy points: ${permdat.goodbotcnt}`);
        })
	},
};