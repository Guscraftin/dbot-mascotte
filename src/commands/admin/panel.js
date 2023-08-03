const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { color_basic } = require(process.env.CONSTANT);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('🔧 Deployer un panel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('name').setDescription('🔧 Deployer un panel.').addChoices(
                { name: 'Tickets', value: 'tickets' },
            ).setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        /**
         * Create embed and select menu for the ticket panel
         */
        const embed = new EmbedBuilder()
            .setDescription(`# \`📩\` - Ouvrir un ticket
Grâce à ce panel, vous pouvez **ouvrir un ticket destiné aux admins ou aux délégués**. Pour cela, il vous suffit de cliquer sur l'option correspondante. Une fois cela fait, un nouveau salon sera créé où vous pourrez discuter avec les admins ou les délégués.
### Voici une liste non exhaustive des raisons pour lesquelles vous pouvez ouvrir un ticket aux admins (\`🔧\`) :
- Demander des permissions supplémentaires afin d'organiser un événement.
- Signaler un problème avec le bot du serveur.
### Voici une liste non exhaustive des raisons pour lesquelles vous pouvez ouvrir un ticket aux délégués (\`💼\`) :
- Discuter d'un problème rencontré, comme une surcharge de travail ou un problème avec un professeur.
- Proposer des améliorations auprès de l'administration.

PS : Pour plus d'informations, consultez <#1130459961315577926>.`)
            .setColor(color_basic);

        const selectRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('panel_tickets')
                .setPlaceholder('Ouvrir un ticket aux...')
                .addOptions(
                    {
                        label: "🔧・ Admins",
                        description: "Ouvrir un ticket destiné aux admins.",
                        value: "ticket_admins",
                    },
                    {
                        label: "💼・ Délégués",
                        description: "Ouvrir un ticket destiné aux délégués.",
                        value: "ticket_delegues",
                    },
                    {
                        label: "❌・ Annuler",
                        description: "Annuler la sélection.",
                        value: "ticket_exit",
                    },
                ),
        );

        // Send embed and select menu
        const msg = await interaction.channel.send({ embeds: [embed], components: [selectRow] });
        await msg.pin();
        await interaction.channel.lastMessage.delete();

        return interaction.reply({ content: `Le panel nommé \`${name}\` a bien été déployé dans ce salon.`, ephemeral: true });
    },
};
