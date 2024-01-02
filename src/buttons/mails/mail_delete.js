
module.exports = {
    data: {
        name: "mail_delete",
    },
    async execute(interaction) {
        await interaction.message.delete();
        return interaction.reply({ content: `Le mail a bien été supprimé.`, ephemeral: true });
    }
}