const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const { category_reserve, channel_logs_tickets, role_admins } = require(process
  .env.CONSTANT);
const { Tickets } = require("../../dbObjects");

module.exports = {
  data: {
    name: "ticket_delete",
  },
  async execute(interaction) {
    const channel = interaction.channel;

    // Get the transcript of the messages in channel
    const attachment = await discordTranscripts.createTranscript(channel);

    // Update the ticket in the database
    const ticket = await Tickets.findOne({ where: { channel_id: channel.id } });
    await ticket?.update({
      channel_id: null,
      status: "deleted",
    });

    // Only admin can access to the channel
    const promises = await channel.permissionOverwrites.cache.map(
      async (overwrite) => {
        if (overwrite.id !== interaction.guild.id)
          await overwrite.edit({ ViewChannel: false });
      }
    );
    await Promise.all(promises);

    // Button to delete the channel
    const deleteTicket = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_delete-admin")
        .setLabel("Supprimer le ticket")
        .setEmoji("🚨")
        .setStyle(ButtonStyle.Danger)
    );
    await channel.send({
      content: `## Seul les <@&${role_admins}> on accès à ce ticket.`,
      components: [deleteTicket],
    });
    await channel.setParent(category_reserve, { lockPermissions: false });
    await interaction.message.edit({ components: [] });

    // Send a message with the transcript to the staff channel
    const channelLogs = await interaction.guild.channels.fetch(
      channel_logs_tickets
    );
    if (!channelLogs) return;

    const channelNameSplit = channel.name.split("-");
    const msg = await channelLogs.send({
      content: `**Le ticket de ${
        ticket?.user_id
          ? `<@${ticket.user_id}>`
          : `\`${channelNameSplit.slice(1).join("-")}\``
      } a été fermé par ${interaction.user}.${
        ticket?.id ? ` (\`#${ticket.id}\`)` : ``
      }**\n**Catégorie :** \`${
        ticket?.category
      }\`\n**Date d'ouverture du ticket :** <t:${parseInt(
        channel.createdAt / 1000
      )}:F> (<t:${parseInt(
        channel.createdAt / 1000
      )}:R>)\n**Date de fermeture du ticket :** <t:${parseInt(
        Date.now() / 1000
      )}:F> (<t:${parseInt(Date.now() / 1000)}:R>)`,
      files: [attachment],
    });

    await ticket?.update({
      message_id: msg.id,
      message_url: msg.url,
    });
  },
};
