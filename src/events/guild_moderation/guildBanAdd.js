const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildBanAdd,
    async execute(ban){

        /**
         * Logs the event
         */
        const logChannel = await ban.guild.channels.fetch(channel_logs);

        let reason;
        await ban.guild.bans.fetch(ban.user).then(function (ban) {
            reason = ban.reason;
        });

        const embed = new EmbedBuilder()
            .setTitle(`Banissement`)
            .setColor(color_basic)
            .setDescription(`**\`${ban.user.tag}\` a été banni.**
            > **Id :** \`${ban.user.id}\`
            > **Surnom :** \`${ban.user.username}\`
            > **Raison :** \`${reason === null ? `Aucune raison fourni` : `${reason}`}\`
            `)
            .setThumbnail(ban.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });
    }
};