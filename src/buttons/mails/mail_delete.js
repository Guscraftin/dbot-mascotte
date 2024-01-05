
module.exports = {
    data: {
        name: "mail_delete",
    },
    async execute(interaction) {
        return interaction.message.delete();
    }
}