const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NjIxMjYxMjcwNDk0MDg1MTIw.XXje9w.3LZLzmUucL8H961uTJytwvkRXMw';
client.login(token);

const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: 1
};

//Commands help
client.on('message', function (message) {
    if (message.content == 'MiHelp') {
        message.channel.send('For Starting a Song use "Miqueue + Youtube-Url"');
    }
});

/// Music mod
var musicUrls = [];

client.on('message', async message => {
    if (message.author.bot)
        return;

    if (message.content.toLowerCase().startsWith("Miqueue")) {
        let args = message.content.split(" ");
        let url = args[1];
        let voiceChannel = message.guild.channels.find(channel => channel.id === '619812881721983019');

        if (ytdl.validateURL(url)) {
            console.log("Valid URL!");
            var flag = musicUrls.some(element => element == url);
            if (!flag) {
                musicUrls.push(url);

                if (voiceChannel != null) {
                    if (voiceChannel.connection) {
                        console.log("connection exists.");
                        const embed = new Discord.RichEmbed();
                        embed.setAuthor(client.user.username, client.user.displayAvatarUrl);
                        embed.serDescription("You've successfully added to the queue");
                        message.channel.send(embed);
                    } else {
                        try {
                            const voiceConnection = await voiceChannel.join();
                            await playSong(message.channel, voiceConnection, voiceChannel);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }
                }
            }
        }
    }
});
async function playSong(messageChannel, voiceConnection, voiceChannel) {
    const stream = ytdl(musicUrls[0], {
        filter: 'audioonly'
    });
    const dispatcher = voiceConnection.playStream(stream, streamOptions);

    dispatcher.on('end', () => {
        musicUrls.shift();

        if (musicUrls.length == 0)
            voiceChannel.leave();
        else {
            setTimeout(() => {
                playSong(messageChannel, voiceConnection, voiceChannel);
            }, 5000);
        }
    })
}
