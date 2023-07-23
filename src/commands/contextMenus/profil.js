const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
const { colorBasic } = require(process.env.CONSTANT);
const { Members } = require('../../dbObjects');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Profil')
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        // Get the information about the member
        const user = await Members.findOne({ where: { id: interaction.targetId } });
        const member = await interaction.guild.members.fetch(interaction.targetId);

        // Create the embed
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.displayName} (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor(colorBasic)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        // If the user is in the database (set description and fields)
        if (user) {
            embed.setDescription(`Voici les informations de ce membre :`)
            
            const fields = [
                { name: "Date d'anniversaire", value: "23 mars 2023", inline: true },
            ];
            if (user.mute_time) fields.push({ name: "Sanction: Exclusion", value: `Se termine <t:${parseInt(user.mute_time / 1000)}:R>`, inline: true });
            embed.setFields(fields)

        // If the user is not in the database (set description)
        } else {
            embed.setDescription(`Ce membre n'est pas enregistré dans la base de données.`)
        }

        return interaction.reply({ embeds: [embed], ephemeral: true})
    }
}