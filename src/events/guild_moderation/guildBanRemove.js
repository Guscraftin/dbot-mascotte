const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildBanRemove,
    async execute(ban){

        /**
         * Logs the event
         */
        const logChannel = await ban.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle(`Débanissement`)
            .setColor(color_basic)
            .setDescription(`**\`${ban.user.tag}\` a été débanni.**
            > **Id :** \`${ban.user.id}\`
            > **Surnom :** \`${ban.user.username}\`
            > **Raison :** \`${ban.reason === null ? `Aucune raison fourni` : `${ban.reason}`}\`
            `)
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL() })
        
        logChannel.send({ embeds: [embed] });
    }
};