const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: {
    name: "ticket_delete-admin",
  },
  async execute(interaction) {
    const deleteTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_delete-admin_confirm")
        .setLabel("Oui ▸ Supprimer définitivement")
        .setEmoji("🚨")
        .setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({
      content: "## Voulez-vous supprimer définitivement ce ticket ?",
      components: [deleteTicket],
      ephemeral: true,
    });
  },
};
