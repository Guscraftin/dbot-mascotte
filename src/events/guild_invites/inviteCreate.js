const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.InviteCreate,
    async execute(invite){

        /**
         * Logs the event
         */
        const logChannel = await invite.guild.channels.fetch(channel_logs);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${invite.inviter.tag}`, iconURL: invite.inviter.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`**Invitation crée par ${invite.inviter} dans ${invite.channel}.**
            > **Code :** \`${invite.code}\`
            > **Expire le :** ${ invite.expiresTimestamp ? `<t:${parseInt(invite.expiresTimestamp / 1000)}:f> <t:${parseInt(invite.expiresTimestamp / 1000)}:R>` : `\`Jamais\``}
            > **Nombre d'utilisateur maximum :** ${invite.maxUses === 0 ? `\`Illimité\`` : `\`${invite.maxUses}\``}
            `)
            .setTimestamp()
            .setFooter({ text: invite.guild.name, iconURL: invite.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });
    }
};