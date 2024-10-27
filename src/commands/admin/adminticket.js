const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { channel_logs_tickets, color_basic } = require(process.env.CONSTANT);
const { Tickets } = require("../../dbObjects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adminticket")
    .setDescription(
      "🔧 Permet de modifier les retranscriptions des tickets supprimés."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription(
          "🔧 Afficher la liste des transcriptions des tickets fermés."
        )
        .addUserOption((option) =>
          option
            .setName("membre")
            .setDescription(
              "L'utilisateur ou l'id de l'utilisateur à qui l'on souhaite récupérer ses tickets."
            )
        )
        .addStringOption((option) =>
          option
            .setName("categorie")
            .setDescription("La catégorie des tickets a récupérer.")
            .addChoices(
              { name: "Admins", value: "Admins" },
              { name: "Délégués", value: "Delegates" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("🔧 Supprimer une retranscription de ticket.")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("L'id de la retranscription.")
            .setMinValue(1)
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("confirm")
            .setDescription("Confirmer la suppression.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("deleteall")
        .setDescription(
          "🔧 Supprimer toutes les retranscriptoins d'un membre ou/et d'une catégorie."
        )
        .addUserOption((option) =>
          option
            .setName("membre")
            .setDescription(
              "L'utilisateur ou l'id de l'utilisateur où ses tickets seront supprimés."
            )
        )
        .addStringOption((option) =>
          option
            .setName("categorie")
            .setDescription("La catégorie des tickets a supprimer.")
            .addChoices(
              { name: "Admins", value: "Admins" },
              { name: "Délégués", value: "Delegates" }
            )
        )
        .addBooleanOption((option) =>
          option.setName("confirm").setDescription("Confirmer la suppression.")
        )
    ),
  async execute(interaction) {
    const id = interaction.options.getInteger("id");
    const member = interaction.options.getUser("membre");
    const category = interaction.options.getString("categorie");
    const confirm = interaction.options.getBoolean("confirm");

    let tickets;
    switch (interaction.options.getSubcommand()) {
      /**
       * List all transcriptions of closed tickets
       */
      case "list":
        await interaction.deferReply({ ephemeral: true });

        try {
          if (member && category)
            tickets = await Tickets.findAll({
              where: { user_id: member.id, category: category },
              order: [["updatedAt", "DESC"]],
            });
          else if (member)
            tickets = await Tickets.findAll({
              where: { user_id: member.id },
              order: [["updatedAt", "DESC"]],
            });
          else if (category)
            tickets = await Tickets.findAll({
              where: { category: category },
              order: [["updatedAt", "DESC"]],
            });
          else
            tickets = await Tickets.findAll({
              where: { channel_id: null },
              order: [["updatedAt", "DESC"]],
            });
        } catch (error) {
          console.error("adminticket list - " + error);
        }
        if (!tickets || tickets.length == 0)
          return interaction.editReply({
            content: `Aucune retranscription de ticket n'a été trouvée.`,
            ephemeral: true,
          });

        // Division of tickets into groups of 10 for each page
        const pageSize = 10;
        const pageCount = Math.ceil(tickets.length / pageSize);

        // Displaying the first page of the list
        const currentPage = 1;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        const ticketPage = tickets.slice(startIndex, endIndex);

        // Create embed fields
        let fields = [];
        const channel_ticket = await interaction.guild.channels
          .fetch(channel_logs_tickets)
          .catch(() => {});
        if (!channel_ticket || channel_ticket.size > 1)
          return interaction.editReply({
            content: `Le salon de logs des tickets n'a pas été trouvé.`,
            ephemeral: true,
          });
        await Promise.all(
          ticketPage.map(
            async ({ id, user_id, category, message_id, createdAt }) => {
              const msg = await channel_ticket.messages
                .fetch(message_id)
                .catch(() => {});
              if (msg) {
                fields.push({
                  name: `Id: ${id}`,
                  value: `<@${user_id}>・\`${category}\`\n${
                    msg.url
                  }・Datant du : <t:${parseInt(createdAt / 1000)}:F>`,
                });
              } else {
                fields.push({
                  name: `Id: ${id}`,
                  value: `<@${user_id}>・\`${category}\`\nMessage non trouvé・Datant du : <t:${parseInt(
                    createdAt / 1000
                  )}:F>`,
                });
              }
            }
          )
        );

        let description = "";
        if (member) description += `**Membre :** <@${member.id}>\n`;
        if (category) description += `**Catégorie :** ${category}\n`;
        if (description === "") description = " ";
        // Create embed
        const embed = new EmbedBuilder()
          .setTitle(`Liste des retranscriptions`)
          .setDescription(description)
          .addFields(fields)
          .setColor(color_basic)
          .setTimestamp()
          .setFooter({ text: `Page ${currentPage}/${pageCount}` });

        // Displaying the navigation buttons
        const navigationRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_previous")
            .setLabel("◀️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 1),
          new ButtonBuilder()
            .setCustomId("ticket_next")
            .setLabel("▶️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === pageCount)
        );

        return interaction.editReply({
          embeds: [embed],
          components: [navigationRow],
          ephemeral: true,
        });

      /**
       * Delete one ticket transcription
       */
      case "delete":
        if (!confirm)
          return interaction.reply({
            content: `Vous devez confirmer la suppression de l'élément désigné.`,
            ephemeral: true,
          });
        try {
          const ticket = await Tickets.findOne({ where: { id: id } });
          if (!ticket || ticket.length == 0)
            return interaction.reply({
              content: `La retranscription avec l'id \`${id}\` n'existe pas.`,
              ephemeral: true,
            });
          if (ticket?.message_id) {
            const logTickets = await interaction.guild.channels.fetch(
              channel_logs_tickets
            );
            const msg = await logTickets.messages.fetch(ticket.message_id);
            await msg.delete();
          }
          await Tickets.destroy({ where: { id: id } });
        } catch (error) {
          console.error("adminticket delete - " + error);
        }
        return interaction.reply({
          content: `La retranscription avec l'id \`${id}\` a été supprimé.`,
          ephemeral: true,
        });

      /**
       * Delete all tickets transcriptions
       */
      case "deleteall":
        if (!confirm)
          return interaction.reply({
            content: `Vous devez confirmer la suppression des éléments sélectionnés.`,
            ephemeral: true,
          });
        try {
          const logTickets = await interaction.guild.channels.fetch(
            channel_logs_tickets
          );
          if (member && category)
            tickets = await Tickets.findAll({
              where: { user_id: member.id, category: category },
            });
          else if (member)
            tickets = await Tickets.findAll({ where: { user_id: member.id } });
          else if (category)
            tickets = await Tickets.findAll({ where: { category: category } });
          else tickets = await Tickets.findAll();
          if (!tickets || tickets.length == 0)
            return interaction.reply({
              content: `Aucune retranscription de ticket n'a été trouvée.`,
              ephemeral: true,
            });
          await Promise.all(
            tickets.map(async (ticketFound) => {
              if (ticketFound.message_id) {
                const msg = await logTickets.messages.fetch(
                  ticketFound.message_id
                );
                await msg.delete();
              }
              await ticketFound.destroy();
            })
          );
        } catch (error) {
          console.error("adminticket deleteall - " + error);
        }
        return interaction.reply({
          content: `Tous les transcriptions des tickets ont été supprimés.`,
          ephemeral: true,
        });

      default:
        return interaction.reply({
          content: `Cette subcommand n'existe pas.`,
          ephemeral: true,
        });
    }
  },
};
