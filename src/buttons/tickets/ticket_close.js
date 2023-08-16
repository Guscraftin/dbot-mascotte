const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { color_basic } = require(process.env.CONSTANT);
const { Tickets } = require('../../dbObjects');

module.exports = {
    data: {
        name: "ticket_close",
    },
    async execute(interaction) {
        const channel = interaction.channel;

        // Check if the ticket is already closed
        const ticket = await Tickets.findOne({ where: { channel_id: channel.id } });
        if (["closed", "deleted"].includes(ticket?.status)) return interaction.reply({ content: "Ce ticket est déjà fermé !", ephemeral: true });

        // Close the ticket
        await interaction.deferReply();
        const promises = await channel.permissionOverwrites.cache.map(async overwrite => {
            if (overwrite.type === 1) { // Only member permission
                await overwrite.edit({ ViewChannel: false });
            }
        });
        await Promise.all(promises);
        await ticket?.update({ status: "closed" });
        if (!channel.name.startsWith("🚨・")) {
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 10000);
            });
            const setNamePromise = channel.setName(`🚨・${channel.name}`).catch(() => { });
            await Promise.race([setNamePromise, timeoutPromise]);
        }

        // Send the confirmation message
        const closeTicket = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_reopen")
                    .setLabel("Réouvrir le ticket")
                    .setStyle(ButtonStyle.Secondary)
            ).addComponents(
                new ButtonBuilder()
                    .setCustomId("ticket_delete")
                    .setLabel("Supprimer le ticket")
                    .setStyle(ButtonStyle.Danger)
            );

        const embed = new EmbedBuilder()
            .setTitle("Ticket fermé")
            .setDescription(`Le ticket a été fermé par ${interaction.member}.`)
            .setColor(color_basic)

        return interaction.editReply({ embeds: [embed], components: [closeTicket] });
    }
}