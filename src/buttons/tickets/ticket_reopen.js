const { EmbedBuilder } = require("discord.js");
const { color_basic } = require(process.env.CONSTANT);
const { Tickets } = require('../../dbObjects');

module.exports = {
    data: {
        name: "ticket_reopen",
    },
    async execute(interaction) {
        const channel = interaction.channel;
        
        // Check if the ticket is already opened
        const ticket = await Tickets.findOne({ where: { channel_id: channel.id } });
        if (!ticket) return interaction.reply({ content: "Ce ticket n'existe pas ! Veuillez supprimer ce ticket et en réouvrir un nouveau avec l'utilisateur ou contactez un administrateur.", ephemeral: true });
        if (ticket?.status === "opened") return interaction.reply({ content: "Ce ticket est déjà ouvert !", ephemeral: true });

        // Reopen the ticket
        await interaction.deferReply();
        await channel.permissionOverwrites.cache.each(async overwrite => {
            if (overwrite.type === 1) { // Only member permission
                await overwrite.edit({ ViewChannel: true });
            }
        });
        await ticket.update({ status: "opened" });


        // Remove buttons on message "Ticket fermé"
        await interaction.message.edit({ components: [] });


        const embed = new EmbedBuilder()
            .setTitle("Ticket réouvert")
            .setDescription(`Le ticket a été réouvert par ${interaction.member}.`)
            .setColor(color_basic)
        
        await interaction.editReply({ embeds: [embed] });
    }
}