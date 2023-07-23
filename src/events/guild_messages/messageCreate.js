const { EmbedBuilder, Events } = require('discord.js');
const { channelSuggestions, colorNeutral, emojiYes, emojiNeutral, emojiNo } = require(process.env.CONSTANT);

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        /*
        * Suggestions system
        */
        if (message.channel.id === channelSuggestions && !message.author.bot) {
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
    },
};