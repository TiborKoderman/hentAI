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
      return "Nisem bil zmožen najti zanesljive omake.";
    }
    console.log('creating embed')
    const embed = new Discord.MessageEmbed()
    .setTitle('Mal pekoče omake prihaja takoj')
    .setColor('f089dd')
    .setDescription('prosil si za omako, dobil boš omako')
    .setThumbnail(endres[0].thumbnail)
    .addField(`Najboljša omaka iz ${endres[0].site}, z samozavestjo ${endres[0].similarity}%:`, endres[0].url);

    endres.shift();

    console.log('starting for loop');
    for(res of endres)
    {
      embed.addField(`Omaka iz ${res.site}, z samozavestjo ${res.similarity}%:`, res.url);
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
    if(args.shift().toLowerCase() === 'omaka?' && args.length == 1 && atts.length == 0)
    {
      console.log("nebi smel biti tu");
      let tmpsc = await getSauce(args[0]);
      console.log('dobil sporocilo');
      msg.channel.send(tmpsc);
    }
    else if(atts.length > 0 && msg.content === 'omaka?')
    {
      console.log("got in");
      console.log(msg.attachments.array().url);
      let tmpsc = await getSauce(atts[atts.length -1].url);
      //console.log('got message');
      msg.channel.send(tmpsc);
    }
    else if(msg.content.toLocaleLowerCase() === 'omaka?' && args.length == 0 && atts.length == 0)
    {
      msg.channel.messages.fetch({ limit: 30 }).then(async messages => {
        const botMessages = messages.filter(msga => msga.attachments.array().length >0);
        if(botMessages.array().length > 0)
        {
        temp = await getSauce(botMessages.array()[0].attachments.array()[botMessages.array()[0].attachments.array().length-1].url);
        msg.channel.send(temp);
        }
        else
        msg.channel.send("nisem mogel najti slike v zadnjih 30 sporočilih, oprosti senpai");
      });

        
      
    }
  });

  //getSauce(links);
  client.login(options.Token); 