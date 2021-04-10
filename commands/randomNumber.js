const https = require('https');

async function fetchRandomNumber() {
    const url = await new Promise((resolve, reject) => {
        https.get('https://nhentai.net/random/', res => {
            if (res.statusCode === 301 || res.statusCode === 302)
                return resolve(res.headers.location)

        }).on('error', err => reject('GET request error'));
    })
    return url.match(/\d+/g)[0];
}

module.exports = {
	name: 'random number',
    description: 'get a number between 100000-350000',
    aliases: [],
	async execute(message) {
        const number = await fetchRandomNumber();
        message.channel.send(number);
	},
};
