const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.InviteDelete,
    async execute(invite){

        /**
         * Logs the event
         */
        const logChannel = await invite.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('Invitation : Suppression')
            .setColor(color_basic)
            .setDescription(`**Invitation supprimé par ${invite.inviterId === null ? `\`un modérateur\`` : `<@${invite.inviterId}>`} dans ${invite.channel}.**
            > **Code :** \`${invite.code}\`
            ${invite.createdTimestamp === null ? `` : `> **Crée le :** <t:${parseInt(invite.createdTimestamp / 1000)}:f> <t:${parseInt(invite.createdTimestamp / 1000)}:R>\n`} > **A invité :** \`${invite.memberCount === null ? `0` : `${invite.memberCount}`}\` utilisateurs
            `)
            .setTimestamp()
            .setFooter({ text: invite.guild.name, iconURL: invite.guild.iconURL() })

        logChannel.send({ embeds: [embed] });
    }
};