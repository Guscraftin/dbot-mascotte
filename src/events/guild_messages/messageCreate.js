const { EmbedBuilder, Events } = require('discord.js');
const { channelSuggestions, colorNeutral, emojiYes, emojiNeutral, emojiNo } = require(process.env.CONSTANT);

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        /*
        * Suggestions system
        */
        if (message.channel.id === channelSuggestions && !message.author.bot) {
            const emojiRegex = /<:[a-zA-Z_\d]+:\d+>|\p{Extended_Pictographic}/gu;
            const emojiArray = message.content.match(emojiRegex) || [];
            const emojiArrayFiltered = emojiArray.filter(emoji => emoji !== '💬' && emoji !== '🗑️');

            if (emojiArrayFiltered.length > 0) {
                // Poll message
                const embedPoll = new EmbedBuilder()
                    .setAuthor({ name: `${message.member.displayName} (${message.author.id})`, iconURL: message.author.displayAvatarURL() })
                    .setColor(colorNeutral)
                    .setDescription(message.content)
                    .setTimestamp()
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                
                await message.delete();
                
                const msgPoll = await message.channel.send({ embeds: [embedPoll] });
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
                // Suggestions message
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${message.member.displayName} (${message.author.id})`, iconURL: message.author.displayAvatarURL() })
                    .setColor(colorNeutral)
                    .setDescription(message.content)
                    .setTimestamp()
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
    
                await message.delete();
    
                const msg = await message.channel.send({ embeds: [embed] });
                await msg.react(emojiYes);
                await msg.react(emojiNeutral);
                await msg.react(emojiNo);
                await msg.react('💬');
                await msg.react('🗑️');
            }
        }
    },
};