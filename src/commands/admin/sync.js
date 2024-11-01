const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  InteractionContextType,
} = require("discord.js");
const { channel_muted, role_mute } = require(process.env.CONSTANT);
const {
  checkBirthdays,
  removeEmptyVoiceChannel,
  syncRoles,
} = require("../../functions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("🔧 Synchroniser certains modules.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) =>
      option
        .setName("module")
        .setDescription("Module à synchroniser.")
        .addChoices(
          { name: "role_mute", value: "role_mute" },
          { name: "vocals", value: "vocals" },
          { name: "roles", value: "roles" },
          { name: "birthday", value: "birthday" },
          { name: "all", value: "all" }
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const guild = interaction.guild;

    await interaction.deferReply({ ephemeral: true });

    let channels, promises;
    switch (interaction.options.getString("module")) {
      /**
       * Sync permissions of the mute role
       */
      case "role_mute":
        channels = await guild.channels.fetch();
        promises = channels.map(async (channel) => {
          if (channel.id === channel_muted) {
            await channel.permissionOverwrites.edit(role_mute, {
              ViewChannel: true,
              SendMessages: true,
              SendMessagesInThreads: true,
              CreatePublicThreads: true,
              CreatePrivateThreads: true,
              AddReactions: true,
            });
          } else {
            await channel.permissionOverwrites.edit(role_mute, {
              SendMessages: false,
              SendMessagesInThreads: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              AddReactions: false,
              Speak: false,
            });
          }
        });
        await Promise.all(promises);

        return interaction.editReply({
          content: `Les permissions du rôle <@&${role_mute}> ont bien été synchroniser dans tous les salons notamment dans <#${channel_muted}>.`,
          ephemeral: true,
        });

      /**
       * Sync vocals channels
       */
      case "vocals":
        await removeEmptyVoiceChannel(guild);

        return interaction.editReply({
          content: `Les salons vocaux ont bien été synchroniser.`,
          ephemeral: true,
        });

      /**
       * Sync roles (role_separator and role_vocal)
       */
      case "roles":
        await syncRoles(guild);

        return interaction.editReply({
          content: `Les rôles ont bien été synchroniser.`,
          ephemeral: true,
        });

      /**
       * Sync birthday (role, channel and message)
       */
      case "birthday":
        await checkBirthdays(guild);

        return interaction.editReply({
          content: `Les anniversaires ont bien été synchroniser.`,
          ephemeral: true,
        });

      /**
       * Sync all modules in this command
       */
      case "all":
        channels = await guild.channels.fetch();
        promises = channels.map(async (channel) => {
          if (channel.id === channel_muted) {
            await channel.permissionOverwrites.edit(role_mute, {
              ViewChannel: true,
              SendMessages: true,
              SendMessagesInThreads: true,
              CreatePublicThreads: true,
              CreatePrivateThreads: true,
              AddReactions: true,
            });
          } else {
            await channel.permissionOverwrites.edit(role_mute, {
              SendMessages: false,
              SendMessagesInThreads: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              AddReactions: false,
              Speak: false,
            });
          }
        });
        await Promise.all(promises);
        await syncRoles(guild);
        await removeEmptyVoiceChannel(guild);
        await checkBirthdays(guild);

        return interaction.editReply({
          content: `Tous les modules ont bien été synchroniser.`,
          ephemeral: true,
        });

      /**
       * DEFAULT
       */
      default:
        return interaction.editReply({
          content: "🚧 Ce module n'existe pas. Contactez un administrateur.",
          ephemeral: true,
        });
    }
  },
};
