
module.exports = {
    data: {
        name: "ticket_close",
    },
    async execute(interaction) {
        return interaction.channel.delete();
    }
}