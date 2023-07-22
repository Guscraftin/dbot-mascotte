const { Members } = require("../../dbObjects");

module.exports = {
    data: {
        name: "mute_change_time",
    },
    async execute(interaction) {
        // Get information in the message
        const message = interaction.message;
        const member = message.mentions.members.first();
        const duration = message.content.split("<t:")[2].split(":R>")[0];

        // Get the member in the database
        const memberDB = await Members.findOne({ where: { id: member.id } });
        if (!memberDB) return interaction.reply({ content: "Ce membre n'est pas dans la base de donnée.", ephemeral: true });

        // Update the mute time
        await memberDB.update({ mute_time: duration * 1000 });

        // Return the message
        return interaction.reply({
            content: `L'exclusion de ${member} se terminera <t:${duration}:R>.`,
            ephemeral: true,
        });
    }
}