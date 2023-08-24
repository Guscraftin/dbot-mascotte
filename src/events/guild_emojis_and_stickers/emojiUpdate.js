const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildEmojiUpdate,
    async execute(oldEmoji, newEmoji){

        /**
         * Logs the event
         */
        const logChannel = await newEmoji.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(`Modification d'un émoji`)
            .setColor(color_basic)
            .setDescription(`**L'émoji ${newEmoji} a été modifié.**
            ${oldEmoji.name !== newEmoji.name ? `> **Nom :** \`${oldEmoji.name}\` => \`${newEmoji.name}\`` : ``}
            `)
            .setThumbnail(newEmoji.url)
            .setTimestamp()
            .setFooter({ text: newEmoji.guild.name, iconURL: newEmoji.guild.iconURL() })

        logChannel.send({ embeds: [embed] });
    }
};