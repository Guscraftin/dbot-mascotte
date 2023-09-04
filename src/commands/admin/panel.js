const { ActionRowBuilder, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const { 
    channel_announce, channel_rules, channel_information, channel_tickets, channel_idea_poll,
    channel_general, channel_command, channel_muted, channel_agenda, channel_absence,
    vocal_general, vocal_course, vocal_sleep, vocal_panel,
    color_basic, emoji_yes,
    role_admins, role_delegates, role_students,
    role_mail, role_idea_poll, role_agenda, role_absence, role_help
} = require(process.env.CONSTANT);

const infoFirstEmbed = new EmbedBuilder()
    .setDescription(`# Présentation générale du serveur discord
En arrivant sur ce serveur, **vous avez accès à de nombreuses fonctionnalités**, telles que les tickets, l'agenda, le contenu des cours passés, des discussions de tout genre et bien plus encore.

Pour __plus d'informations__ sur un salon, veuillez **vous référer à sa description**. Toutes les informations à savoir y sont inscrites.

Si toutefois __vous avez encore des questions__ après la lecture de ce salon, vous pouvez **ouvrir un ticket** dans <#${channel_tickets}> et poser votre question ou effectuer une demande (détaillée plus bas).

__PS :__ Vous pouvez **inviter les personnes manquantes de la classe** sur ce discord via le salon <#${channel_general}>.`)
    .setColor('#ff0000');

const infoSecondEmbed = new EmbedBuilder()
    .setDescription(`# Changer son pseudo sur ce serveur discord
En arrivant sur le serveur, vous avez votre pseudo de base de votre compte discord. **Je vous invite à le changer avec __votre prénom__** (comme indiqué dans le <#${channel_rules}>) pour que l'on sache qui vous êtes. 
Si vous ne savez pas comment procéder, vous n'avez qu'à suivre les instructions ci dessous.
*NB : Vous pouvez à n'importe quel moment changer votre pseudo.*

**Comment se renommer ?**

__Si vous êtes sur ordinateur :__
> -> Faite un clique droit sur votre pseudo à droite
> -> Cliquez sur "Modifier le profil du serveur"
> -> Et entrez votre Prénom dans le champs "Pseudo du serveur"
> -> N'oubliez pas d'enregistrer

__Si vous êtes sur téléphone :__
> -> Balayez votre écran de la droite vers la gauche OU cliquez sur le nom du salon (en fonction du design de l'application sur votre téléphone)
> -> Cliquez sur votre pseudo
> -> Cliquez sur "Modifier le profil du serveur"
> -> Et entrez votre Prénom dans le champs "Pseudo du serveur"`)
    .setColor('#fe3333');

const infoThirdEmbed = new EmbedBuilder()
    .setDescription(`# Le système des salons vocaux
Tous les salons vocaux officiels du serveur sont dans la catégorie \`・🔊 - Les p'tites discus\`.
Je vais vous expliquer leurs utilités.

> <#${vocal_general}> : C'est le **salon vocal principal** du serveur discord. 
> Il est accessible à toutes les personnes ayant passé le processus de vérification sur ce serveur.

> <#${vocal_course}> : Ce salon est un **salon vocal secondaire** normalement utilisé pour parler de cours et s'entre aider sur des points du cours.
> Il est accessible à tous les étudiants, assistants et professeurs en fonction de leurs besoins.

> <#${vocal_sleep}> : Ce **salon permet de savoir qui est AFK** en vocal. Les AFK dans n'importe quels salons vocaux sont automatiquement déplacés dans ce salon.
> Ce salon est accessible à tous cependant vous ne pourrez pas parler une fois dedans.

> <#${vocal_panel}> : Ce salon vocal est très particulier. Il vous permet lors de votre connexion à celui ci, de vous **créer votre propre salon vocal** où vous pourrez modifier le nom, les permissions ainsi que d'autres paramètres. Cela vous permettra de le mettre accessible qu'à certaines personnes.
> Par défaut, le salon a une limite d'utilisateur qui correspond au nombre d'étudiant dans la classe.
> Ce salon sera cependant __automatiquement supprimé__ une fois que tous ces membres l'auront quittés.`)
    .setColor('#fe7878');

const infoFourthEmbed = new EmbedBuilder()
    .setDescription(`# Le système des anniversaires
Un système automatique pour les anniversaires a été mis en place sur le serveur.

Avant d'en voir les avantages, il faut que __vous donniez votre date d'anniversaire__ au bot. 
> -> Pour ce faire, aller dans <#${channel_command}> et taper cette slash commande : \`/anniversaire ajouter\` avec dans le champs \`date\`, votre date d'anniversaire sous le format : \`DD/MM/AAAA\`.
> -> Pour vérifier que tout est bon, vous pouvez taper la commande : \`/anniversaire list\` et vous devriez voir votre date d'anniversaire affichée. Si ce n'est pas le cas, recommencez le processus ou contacter un admin.

__Voyons maintenant les avantages à avoir son anniversaire renseigné :__ 
> -> Un message avec mention dans <#${channel_announce}>. (Les gens ne pourront pas l'oublier !)
> -> Un rôle spécifique pour que vous soyez bien visible en ce jour si spécial.
> -> L'accès à un salon 100% personnalisable où vous pourrez faire ce que vous voulez pendant environ 24h. De plus, vous pourrez récupérer une retranscription de tous les messages envoyés dans ce salon.

Pour voir les prochains anniversaires, aller dans <#${channel_command}> et taper ce message : \`/anniversaire list\`. Vous verrez les prochains anniversaires renseignés dans le bot.`)
    .setColor('#fdb0b0');

const infoFifthEmbed = new EmbedBuilder()
    .setDescription(`# La modération
La modération est le fait d'être sanctionné par un <@&${role_admins}>, un <@&${role_delegates}> ou un **BOT** pour ne pas avoir respecté le <#${channel_rules}>.

**Un système d'anti-spam est mis en place sur ce serveur.**
Il est entièrement géré par les bots.
__Le spam__ c'est le fait d'envoyer rapidement des messages.

Les <@&${role_delegates}> peuvent aussi sanctionner les membres de ce serveur UNIQUEMENT par **des avertissements** et/ou **des mutes**.

__Qu'est ce que le mute ?__
> Le mute est le fait **de ne plus pouvoir écrire ou parler dans tous les salons** sauf dans <#${channel_muted}>. Ce salon n'est d'ailleurs accessible qu'aux personnes mute afin qu'elles puissent réclamer une remise de peine aux <@&${role_delegates}> (si cela concerne une action manuelle) ou aux <@&${role_admins}> (si cela concernant une sanction automatique) ou encore pour profiter de pouvoir spam sans conséquence.

__Voici quelques exemples de situations :__
> Vous faites des bruits désagréables pour les autres personnes en vocal avec vous.
-> Vous pouvez vous faire exclure du vocal voire être mute.
> Si vous envoyez un message dans un mauvais salon.
-> Votre message sera déplacé dans le bon salon ou dans le bon fil de discussion. Puis vous recevrez un avertissement voire un mute.`)
    .setColor('#fafafa');

const infoSixthEmbed = new EmbedBuilder()
    .setDescription(`# Les demandes possibles
__Vous pouvez demander les choses suivantes en ouvrant un ticket aux <@&${role_admins}> dans <#${channel_tickets}> :__
> -> Un rôle personnalisé (couleur et nom)
> -> Un salon personnalisé
> -> Mise en place de votre bot sur ce serveur
> -> Une demande pour inviter une personne
> -> Une demande de projet ou d'événement sur le serveur
> -> De l'aide dans la configuration de votre serveur discord
> -> Apprendre des astuces et savoir tout faire sur discord

__Ou vous pouvez ouvrir un ticket aux <@&${role_delegates}> dans <#${channel_tickets}> :__
> -> Des problèmes rencontrés (comme une surcharge de travail ou des problèmes avec des profs)
> -> Afin de contacter ou de reporter toutes améliorations possible à l'administration.
`)
    .setColor('#bbb3fe');

const infoSeventhEmbed = new EmbedBuilder()
    .setDescription(`# Les bots / robots du serveur
Comme vous pouvez le constater, plusieurs bots sont présents sur le serveur et on chacun __leurs propres fonctionnalités__.
*Pour savoir si vous avez à faire à un bot c'est très simple, les bots ont un badge nommé BOT à côté de leur nom.*

__Les fonctionnalités de <@${process.env.CLIENT_ID}> :__
> -> *En cours de rédaction*

__Les commandes des bots :__
> Pour les connaitre, vous pouvez commencer un message par un \`/\` dans <#${channel_command}> pour voir toutes les commandes disponibles.

⚠️ Si **le bot est hors ligne** (c'est-à-dire déconnecté), le message "L'application ne répond plus" vous sera présenté.

*Si un problème survient ou vous n'arrivez pas à connaitre les commandes, vous pouvez mentionner un <@&${role_admins}>*`)
    .setColor('#8476fd');

const infoEighthEmbed = new EmbedBuilder()
    .setDescription(`# Le planning de l'année
Voici __notre planning scolaire__ avec nos vacances et nos projets au cours de cette année scolaire en ING1.`)
    .setImage('https://cdn.discordapp.com/attachments/1148354069082161182/1148354081014960179/image.png')
    .setColor('#4833fe');

const infoEighthEmbed2 = new EmbedBuilder()
    .setImage('https://cdn.discordapp.com/attachments/1148354069082161182/1148354188951179375/image.png')
    .setColor('#4833fe');

const infoNinthEmbed = new EmbedBuilder()
    .setDescription(`# Les liens utiles
Voici des liens officiels de l'école pour notre scolarité ainsi que des liens plus annexes pas forcément utiles.

**__Liens officiels :__**
> -> La plupart des raccourcis : https://epita.it/
> -> Site officiel EPITA : https://epita.fr/
> -> Site de la scolarité : https://epitafr.sharepoint.com/sites/EPITAscolarites
> -> CRI : https://cri.epita.fr/
> -> Moodle : https://moodle.cri.epita.fr/
> -> Moodle Exam : https://moodle-exam.cri.epita.fr/
> -> Zeus (Emploi du temps) :  https://zeus.ionis-it.com/
> -> IONISX (MIMOS) : https://ionisx.com/
> -> Intracom : https://intracom.epita.fr/
> -> EPITA News : https://news.epita.fr/
> -> Pegasus : https://inge-etud.epita.net/pegasus/
> -> Absence : https://absences.epita.net/
> -> International : https://epitafr.sharepoint.com/sites/EPITAStudyAbroad
> -> EPITA Relations Entreprises : https://epita.net/
> -> EPITA Signalement : https://epita.signalement.net/
> -> RocketChat : https://rocketchat.cri.epita.fr/
> -> LRE : https://www.lre.epita.fr/

**__Liens utiles :__**
> -> Office : https://office.com/
> -> Projet Voltaire [TE] : https://projet-voltaire.fr
> -> Rosetta Stone : https://login.rosettastone.com/#/launchpad
> -> Epinotes : https://epinotes.fr
> -> Plan des campus : https://epimap.fr/
> -> Plan des salles machines : https://fleet.pie.cri.epita.fr/
> -> Intranet des assistants : https://intra.assistants.epita.fr
> -> Gitlab CRI : https://gitlab.cri.epita.fr/
> -> Doc du CRI : https://doc.cri.epita.fr/
> -> Statut des services du CRI : https://devou.ps/
> -> Documentation de la Forge : https://docs.forge.epita.fr/
> -> Alumni : https://epita-alumni.org/fr/

> -> __Annales :__ 
> - EpiDocs (Past-Exams) : https://past-exams.epidocs.eu/ 
> - Mastercorp : http://mastercorp.epita.eu/
> - HyperAnnales : https://annales.hyperion.tf/

> -> __Emploi du temps :__
> - https://zeus.3ie.fr/
> - https://epitaf.fr/

> -> __Réduction étudiant :__
> - https://studentbeans.com/fr
> - https://myunidays.com/FR/fr-FR
> - https://isic.fr/

__Invite discord :__
> -> Serveur Principal de la promo
> **EPITA 2026** : https://discord.gg/wJn9Ku98zp
> -> Les associations + Organisation des événements
> **BDE Neytiki** :  https://discord.gg/3EhCsJgG5X et https://bde-epita.com/
> **Vie Associatif Paris :** https://discord.gg/j9t4PdbRpg 
> -> Pour les voyages à l'international
> **EPITA International** : https://discord.gg/ZDUxpED`)
    .setColor('#880185');

const infoSelectMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId('panel_information')
        .setPlaceholder('Sélectionnez une partie...')
        .addOptions(
            {
                label: "Présentation générale du serveur discord",
                description: "Qu'est ce que ce serveur discord ?",
                value: `info1`,
            },
            {
                label: "Changer son pseudo sur ce serveur discord",
                description: "Comment changer son pseudo sur discord ?",
                value: `info2`,
            },
            {
                label: "Le système des salons vocaux",
                description: "Comment fonctionne les vocaux ici ?",
                value: `info3`,
            },
            {
                label: "Le système des anniversaires",
                description: "Qu'est ce que le système des anniversaires ?",
                value: `info4`,
            },
            {
                label: "La modération",
                description: "Comment fonctionne la modération ?",
                value: `info5`,
            },
            {
                label: "Les demandes possibles",
                description: "Que peut-on demander en ticket ?",
                value: `info6`,
            },
            {
                label: "Les bots / robots du serveur",
                description: "Comment fonctionnent les bots ?",
                value: `info7`,
            },
            {
                label: "Le planning de l'année",
                description: "Quel est le planning de l'année ?",
                value: `info8`,
            },
            {
                label: "Les liens utiles",
                description: "Quels sont les liens utiles ?",
                value: `info9`,
            },
        ),
);

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
                { name: 'Règlement', value: 'rules' },
                { name: 'Informations', value: 'information' },
            ).setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');

        await interaction.deferReply({ ephemeral: true });

        let infoListMessage = [];
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

