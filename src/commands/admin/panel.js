const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const { 
    channel_announce, channel_idea_poll, channel_agenda, channel_absence, color_basic,
    role_mail, role_idea_poll, role_agenda, role_absence, role_help
} = require(process.env.CONSTANT);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('🔧 Deployer un panel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('name').setDescription('🔧 Deployer un panel.').addChoices(
                { name: 'Tickets', value: 'tickets' },
                { name: 'Rôle réaction', value: 'role_reaction' },
            ).setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        await interaction.deferReply({ ephemeral: true });

        let embed, selectRow;
        switch (name) {

            /**
             * Create embed and select menu for the ticket panel
             */
            case 'tickets':
                embed = new EmbedBuilder()
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

                selectRow = new ActionRowBuilder().addComponents(
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


            /**
             * Create embed and select menu for the role reaction panel
             */
            case 'role_reaction':
                embed = new EmbedBuilder()
                    .setDescription(`# \`🔰\` - Rôle réaction
Souhaitez-vous être notifié des messages que vous jugez importants, tels que les annonces, les idées et les sondages, l'agenda ou encore le contenu des cours passés ? Grâce à ce panneau de contrôle, vous avez la possibilité de sélectionner les notifications que vous désirez recevoir. 
### Alors, quelles notifications aimeriez-vous recevoir ?
> 📩 : Mail *[<#${channel_announce}>]*
> 📊 : Idées et Sondages *[<#${channel_idea_poll}>]*
> 📅 : Agenda *[<#${channel_agenda}>]*
> 🤒 : Contenu des cours passsés *[<#${channel_absence}>]*
> 🚨 : Helper (Aide les personnes) *[Dans la catégorie cours]*`)
                    .setColor(color_basic);

                selectRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('panel_role_reaction')
                        .setPlaceholder('Sélectionnez un rôle ou plusieurs rôles...')
                        .addOptions(
                            {
                                label: "📩・ Mail",
                                description: "Recevoir des notifications pour les nouveaux mails.",
                                value: `${role_mail}`,
                            },
                            {
                                label: "📊・ Idées et Sondages",
                                description: "Recevoir des notifications pour les idées et les sondages.",
                                value: `${role_idea_poll}`,
                            },
                            {
                                label: "📅・ Agenda",
                                description: "Recevoir une notification en cas de mise à jour de l'agenda.",
                                value: `${role_agenda}`,
                            },
                            {
                                label: "🤒・ Contenu des cours passsés",
                                description: "Recevoir une notification lors de l'ajout de cours passés.",
                                value: `${role_absence}`,
                            },
                            {
                                label: "🚨・ Helper",
                                description: "Recevoir une notification lorsqu'une personne demande de l'aide.",
                                value: `${role_help}`,
                            },
                        )
                        .setMinValues(0)
			            .setMaxValues(5),
                );
        }

        // Send embed and select menu
        const msg = await interaction.channel.send({ embeds: [embed], components: [selectRow] });
        await msg.pin();
        await interaction.channel.lastMessage.delete();

        return interaction.editReply({ content: `Le panel nommé \`${name}\` a bien été déployé dans ce salon.`, ephemeral: true });
    },
};
