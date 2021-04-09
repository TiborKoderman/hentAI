const fs = require('fs');

module.exports = {
    name: 'good bot',
    description: 'tracks good bot score',
    aliases: [],
	execute(message) {
        message.channel.send('bad human');
        fs.readFile('./permdat.json', (err, data) => {
            if (err) throw err;
            const permdat = JSON.parse(data);
            permdat.goodbotcnt += 1;
            fs.writeFileSync('./permdat.json', JSON.stringify(permdat));
        });
	},
};