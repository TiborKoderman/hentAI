const Discord = require('discord.js');
const fs = require("fs");
var options = require("./options.json");
const sagiri = require('sagiri');
const sagiriclient = sagiri(options.SauceToken);



const client = new Discord.Client();

//let links = "https://media.discordapp.net/attachments/741730351025619034/758044171675369574/EcpoBzmUMAAlhO_.png?width=960&height=614";

async function getSauce(link)
{
    let results = await sagiriclient(link);

    let endres = [];
    let sites = [];
    for (result of results)
      if(result.similarity >= 80.0 && !sites.includes(result.site))
        {
          sites.push(result.site);
          endres.push(result);
        }

    //console.log(endres);
    
    if(endres.length == 0)
    {
      return "Could not find reliable sauce";
    }
    console.log('creating embed')
    const embed = new Discord.MessageEmbed()
    .setTitle('Some spicy sauce comming right up')
    .setColor('f089dd')
    .setDescription('you requested the sauce, you got the sauce')
    .setThumbnail(endres[0].thumbnail)
    .addField(`The best sauce from ${endres[0].site}, with confidence of ${endres[0].similarity}%:`, endres[0].url);

    endres.shift();

    console.log('starting for loop');
    for(res of endres)
    {
      embed.addField(`Sauce form ${res.site}, with confidence of ${res.similarity}%:`, res.url);
    } 
    //console.log(embed);
    return embed;
    
}

//getSauce(links);

client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  });
  
  client.on('ready', () => {
    console.log('I am ready!');
  });

  client.on('message', msg => {
    if (msg.content === 'pong') {
      msg.reply('ping');
    }
  });

  client.on('message', async msg => {
    const args = msg.content.trim().split(' ');
    let atts = msg.attachments.array();
    if(args.shift().toLowerCase() === 'sauce?' && args.length == 1 && atts.length == 0)
    {
      console.log("shouldn't be here");
      let tmpsc = await getSauce(args[0]);
      console.log('got message');
      msg.channel.send(tmpsc);
    }
    else if(atts.length > 0 && msg.content === 'sauce?')
    {
      console.log("got in");
      console.log(msg.attachments.array().url);
      let tmpsc = await getSauce(atts[atts.length -1].url);
      //console.log('got message');
      msg.channel.send(tmpsc);
    }
    else if(msg.content.toLocaleLowerCase() === 'sauce?' && args.length == 0 && atts.length == 0)
    {
      msg.channel.messages.fetch({ limit: 30 }).then(async messages => {
        const botMessages = messages.filter(msga => msga.attachments.array().length >0);
        if(botMessages.array().length > 0)
        {
        temp = await getSauce(botMessages.array()[0].attachments.array()[botMessages.array()[0].attachments.array().length-1].url);
        msg.channel.send(temp);
        }
        else
        msg.channel.send("could not find image in last 30 messages, sorry");
      });

        
      
    }
  });

  //getSauce(links);
  client.login(options.Token); 
