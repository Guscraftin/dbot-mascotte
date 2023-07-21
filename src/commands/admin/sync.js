const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { channelMuted, roleMute } = require(process.env.CONSTANT);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sync")
        .setDescription("🚧 Permet de synchroniser certains modules.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("module")
                .setDescription("🚧 Module à synchroniser.")
                .addChoices(
                    { name: 'role_mute', value: 'role_mute' },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        switch (interaction.options.getString("module")) {
            /**
             * Sync permissions of the mute role
             */
            case "role_mute":
                const guild = interaction.guild;
                const channels = await guild.channels.fetch();

                const promises = channels.map(async (channel) => {
                    if (channel.id === channelMuted) {
                        await channel.permissionOverwrites.edit(roleMute, {
                            ViewChannel: true,
                            SendMessages: true,
                            SendMessagesInThreads: true,
                            CreatePublicThreads: true,
                            CreatePrivateThreads: true,
                            AddReactions: true,
                        });
                    } else {
                        await channel.permissionOverwrites.edit(roleMute, {
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

                return interaction.reply({ content: `Les permissions du rôle <@&${roleMute}> ont bien été synchroniser dans tous les salons notamment dans <#${channelMuted}>.`, ephemeral: true });


            /**
             * DEFAULT
             */
            default:
                return interaction.reply({ content: "🚧 Ce module n'existe pas. Contactez un administrateur.", ephemeral: true });
        }
    },
};