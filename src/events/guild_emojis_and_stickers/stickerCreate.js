const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildStickerCreate,
    async execute(sticker){

        /**
         * Logs the event
         */
        const logChannel = await sticker.guild.channels.fetch(channel_logs);

        const embed = new EmbedBuilder()
            .setTitle(`Création d'un autocollant`)
            .setColor(color_basic)
            .setDescription(`**L'autocollant \`${sticker.name}\` a été créé par ${sticker.user === null ? `\`un modérateur\`` : `<@${sticker.user.id}>`}.**
            > **Emoji similaire :** :${sticker.tags}:
            ${sticker.description !== '' ? `>>> **Description :** \`\`\`${sticker.description}\`\`\`` : `` }
            `)
            .setImage(sticker.url)
            .setTimestamp()
            .setFooter({ text: sticker.guild.name, iconURL: sticker.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });
    }
};