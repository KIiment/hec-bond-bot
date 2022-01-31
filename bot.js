const { getBonds } = require('./bonds');
require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageSelectMenu, Message } = require('discord.js')
const axios = require('axios').default;
const math = require('mathjs');

const goodRates = {
  11: 8.4, //1.1 Role Notifier Rate at wich it Pings the role
  44: 10, //4.4 Role Notifier Rate at wich it Pings the role
};

const notifyRoles = {
  11: 'ROLE ID', //1.1 Role Notifier  ID
  44: 'ROLE ID', //4.4 Role Notifier  ID
};

const channels = {
  11: 'CHANNEL ID', //1.1 Bond Channel ID
  44: 'CHANNEL ID', //4.4 Bond Channel ID
  66: 'CHANNEL ID', //Rebase Channel
};
  
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Does Discord bot stuff
client.on('ready', () => {
  client.user.setUsername("HectorDao Bond Bot");
  console.log(`${client.user.tag} has logged in.`);
  console.log("Starting the discord bot \n")
  client.user.setActivity({name: `Watching the Bonds... `})

  const interval = 60;

  setTimeout(main, 25 * 1000);
  setTimeout(rebase, 5 * 1000);
  setInterval(() => {
    // Waiting for the next scraping process
    console.log(`${new Date().toUTCString()} -> Fetching latest bond data.`);
    main();
    console.log(`${new Date().toUTCString()} -> Fetching latest Rebase time Data.`);
    console.log(`${new Date().toUTCString()} -> Waiting ${interval} Seconds for the next update...`);
  }, interval * 1000);

  const interval2 = 300;
  setInterval(() => {
    // Checking for new Rebase Stats...
    console.log(`${new Date().toUTCString()} -> Fetching latest Rebase Stats.`);
    rebase();
    console.log(`${new Date().toUTCString()} -> Waiting ${interval2} Seconds for the next update...`);
  }, interval2 * 1000);

  
});

});

//Logs in the Discord Bot
client.login(process.env.DISCORDJS_BOT_TOKEN);


// cache for rebase alert.
let prevCount = 0

async function rebase() {
  const res = await axios.get('https://api.investaments.com/hec/rebases');

    //rebase alert last and so
  if (res.data.count!= prevCount) {
    console.log("New Rebase Rates detected -> Sending Discord Message!")
    
    let RebaseTimeAverage = res.data.avg
    let RebaseTimeLast = res.data.rebases[0].duration

    console.log('Average rebase time:', RebaseTimeAverage);
    console.log('Last rebase time:', RebaseTimeLast);

    const embedRebase = new MessageEmbed()
    .setTitle('Rebase Rates ⏰')
    .setColor('#c68430')
    .setThumbnail('https://i.imgur.com/5ibMLfY.png')
    .setDescription(`Average rebase time: ${RebaseTimeAverage} \n Last rebase time: ${RebaseTimeLast}`)
    .setTimestamp()
    .setFooter({ text: `It checks for new Data every 5 Minutes!` });
    
  
    client.channels.cache.get(channels[66]).send({ embeds: [embedRebase] });
    prevCount = res.data.count
    console.log("Done..!")

  }

}

async function main() {
  //fetch bond data
  const { bonds, stakingRebasePercentage } = await getBonds();

  Object.keys(bonds).forEach((bondType) => {
    bonds[bondType].forEach(({ name, discount  }) => {
      if (discount >= goodRates[bondType]) {
        const channel = client.channels.cache.get(channels[bondType]);
        channel.send(`<@&${notifyRoles[bondType]}> Good Bond! ${name} with ${discount.toFixed(2)}%!`);
        console.log("Pinnged everbody.")
      }
    });
  });



  function formatBondsOutput(b) {
    return b.map(({ name, discount }) => (
      `${name} ${discount.toFixed(2)}%`
    )).join('\n');
  }

  // Embedding the messages
  const embed11 = new MessageEmbed()
    .setTitle('New Bond Rates!')
    .setColor('#c68430')
    .setThumbnail('https://i.imgur.com/sJNsbUP.png')
    .setDescription(formatBondsOutput(bonds[11]))
    .setTimestamp();
  
  // Embedding the messages
  const embed44 = new MessageEmbed()
    .setTitle('New Bond Rates!')
    .setColor('#c68430')
    .setThumbnail('https://i.imgur.com/wvMsJgD.png')
    .setDescription(formatBondsOutput(bonds[44]))
    .setTimestamp()
    .setFooter({ text: `The % are with the ${stakingRebasePercentage.toFixed(2)}% Rebase Included` })

  console.log(`${new Date().toUTCString()} -> Send Discord Messages!`)


  client.channels.cache.get(channels[11]).send({ embeds: [embed11] });
  client.channels.cache.get(channels[44]).send({ embeds: [embed44] });

}