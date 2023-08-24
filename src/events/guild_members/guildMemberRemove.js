const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_no } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member){

        /**
         * Logs the event
         * TODO: Add the reason of leave (kick, ban, ...)
         */
        const logChannel = await member.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor(color_no)
            .setDescription(`• Nom d'utilisateur : ${member.displayName} - \`${member.user.tag}\` (${member.id})
            • Créé le : <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)
            • Rejoint le : <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)
            • Quitté le : <t:${parseInt(Date.now() / 1000)}:f> (<t:${parseInt(Date.now() / 1000)}:R>)
            `)
            .setTimestamp()
            .setFooter({ text: "L'utilisateur a quitté !" })

        logChannel.send({ embeds: [embed] });
    }
};