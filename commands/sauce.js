const sagiri = require('sagiri');
const { SauceToken } = require('../options.json');
const sagiriclient = sagiri(SauceToken);

async function getSauce(link) {
    const results = await sagiriclient(link);

    const seenSites = [];
    const endres = results.filter((res, i, arr) => {
        if (res.similarity >= 40.0 && !seenSites.includes(result.site)) {
            seenSites.push(res.site);
            return true
        }
    })
    
    if (endres.length === 0) {
        return 'Could not find reliable sauce';
    }
    console.log('creating embed')
    const embed = new Discord.MessageEmbed()
        .setTitle('Some spicy sauce comming right up')
        .setColor('f089dd')
        .setDescription('you requested the sauce, you got the sauce')
        .setThumbnail(endres[0].thumbnail)
        .addField(`The best sauce from ${endres[0].site}, with confidence of ${endres[0].similarity}%:`, endres[0].url);

    endres.shift();

    for (res of endres) {
        embed.addField(`Sauce from ${res.site}, with confidence of ${res.similarity}%:`, res.url);
    }

    return embed;
}

module.exports = {
	name: 'sauce?',
    description: '',
    aliases: [],
    async execute(message, args) {
        const atts = message.attachments.array();
        let tmpsc
        if (args.length === 1 && atts.length === 0) {
            tmpsc = await getSauce(args[0]);
        } else if (atts.length > 0) {
            console.log(message.attachments.array().url);
            tmpsc = await getSauce(atts[atts.length -1].url);
        } else if (args.length === 0 && atts.length === 0) {
            message.channel.messages.fetch({ limit: 30 }).then(async messages => {
                const botMessages = messages.filter(msga => msga.attachments.array().length >0);
                if (botMessages.array().length > 0) {
                    tmpsc = await getSauce(botMessages.array()[0].attachments.array()[botMessages.array()[0].attachments.array().length-1].url);
                }
                else
                    tmpsc = "could not find image in last 30 messages, sorry";
            });
        }
        message.channel.send(tmpsc);
	},
};
