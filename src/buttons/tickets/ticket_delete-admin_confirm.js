module.exports = {
  data: {
    name: "ticket_delete-admin_confirm",
  },
  async execute(interaction) {
    await interaction.channel.delete();
  },
};
