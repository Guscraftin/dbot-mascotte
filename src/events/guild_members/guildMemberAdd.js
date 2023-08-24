const { EmbedBuilder, Events } = require('discord.js');
const { channel_logs, color_yes, role_separator, role_students } = require(process.env.CONSTANT);
const { Guilds } = require('../../dbObjects.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) return;

        // Get information about the guild in the database
        let guildDB = await Guilds.findOne({ where: { id: member.guild.id } });
        if (!guildDB) guildDB = await Guilds.create({ id: member.guild.id });

        // Add the role to the member
        if (guildDB.automatic_verified) await member.roles.add(role_students);
        await member.roles.add(role_separator);



        /**
         * Logs the event
         */
        const logChannel = await member.guild.channels.fetch(channel_logs);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.tag} (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor(color_yes)
            .setDescription(`• Nom d'utilisateur : ${member} - \`${member.user.tag}\` (${member.id})
            • Créé le : <t:${parseInt(member.user.createdTimestamp / 1000)}:f> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)
            • Rejoint le : <t:${parseInt(member.joinedTimestamp / 1000)}:f> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)
            `)
            .setTimestamp()
            .setFooter({ text: "L'utilisateur a rejoint !" })

        logChannel?.send({ embeds: [embed] });
    },
};