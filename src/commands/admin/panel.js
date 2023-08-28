const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const { 
    channel_announce, channel_idea_poll, channel_agenda, channel_absence, color_basic, emoji_yes,
    role_admins, role_delegates, role_students,
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
                { name: 'Règlement', value: 'rules' }
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
                break;


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
                break;


            /**
             * Create an embed for the rules
             */
            case 'rules':
                embed = new EmbedBuilder()
                    .setDescription(`# \`📜\` - Règlement`)
                    .setFields(
                        { name: 'ℹ️ 》__Articles 1 :__', value: `En utilisant ce serveur Discord, vous vous conformez aux [Conditions d’utilisation de Discord](https://discord.com/terms).`, inline: false },
                        { name: '👫 》__Articles 2 :__', value: `Restez poli et respectez les autres membres du serveur.`, inline: false },
                        { name: '🏓 》__Articles 3 :__', value: `Certaines mentions sont activées (comme les rôles :  <@&${role_admins}>, <@&${role_delegates}>, <@&${role_students}>), vous êtes priés de ne pas en abuser.`, inline: false },
                        { name: '💭 》__Articles 4 :__', value: `Pas de spam, surtout dans les channels dédiés aux cours.`, inline: false },
                        { name: '🧾 》__Articles 5 :__', value: `Merci de respecter le sujet des salons. Plus d'informations concernant un salon dans sa description.`, inline: false },
                        { name: `🎙️ 》__Articles 6 :__`, value: `Dans les salon vocaux, merci de respecter la parole des autres. Vous pourrez être mute si vous êtes trop bruyant.`, inline: false },
                        { name: `🔧 》__Articles 7 :__`, value: `Les admins ont l'obligation de respecter la vie privée dans les tickets et les salons personnalisés des membres si cela ne les concerne pas et qu'ils ne sont pas mentionnés à l'intérieur.
                        
\`\`\`fix
Si vous ne respectez pas ces règles, des sanctions pourront être appliquées par l'équipe de Modération.
\`\`\`\n_ _`, inline: false },
                        { name: `__Norme des pseudos :__`, value: `>>> -> Pour tous les membres : **Prénom** [Votre pseudo doit impérativement débuter par votre prénom. Ensuite, vous avez toute liberté pour y ajouter ce que vous désirez.]
Exemples : \`Mascotte\`, \`Mascotte | Petit chatounet\``, inline: false },
                    )
                    .setColor(color_basic);

                break;

        }

        // Send embed and select menu
        let msg;
        if (selectRow) msg = await interaction.channel.send({ embeds: [embed], components: [selectRow] });
        else msg = await interaction.channel.send({ embeds: [embed] });
        await msg.pin();
        if (name === 'rules') await msg.react(emoji_yes);
        await interaction.channel.lastMessage.delete();

        return interaction.editReply({ content: `Le panel nommé \`${name}\` a bien été déployé dans ce salon.`, ephemeral: true });
    },
};
