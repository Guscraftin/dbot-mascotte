const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { channel_logs_tickets, color_basic } = require(process.env.CONSTANT);
const { Tickets } = require("../../dbObjects");

/**
 * Come from src/commands/admin/adminticket.js
 * And src/buttons/tickets/ticket_previous.js and src/buttons/tickets/ticket_next.js
 */

module.exports = {
  data: {
    name: "ticket_next",
  },
  async execute(interaction) {
    // Get information about the shop
    const oldEmbed = interaction.message.embeds[0];
    const description = oldEmbed.description;
    const currentPage = parseInt(
      oldEmbed.footer.text.split(" ")[1].split("/")[0]
    );
    const pageCount = parseInt(
      oldEmbed.footer.text.split(" ")[1].split("/")[1]
    );
    let member, category;
    if (description && description.includes("Membre")) {
      member = description
        .split("**Membre :** ")[1]
        .split("\n")[0]
        .split("<@")[1]
        .split(">")[0];
    }
    if (description && description.includes("Catégorie")) {
      category = description.split("**Catégorie :** ")[1].split("\n")[0];
    }

    // Recovering constants
    const pageSize = 10;
    let tickets;
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
      console.error("ticket_next - " + error);
    }
    if (!tickets || tickets.length == 0)
      return interaction.reply({
        content: `Aucune retranscription de ticket n'a été trouvée.`,
        ephemeral: true,
      });

    // Displaying the next page of the ticket
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * pageSize;
    const endIndex = nextPage * pageSize;
    const ticketPage = tickets.slice(startIndex, endIndex);

    // Display the ticket
    let fields = [];
    const channel_ticket = await interaction.guild.channels
      .fetch(channel_logs_tickets)
      .catch(() => {});
    if (!channel_ticket || channel_ticket.size > 1)
      return interaction.reply({
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

    let embed = new EmbedBuilder()
      .setTitle(oldEmbed.title)
      .setDescription(oldEmbed.description)
      .setFields(fields)
      .setColor(color_basic)
      .setColor(oldEmbed.color)
      .setFooter({ text: `Page ${nextPage}/${pageCount}` });

    // Displaying the navigation buttons
    const navigationRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_previous")
        .setLabel("◀️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(nextPage === 1),
      new ButtonBuilder()
        .setCustomId("ticket_next")
        .setLabel("▶️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(nextPage === pageCount)
    );

    return interaction.update({
      embeds: [embed],
      components: [navigationRow],
      ephemeral: true,
    });
  },
};
