const Discord = require("discord.js");
const https = require('https');
var totalMessages = 0;
var honkSounds = [ "honk1.mp3", "honk2.mp3", "honk3.mp3", "honk4.mp3" ];

const client = new Discord.Client();

const config = require("./config.json");
// config.token contains the bot's token.
// config.prefix contains the message prefix.
// config.app contains the app name that is triggered after the prefix.

client.on("ready", () => {
    client.user.setActivity('!' + config.app + ' (' + client.guilds.cache.size + ' servers)');
    console.log("Ready");
});

client.on("guildCreate", guild => {
    client.user.setActivity('!' + config.app + ' (' + client.guilds.cache.size + ' servers)');
});

//removed from a server
client.on("guildDelete", guild => {
    client.user.setActivity('!' + config.app + ' (' + client.guilds.cache.size + ' servers)');
});

client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) {
        return;
    };

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const honkbot = args.shift().toLowerCase();

    if (honkbot !== config.app) {
        return;
    }
    totalMessages++;
    message.delete({ timeout: 0 });
    var voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
        voiceChannel.join().then(function(connection) {
            var randomHonk = Math.floor(Math.random() * Math.floor(honkSounds.length));
            const dispatcher = connection.play(honkSounds[randomHonk]);
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
    } else {
        message.reply("You are not on an active voice channel, HONK amongst yourself").then(function (reply) {
            if (!reply.deleted) { reply.delete({ timeout: 4000 }); }
        });
    }
});


client.login(config.token);