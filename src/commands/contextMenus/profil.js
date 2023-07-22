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
        if (!user) return interaction.reply({ content: "Ce membre n'est pas dans la base de données.", ephemeral: true });

        const member = await interaction.guild.members.fetch(interaction.targetId);

        // Create the embed
        const fields = [
            { name: "Date d'anniversaire", value: "23 mars 2023", inline: true },
        ];
        if (user.mute_time) fields.push({ name: "Sanction: Exclusion", value: `Se termine <t:${parseInt(user.mute_time / 1000)}:R>`, inline: true }); 

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${member.displayName} (${member.id})`, iconURL: member.user.displayAvatarURL() })
            .setColor(colorBasic)
            .setDescription(`Voici les informations de ce membre :`)
            .setFields(fields)
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        return interaction.reply({ embeds: [embed], ephemeral: true})
    }
}