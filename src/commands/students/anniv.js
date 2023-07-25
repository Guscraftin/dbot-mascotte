const { Collection, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { Members } = require("../../dbObjects");
const { getValidDate } = require("../../functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anniv")
        .setDescription("👤 Ajouter sa date de naissance pour obtenir les avantages anniversaire.")
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("date")
                .setDescription("Ta date de naissance (DD/MM/AAAA).").setMinLength(10).setMaxLength(10).setRequired(true)),

    async execute(interaction) {
        const date = interaction.options.getString("date");

        // Verify the date format
        const [day, month, year] = date.split("/");
        const dateFormat = new Date(year, month - 1, day);
        if (dateFormat.getDate() != day || dateFormat.getMonth() + 1 != month || dateFormat.getFullYear() != year) return interaction.reply({ content: `La date entrée est invalide \`${date}\`.`, ephemeral: true });
        if (dateFormat > new Date()) return interaction.reply({ content: `La date entrée est invalide \`${date}\`.\nVeuillez saisir votre date de naissance en réutilisant cette commande.`, ephemeral: true });

        // Update the date of birthday
        await Members.upsert({ id: interaction.member.id, date_birthday: dateFormat }, { where: { id: interaction.member.id } });


        return interaction.reply({ content: "Votre date de naissance a correctement été ajouté.\nMerci de votre investissement sur ce serveur discord.", ephemeral: true });
    },
};