PS : Pour plus d'informations, consultez <#${channel_information}>.`)
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

            
            /**
             * Create embeds for the information
             */
            case 'information':
                const infoEmbeds = [
                    infoFirstEmbed, infoSecondEmbed, infoThirdEmbed, infoFourthEmbed,
                    infoFifthEmbed, infoSixthEmbed, infoSeventhEmbed, infoEighthEmbed,
                    infoEighthEmbed2, infoNinthEmbed
                ];
                
                async function sendMessagesWithDelay() {
                    for (const infoEmbed of infoEmbeds) {
                        await new Promise(resolve => {
                            setTimeout(async () => {
                                const msg = await interaction.channel.send({ embeds: [infoEmbed] });
                                if (infoEmbed !== infoEighthEmbed2) infoListMessage.push(msg.url);
                                resolve();
                            }, 500);
                        });
                    }
                }
                
                await sendMessagesWithDelay();                
                break;
        }

        // Send embed and select menu
        let msg;
        if (name === 'information') {
            const infoTenthEmbed = new EmbedBuilder()
                .setDescription(`# Sommaire
-> [Présentation générale du serveur discord](${infoListMessage[0]})
-> [Changer son pseudo sur ce serveur discord](${infoListMessage[1]})
-> [Le système des salons vocaux](${infoListMessage[2]})
-> [Le système des anniversaires](${infoListMessage[3]})
-> [La modération](${infoListMessage[4]})
-> [Les demandes possibles](${infoListMessage[5]})
-> [Les bots / robots du serveur](${infoListMessage[6]})
-> [Le planning de l'année](${infoListMessage[7]})
-> [Les liens utiles](${infoListMessage[8]})`)
                .setColor('#fe3333');
            msg = await interaction.channel.send({ embeds: [infoTenthEmbed], components: [infoSelectMenu] });
        } else if (selectRow) msg = await interaction.channel.send({ embeds: [embed], components: [selectRow] });
        else msg = await interaction.channel.send({ embeds: [embed] });
        await msg.pin();
        if (name === 'rules') await msg.react(emoji_yes);
        await interaction.channel.lastMessage.delete();

        return interaction.editReply({ content: `Le panel nommé \`${name}\` a bien été déployé dans ce salon.`, ephemeral: true });
    },
    infoFirstEmbed, infoSecondEmbed, infoThirdEmbed, infoFourthEmbed, infoFifthEmbed, infoSixthEmbed, infoSeventhEmbed, infoEighthEmbed, infoEighthEmbed2, infoNinthEmbed, infoSelectMenu
};


