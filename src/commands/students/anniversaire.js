const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);
const { Members } = require("../../dbObjects");
const { checkBirthdays } = require('../../functions.js');
const { Op } = require('sequelize');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anniversaire")
        .setDescription("👤 Ajouter sa date de naissance pour obtenir les avantages anniversaire.")
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ajouter")
                .setDescription("👤 Ajouter sa date de naissance.")
                .addStringOption((option) => option.setName("date").setDescription("Ta date de naissance (DD/MM/AAAA).").setMinLength(10).setMaxLength(10).setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("liste")
                .setDescription("👤 Liste des prochains anniversaires."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("modifier")
                .setDescription("👤 Modifier sa date de naissance.")
                .addStringOption((option) => option.setName("date").setDescription("Ta date de naissance (DD/MM/AAAA).").setMinLength(10).setMaxLength(10).setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("supprimer")
                .setDescription("👤 Supprimer sa date de naissance.")
                .addBooleanOption((option) => option.setName("confirmation").setDescription("Confirmer la suppression de votre date de naissance.").setRequired(true))),
    async execute(interaction) {
        const date = interaction.options.getString("date");
        const confirmation = interaction.options.getBoolean("confirmation");

        // Verify the date format
        let dateFormat, nextBirthday;
        const currentDate = new Date();
        const actualYear = currentDate.getFullYear();
        if (date) {
            const [day, month, year] = date.split("/");
            dateFormat = new Date(year, month - 1, day);
            if (dateFormat.getDate() != day || dateFormat.getMonth() + 1 != month || dateFormat.getFullYear() != year) return interaction.reply({ content: `La date entrée est invalide \`${date}\`.`, ephemeral: true });
            if (dateFormat > new Date()) return interaction.reply({ content: `La date entrée est invalide \`${date}\`.\nVeuillez saisir votre date de naissance en réutilisant cette commande.`, ephemeral: true });

            nextBirthday = new Date(actualYear, dateFormat.getMonth(), dateFormat.getDate());
            if (nextBirthday < new Date()) nextBirthday.setFullYear(actualYear + 1);
        }

        // Get the logs channel
        const channelLog = await interaction.guild.channels.fetch(channel_logs);


        let oldNextBirthday;
        let member = await Members.findOne({ where: { id: interaction.member.id } });
        const oldDate = member?.date_birthday;
        switch (interaction.options.getSubcommand()) {
            /**
             * Add the date of birthday
             */
            case "ajouter":
                if (member && member.date_birthday) return interaction.reply({ content: "Vous avez déjà ajouté votre date de naissance.", ephemeral: true });
                await Members.upsert({ id: interaction.member.id, date_birthday: dateFormat }, { where: { id: interaction.member.id } });

                await channelLog?.send({ content: `## 🎂 ${interaction.member} a ajouté sa date de naissance.\n> Date de naissance : <t:${parseInt(dateFormat / 1000)}:D> (\`${nextBirthday.getFullYear() - dateFormat.getFullYear() - 1} ans\`)` });

                await checkBirthdays(interaction.guild);

                return interaction.reply({ content: "Votre date de naissance a correctement été ajouté.\nMerci de votre investissement sur ce serveur discord.", ephemeral: true });

            /**
             * List the next birthdays
             */
            case "liste":
                // Get members ordered by next birthdays
                const members = await Members.findAll({ where: { date_birthday: { [Op.not]: null }} });
                if (!members.length) return interaction.reply({ content: "Aucun utilisateur n'a encore participé.", ephemeral: true });

                // Order the members list by next birthdays
                await members.sort((a, b) => {
                    const nextBirthdayA = new Date(actualYear, a.date_birthday.getMonth(), a.date_birthday.getDate());
                    if (nextBirthdayA < new Date().setHours(23, 59, 59, 999)) nextBirthdayA.setFullYear(actualYear + 1);
                    const nextBirthdayB = new Date(actualYear, b.date_birthday.getMonth(), b.date_birthday.getDate());
                    if (nextBirthdayB < new Date().setHours(23, 59, 59, 999)) nextBirthdayB.setFullYear(actualYear + 1);
                    return nextBirthdayA - nextBirthdayB;
                });

                // Division of members into groups of 10 for each page
                const pageSize = 10;
                const pageCount = Math.ceil(members.length / pageSize);

                // Displaying the first page of the list
                const currentPage = 1;
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = currentPage * pageSize;
                const birthdayPage = members.slice(startIndex, endIndex);

                // Display the list of birthdays
                const embed = new EmbedBuilder()
                    .setTitle("Prochains anniversaires")
                    .setDescription(birthdayPage.map((user) => {
                        nextBirthday = new Date(actualYear, user.date_birthday.getMonth(), user.date_birthday.getDate());
                        if (nextBirthday < new Date()) nextBirthday.setFullYear(actualYear + 1);
                        return `<t:${parseInt(nextBirthday / 1000)}:D> ▸ <@${user.id}> (\`${nextBirthday.getFullYear() - user.date_birthday.getFullYear() - 1} ans\`)`
                    }).join("\n"))
                    .setColor(color_basic)
                    .setFooter({ text: `Page ${currentPage}/${pageCount}` });

                // Displaying the navigation buttons
                const navigationRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("anniversaire_previous")
                            .setLabel("◀️")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 1),
                        new ButtonBuilder()
                            .setCustomId("anniversaire_next")
                            .setLabel("▶️")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pageCount)
                    );

                return interaction.reply({ embeds: [embed], components: [navigationRow], ephemeral: true });


            /**
             * Edit the date of birthday
             */
            case "modifier":
                if (!member || !member.date_birthday) return interaction.reply({ content: "Vous n'avez pas ajouté votre date de naissance.", ephemeral: true });
                await member.update({ date_birthday: dateFormat });

                oldNextBirthday = new Date(actualYear, oldDate.getMonth(), oldDate.getDate());
                if (oldNextBirthday < new Date()) oldNextBirthday.setFullYear(actualYear + 1);
                await channelLog?.send({ content: `## 🎂 ${interaction.member} a modifié sa date de naissance.\n> Ancienne date de naissance : <t:${parseInt(oldDate / 1000)}:D> (\`${oldNextBirthday.getFullYear() - oldDate.getFullYear() - 1} ans\`)\n> Nouvelle date de naissance : <t:${parseInt(dateFormat / 1000)}:D> (\`${nextBirthday.getFullYear() - dateFormat.getFullYear() - 1} ans\`)` });

                await checkBirthdays(interaction.guild);

                return interaction.reply({ content: "Votre date de naissance a correctement été modifié.\nMerci de votre investissement sur ce serveur discord.", ephemeral: true });

            /**
             * Delete the date of birthday
             */
            case "supprimer":
                member = await Members.findOne({ where: { id: interaction.member.id } });
                if (!member || !member.date_birthday) return interaction.reply({ content: "Vous n'avez pas ajouté votre date de naissance.", ephemeral: true });
                if (!confirmation) return interaction.reply({ content: "Vous devez confirmer la suppression de votre date de naissance.", ephemeral: true });
                await member.update({ date_birthday: null });
                await checkBirthdays(interaction.guild);

                oldNextBirthday = new Date(actualYear, oldDate.getMonth(), oldDate.getDate());
                if (oldNextBirthday < new Date()) oldNextBirthday.setFullYear(actualYear + 1);
                await channelLog?.send({ content: `## 🎂 ${interaction.member} a supprimé sa date de naissance.\n> Date de naissance : <t:${parseInt(oldDate / 1000)}:D> (\`${oldNextBirthday.getFullYear() - oldDate.getFullYear() - 1} ans\`)` });

                return interaction.reply({ content: "Votre date de naissance a correctement été supprimé.\nMerci de votre investissement sur ce serveur discord.", ephemeral: true });

            /**
             * DEFAULT
             */
            default:
                return interaction.reply({ content: "🚧 Une erreur est survenue.", ephemeral: true });
        }
    },
};