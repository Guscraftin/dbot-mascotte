const { EmbedBuilder, Events } = require('discord.js');
const { 
    channel_agenda, channel_absence, channel_idea_poll,
    color_neutral, emoji_yes, emoji_neutral, emoji_no,
    role_agenda, role_absence, role_idea_poll
} = require(process.env.CONSTANT);
const { Guilds } = require('../../dbObjects.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        /*
        * Suggestion system
        */
        if (message.channel.id === channel_idea_poll && !message.author.bot) {
            const emojiRegex = /<:[a-zA-Z_\d]+:\d+>|\p{Extended_Pictographic}/gu;
            const emojiArray = message.content.match(emojiRegex) || [];
            const emojiArrayFiltered = emojiArray.filter(emoji => emoji !== '💬' && emoji !== '🗑️');

            if (emojiArrayFiltered.length > 0) {
                // Poll message
                const embedPoll = new EmbedBuilder()
                    .setAuthor({ name: `${message.member.displayName} (${message.author.id})`, iconURL: message.author.displayAvatarURL() })
                    .setColor(color_neutral)
                    .setDescription(message.content)
                    .setTimestamp()
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                
                await message.delete();
                
                let msgPoll;
                if (message.attachments.size > 0) {
                    await message.channel.send({ embeds: [embedPoll] });
                    msgPoll = await message.channel.send({ files: message.attachments.map(attachment => attachment.url) });
                } else {
                    msgPoll = await message.channel.send({ embeds: [embedPoll] });
                }
                let index = 0; // Limit of 20 reactions under a message
                let maxReactions = emojiArrayFiltered.length;
                if (emojiArrayFiltered.length > 18) {
                    maxReactions = 18;
                    await message.author.send({ content: `⚠️ **Le nombre de réactions est limité à 18 par sondage dans <#${message.channel.id}>.** Les \`${emojiArrayFiltered.length - 18}\` dernières réactions de ton message n'ont pas pu être ajoutées.\nSi le message ne te convient pas, tu peux le supprimer en cliquant sur l'emoji \`🗑️\` situé en dessous.` });
                }
                while (index < maxReactions) {
                    await msgPoll.react(emojiArrayFiltered[index]);
                    index++;
                }
                await msgPoll.react('💬');
                await msgPoll.react('🗑️');
                
            } else {
                // idea_poll message
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${message.member.displayName} (${message.author.id})`, iconURL: message.author.displayAvatarURL() })
                    .setColor(color_neutral)
                    .setDescription(message.content)
    
                await message.delete();
    
                let msg;
                if (message.attachments.size > 0) {
                    await message.channel.send({ embeds: [embed] });
                    msg = await message.channel.send({ files: message.attachments.map(attachment => attachment.url) });
                } else {
                    msg = await message.channel.send({ embeds: [embed] });
                }
                await msg.react(emoji_yes);
                await msg.react(emoji_neutral);
                await msg.react(emoji_no);
                await msg.react('💬');
                await msg.react('🗑️');
            }

            // Mention the notification role
            const guild = await Guilds.findOne({ where: { id: message.guild.id } });
            if (guild) {
                if (guild.automatic_mention_idea_poll && !guild.blacklist_mention_idea_poll.includes(message.author.id)) {
                    const notificationMsg = await message.channel.send({ content: `<@&${role_idea_poll}>` });
                    await notificationMsg.delete();
                }
            }

        /*
        * Mention system (agenda & absence)
        */
        } else if (message.content.startsWith('!') && message.content.length < 5) {
            if (message.channel.id === channel_agenda) {
                message.delete();
                const msg = await message.channel.send({ content: `<@&${role_agenda}>` });
                msg.delete();
            } else if (message.channel.id === channel_absence) {
                message.delete();
                const msg = await message.channel.send({ content: `<@&${role_absence}>` });
                msg.delete();
            }
        }
    },
};