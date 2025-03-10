const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const { channel_logs, color_basic, role_delegates, role_mute } = require(process
  .env.CONSTANT);
const { Members } = require("../../dbObjects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("💼 Exclure un membre (qu'il ne puisse plus parler).")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Membre à exclure")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("durée")
        .setDescription("Durée de l'exclusion (en minutes)")
        .setMinValue(1)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison de l'exclusion")
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("membre");
    const duration = interaction.options.getInteger("durée");
    const reason = interaction.options.getString("raison");

    const user = interaction.member;
    const newTimeMute = Date.now() + duration * 60000;
    const logChannel = await interaction.guild.channels.fetch(channel_logs);

    // Check if the user can use this command (if user is not a delegate or an admin)
    if (
      !user.roles.cache.has(role_delegates) &&
      !user.permissions.has(PermissionFlagsBits.Administrator)
    )
      return interaction.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande.",
        ephemeral: true,
      });

    // Get the member in the database
    const memberDB = await Members.findOne({ where: { id: member.id } });

    // If the member is already muted
    if (memberDB && memberDB.mute_time) {
      const btnChangeMuteTime = new ButtonBuilder()
        .setCustomId("mute_change_time")
        .setLabel("Oui, modifier sa sanction")
        .setStyle(ButtonStyle.Secondary);

      return interaction.reply({
        content:
          `L'exclusion de ${member} prend fin <t:${parseInt(
            memberDB.mute_time / 1000
          )}:R>.\n` +
          `Souhaitez-vous modifier la durée de son exclusion pour qu'elle se termine <t:${parseInt(
            newTimeMute / 1000
          )}:R> ?`,
        components: [new ActionRowBuilder().addComponents(btnChangeMuteTime)],
        ephemeral: true,
      });
    }

    // Check if the member could be muted
    if (member.id === process.env.CLIENT_ID)
      return interaction.reply({
        content: "Vous ne pouvez pas sanctionner la mascotte.",
        ephemeral: true,
      });
    if (member.user.bot)
      return interaction.reply({
        content: "Vous ne pouvez pas sanctionner un bot.",
        ephemeral: true,
      });
    if (member.roles.cache.has(role_delegates))
      return interaction.reply({
        content: "Vous ne pouvez pas exclure un délégué.",
        ephemeral: true,
      });
    if (member.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: "Vous ne pouvez pas exclure un administrateur.",
        ephemeral: true,
      });

    // Add the time of mute in the database
    await Members.upsert(
      { id: member.id, mute_time: newTimeMute },
      { where: { id: member.id } }
    );

    // Launch the timeout
    setTimeout(async () => {
      const memberDB = await Members.findOne({ where: { id: member.id } });
      if (memberDB.mute_time > Date.now()) return;
      await Members.update({ mute_time: null }, { where: { id: member.id } });
      await member.roles.remove(role_mute, "Fin de l'exclusion");
    }, duration * 60000);

    // Add the mute role
    await member.roles.add(role_mute, user.user.username + " - " + reason);

    // Logs the event
    const embedLog = new EmbedBuilder()
      .setTitle(`Mute`)
      .setColor(color_basic)
      .setDescription(
        `**${member} a été mute.**
            > **Id :** \`${member.id}\` (\`${member.user.username}\`)
            > **Raison :** \`${
              reason === null ? `Aucune raison fourni` : `${reason}`
            }\`
            > **Durée :** \`${duration} minutes\`
            > **Fin de l'exclusion :** <t:${parseInt(newTimeMute / 1000)}:R>
            `
      )
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    await logChannel?.send({ embeds: [embedLog] });

    return interaction.reply({
      content:
        `${member} a bien été exclu avec comme raison : \`${reason}\`.\n` +
        `Son exclusion se terminera <t:${parseInt(newTimeMute / 1000)}:R>.`,
      ephemeral: true,
    });
  },
};
