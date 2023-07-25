const { role_mute } = require(process.env.CONSTANT);
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

        // Launch the timeout
        setTimeout(async () => {
            const memberDB = await Members.findOne({ where: { id: member.id } });
            if (memberDB.mute_time > Date.now()) return;
            await Members.update({ mute_time: null }, { where: { id: member.id } });
            await member.roles.remove(role_mute, "Fin de l'exclusion");
        }, duration*1000 - Date.now());

        // Return the message
        return interaction.reply({
            content: `L'exclusion de ${member} se terminera <t:${duration}:R>.`,
            ephemeral: true,
        });
    }
}