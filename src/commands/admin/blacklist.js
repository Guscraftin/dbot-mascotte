const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { Guilds } = require("../../dbObjects.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("🔧 Modifier une blacklist du serveur.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("La blacklist à modifier.")
        .addChoices({
          name: "Mention Idée Sondage",
          value: "blacklist_mention_idea_poll",
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("L'action à effectuer sur la blacklist.")
        .addChoices(
          { name: "Ajouter", value: "add" },
          { name: "Retirer", value: "remove" },
          { name: "Lister", value: "list" },
          { name: "Vider", value: "clear" }
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("L'utilisateur à ajouter ou retirer de la blacklist.")
    ),
  async execute(interaction) {
    const type = interaction.options.getString("type");
    const action = interaction.options.getString("action");
    const user = interaction.options.getUser("user");

    if (user && user.bot)
      return interaction.reply({
        content: `Tu ne peux pas ajouter un bot à la blacklist.`,
        ephemeral: true,
      });

    const guild = await Guilds.findOne({ where: { id: interaction.guild.id } });
    if (!guild)
      return interaction.reply({
        content: `Ce serveur n'a pas encore été configuré dans la base de données. Veuillez utiliser la commande \`/config\` du bot.`,
        ephemeral: true,
      });

    switch (action) {
      /**
       * Add a user to the blacklist
       */
      case "add":
        if (!user)
          return interaction.reply({
            content: `Tu dois spécifier un utilisateur à ajouter à la blacklist.`,
            ephemeral: true,
          });
        if (guild[type].includes(user.id))
          return interaction.reply({
            content: `L'utilisateur <@${user.id}> est déjà dans la blacklist.`,
            ephemeral: true,
          });

        await guild.update({
          blacklist_mention_idea_poll: [...guild[type], user.id],
        });
        return interaction.reply({
          content: `L'utilisateur <@${user.id}> a bien été ajouté à la blacklist.`,
          ephemeral: true,
        });

      /**
       * Remove a user from the blacklist
       */
      case "remove":
        if (!user)
          return interaction.reply({
            content: `Tu dois spécifier un utilisateur à retirer de la blacklist.`,
            ephemeral: true,
          });
        if (!guild[type].includes(user.id))
          return interaction.reply({
            content: `L'utilisateur <@${user.id}> n'est pas dans la blacklist.`,
            ephemeral: true,
          });

        await guild.update({
          blacklist_mention_idea_poll: guild[type].filter(
            (id) => id !== user.id
          ),
        });
        return interaction.reply({
          content: `L'utilisateur <@${user.id}> a bien été retiré de la blacklist.`,
          ephemeral: true,
        });

      /**
       * List all users in the blacklist
       */
      case "list":
        if (guild[type].length === 0)
          return interaction.reply({
            content: `La blacklist est vide.`,
            ephemeral: true,
          });

        // TODO: Warning about the length of the blacklist for the display of the message
        const users = guild[type].map((id) => `<@${id}>`);
        return interaction.reply({
          content: `Liste des utilisateurs dans la blacklist :\n${users.join(
            "\n"
          )}`,
          ephemeral: true,
        });

      /**
       * Clear the blacklist
       */
      case "clear":
        if (guild[type].length === 0)
          return interaction.reply({
            content: `La blacklist est déjà vide.`,
            ephemeral: true,
          });

        await guild.update({ blacklist_mention_idea_poll: [] });
        return interaction.reply({
          content: `La blacklist a bien été vidée.`,
          ephemeral: true,
        });

      /**
       * DEFAULT
       */
      default:
        return interaction.reply({
          content: `L'action \`${action}\` n'est pas reconnue. Veuillez contacter un administrateur.`,
          ephemeral: true,
        });
    }
  },
};
