const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { channelMuted, roleMute } = require(process.env.CONSTANT);
const { removeEmptyVoiceChannel, syncRoles } = require('../../functions.js');

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
                    { name: 'vocals', value: 'vocals' },
                    { name: 'roles', value: 'roles' },
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const guild = interaction.guild;

        await interaction.deferReply({ ephemeral: true });

        let promises;
        switch (interaction.options.getString("module")) {
            /**
             * Sync permissions of the mute role
             */
            case "role_mute":
                const channels = await guild.channels.fetch();

                promises = channels.map(async (channel) => {
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

                return interaction.editReply({ content: `Les permissions du rôle <@&${roleMute}> ont bien été synchroniser dans tous les salons notamment dans <#${channelMuted}>.`, ephemeral: true });


            /**
             * Sync vocals channels
             */
            case "vocals":
                await removeEmptyVoiceChannel(guild);

                return interaction.editReply({ content: `Les salons vocaux ont bien été synchroniser.`, ephemeral: true });


            /**
             * Sync roles (roleSeparator and roleVocal)
             */
            case "roles":
                await syncRoles(guild);

                return interaction.editReply({ content: `Les rôles ont bien été synchroniser.`, ephemeral: true });


            /**
             * DEFAULT
             */
            default:
                return interaction.editReply({ content: "🚧 Ce module n'existe pas. Contactez un administrateur.", ephemeral: true });
        }
    },
};