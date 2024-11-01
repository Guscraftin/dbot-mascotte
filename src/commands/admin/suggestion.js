const {
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { channel_idea_poll, color_yes, color_no } = require(process.env
  .CONSTANT);
const { Suggestions } = require("../../dbObjects");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("🔧 Modifier l'état d'une suggestion.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("action")
        .addChoices(
          { name: "accepter", value: "accepter" },
          { name: "refuser", value: "refuser" },
          { name: "commenter", value: "commenter" }
        )
        .setDescription("Action à effectuer sur la suggestion.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("L'id du message de la suggestion.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("commentaire")
        .setDescription("Le commentaire a ajouter.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const action = interaction.options.getString("action");
    const messageId = interaction.options.getString("id");
    const comment = interaction.options.getString("commentaire");

    // Check if the id is a number
    const onlyNumber = /^\d+$/;
    if (!onlyNumber.test(messageId))
      return interaction.reply({
        content: "L'id doit être l'identifiant du message de la suggestion.",
        ephemeral: true,
      });

    // Get the suggestion in the database
    const suggestion = await Suggestions.findOne({
      where: { message_id: messageId },
    });
    if (suggestion === null)
      return interaction.reply({
        content:
          "Cette suggestion n'existe pas dans la base de donnée. Veuillez contacter un admin.",
        ephemeral: true,
      });

    // Get the message of the suggestion
    const message = await interaction.guild.channels
      .fetch(channel_idea_poll)
      .then((channel) =>
        channel.messages.fetch(suggestion.message_id).catch(() => null)
      );
    if (!message)
      return interaction.reply({
        content: "Ce message n'existe pas.",
        ephemeral: true,
      });
    if (suggestion.is_answered)
      return interaction.reply({
        content: `Cette [suggestion](${message.url}) a déjà été traitée.`,
        ephemeral: true,
      });
    const embedMsg = message.embeds[0];

    // Const to delete the specials emojis
    const deleteEmojis = ["💬", "🗑️"];
    const reactions = await message.reactions.cache.filter((reactionEmoji) =>
      deleteEmojis.includes(reactionEmoji.emoji.name)
    );

    // Update the suggestion
    switch (action) {
      /**
       * Accept a suggestion
       */
      case "accepter":
        let acceptEmbed;
        if (comment) {
          acceptEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${embedMsg.author.name} - ✅ Suggestion acceptée par ${interaction.member.displayName}`,
            })
            .setColor(color_yes)
            .setDescription(embedMsg.description)
            .setFields([{ name: "Commentaire :", value: `>>> ${comment}` }]);
        } else {
          acceptEmbed = new EmbedBuilder()
            .setAuthor({
              name: `${embedMsg.author.name} - ✅ Suggestion acceptée par ${interaction.member.displayName}`,
            })
            .setColor(color_yes)
            .setDescription(embedMsg.description);
        }

        // Remove the specials emojis
        await reactions.each((reaction) => reaction.remove());

        // Edit the message and reply
        await message.edit({ embeds: [acceptEmbed] });
        await suggestion.update({ is_answered: true });
        return interaction.reply({
          content: `La [suggestion](${message.url}) a été **acceptée**.`,
          ephemeral: true,
        });

      /**
       * Refuse a suggestion
       */
      case "refuser":
        const refuseEmbed = new EmbedBuilder()
          .setAuthor({
            name: `${embedMsg.author.name} - ❌ Suggestion refusée par ${interaction.member.displayName}`,
          })
          .setColor(color_no)
          .setDescription(embedMsg.description)
          .setFields([{ name: "Raison :", value: `>>> ${comment}` }]);

        // Remove the specials emojis
        await reactions.each((reaction) => reaction.remove());

        // Edit the message and reply
        await message.edit({ embeds: [refuseEmbed] });
        await suggestion.update({ is_answered: true });
        return interaction.reply({
          content: `La [suggestion](${message.url}) a été **refusée**.`,
          ephemeral: true,
        });

      /**
       * Comment a suggestion
       */
      case "commenter":
        const commentEmbed = new EmbedBuilder()
          .setAuthor(embedMsg.author)
          .setColor(embedMsg.color)
          .setDescription(embedMsg.description)
          .setFields([{ name: "Commentaire :", value: `>>> ${comment}` }]);

        await message.edit({ embeds: [commentEmbed] });
        return interaction.reply({
          content: `La [suggestion](${message.url}) a été **commentée**.`,
          ephemeral: true,
        });

      /**
       * DEFAULT
       */
      default:
        return interaction.reply({
          content: "Cette action n'existe pas.",
          ephemeral: true,
        });
    }
  },
};
