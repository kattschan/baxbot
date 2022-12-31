const { version } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const { DurationFormatter } = require("@sapphire/time-utilities");
const durationFormatter = new DurationFormatter();

exports.run = (client, message, args, level) => { // eslint-disable-line no-unused-vars
// The first arg should be a 4 digit number(the time), the second arg should be a 6 digit number(the year), and the remainder should be treated as one arg
const time = args[0];
var date = args[1];


// Check if the time is a 4 digit number
if (!time || !time.match(/\d{4}/)) {
  return message.reply("You need to provide the UK time in 24h format (e.g. 1600 for 4pm)");
}

// Check if the date is a 6 digit number
if (!date.match(/\d{6}/)) {
    // Get the current month(two digits)
  const month = new Date().getMonth() + 1;
  // Get the current day(two digits)
  const day = new Date().getDate();
  // Get the current year (two digits))
  const year = new Date().getFullYear().toString().slice(-2);
  // Set the date to the current date
  var date = `${day}${month}${year}`;
  console.log(date);

 bbcChannel = args[1];
 description = args.slice(2).join(" ");
}


// Check if the reason is blank
if (!description) {
  return message.reply("You need to provide a description of what happened");
}

// Make sure bbcChannel is either nc, wnc, or 1
if (!bbcChannel.match(/nc|wnc|1/) | !bbcChannel) {
  return message.reply("You need to provide a valid BBC channel (nc for the news channel, wnc for the world news channel, or 1 for BBC One)");
}

// Get the user's name and discriminator
const { username, discriminator } = message.author;

// Get the channel ID from the config file
const channelID = 1058620128436178954;

// Send a message to the channel


// Send the report to the channel, and react with a checkmark and a cross
const Channel = message.guild.channels.cache.find(c => c.id === channelID)
Channel.send(`**Report from ${username}#${discriminator}**\nTime: ${time}\nDate: ${date}\nDescription: ${description}`).then((msg) => {
  // Use msg.awaitReactions() to check if the user reacted with a checkmark or a cross
  msg.react("✅");
  msg.react("❌");
  msg.awaitReactions((reaction, user) => {
    if (user.id === 152501641436856321 | user.id === 780775564574588972){
    // If the user reacted with a checkmark, delete the message
    if (reaction.emoji.name === "✅") {
      // Log the blooper to confirmed.json
      const fs = require("fs");
      const confirmed = require("../confirmed.json");
      const newBlooper = {
        time: time,
        date: date,
        channel: bbcChannel,
        description: description,
        reporter: `${username}#${discriminator}`
      };
      confirmed.push(newBlooper);
      fs.writeFile("./confirmed.json", JSON.stringify(confirmed), (err) => {
        if (err) console.log(err);
        message.send('Hmm, something went wrong. Contact Kat.')
      });

      message.reply("Report confirmed!");
    }
    // If the user reacted with a cross, delete the message
    if (reaction.emoji.name === "❌") {
      msg.delete();
      message.reply("Report cancelled");
    }
    }
  }
  );
});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "report",
  category: "Blooper Tracking",
  description: "Report a blooper!",
  usage: "report <4 digit time> <6 digit date> <channel> <description>"
};

