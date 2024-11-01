const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  InteractionContextType,
} = require("discord.js");
const { Guilds } = require("../../dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("🔧 Configurer la base de donnée du serveur.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addBooleanOption((option) =>
      option
        .setName("automatic_verified")
        .setDescription("Activer la vérification automatique des membres")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("automatic_mention_idea-poll")
        .setDescription(
          "Activer la mention automatique pour les nouvelles idées et les nouveaux sondages."
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("mail_from_moodle")
        .setDescription(
          "Définir l'action lors de la réception d'une annonce provenant de moodle."
        )
        .addChoices(
          { name: "Automatique", value: "automatic" },
          { name: "Test-mail", value: "test_mail" },
          { name: "Désactivé", value: "desactivate" }
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("mail_from_other")
        .setDescription("Définir l'action lors de la réception d'un mail.")
        .addChoices(
          { name: "Test-mail", value: "test_mail" },
          { name: "Désactivé", value: "desactivate" }
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const automatic_verified =
      interaction.options.getBoolean("automatic_verified");
    const automatic_mention_idea_poll = interaction.options.getBoolean(
      "automatic_mention_idea-poll"
    );
    const mails_from_moodle = interaction.options.getString("mail_from_moodle");
    const mails_from_other = interaction.options.getString("mail_from_other");

    const guild = interaction.guild;

    // Update information about the guild in the database
    const updateData = {
      id: guild.id,
    };

    if (automatic_verified !== null) {
      updateData.automatic_verified = automatic_verified;
    }
    if (automatic_mention_idea_poll !== null) {
      updateData.automatic_mention_idea_poll = automatic_mention_idea_poll;
    }
    if (mails_from_moodle !== null) {
      updateData.mails_from_moodle = mails_from_moodle;
    }
    if (mails_from_other !== null) {
      updateData.mails_from_other = mails_from_other;
    }
    await Guilds.upsert(updateData, { where: { id: guild.id } });

    return interaction.reply({
      content: `La base de donnée du serveur a bien été mise à jour.`,
      ephemeral: true,
    });
  },
};
