const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { category_tickets, color_basic, role_admins, role_delegates } = require(process.env.CONSTANT);

module.exports = {
    data: {
        name: "panel_tickets",
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const openTicket = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Fermer le ticket")
                .setStyle(ButtonStyle.Danger)
            );

        let channel, channelOpen, name, openEmbed, roleSupport;
        // TODO: Rewrite the first message in the ticket channel because not beautiful
        switch (interaction.values[0]) {
            /*
             * Ticket admins
             */
            case "ticket_admins":
                name = "admins";
                roleSupport = role_admins;

                channelOpen = await checkOpenTicket(interaction, name);
                if (channelOpen) return interaction.editReply({ content: `Vous avez déjà un ticket d'ouvert dans ${channelOpen} !`, ephemeral: true});

                channel = await createTicket(interaction, name, roleSupport);
                openEmbed = new EmbedBuilder()
                    .setDescription(`# Ticket aux ${name}\n`+
                        `Bonjour ${interaction.user},\n\n`+
                        `Vous pouvez vous exprimer en toute liberté dans ce salon.\n\n`+
                        `Un admin vous répondra dans les plus brefs délais.`)
                    .setColor(color_basic)
                break;

            /*
             * Ticket delegates
             */
            case "ticket_delegues":
                name = "délégués";
                roleSupport = role_delegates;

                channelOpen = await checkOpenTicket(interaction, name);
                if (channelOpen) return interaction.editReply({ content: `Vous avez déjà un ticket d'ouvert dans ${channelOpen} !`, ephemeral: true});

                channel = await createTicket(interaction, name, roleSupport);
                openEmbed = new EmbedBuilder()
                    .setDescription(`# Ticket aux ${name}\n`+
                        `Bonjour ${interaction.user},\n\n`+
                        `Vous pouvez vous exprimer en toute liberté dans ce salon. En effet, les admins se sont engagés à ne pas lire le contenu des tickets ne les concernant pas.\n\n`+
                        `Un délégué vous répondra dans les plus brefs délais.`)
                    .setColor(color_basic)
                break;

            /**
             * Ticket exit
             */
            case "ticket_exit":
                return interaction.editReply({ content: "Vous avez annulé la création d'un ticket !", ephemeral: true});

            /**
             * DEFAULT
             */
            default:
                return interaction.editReply({ content: "Vous n'avez pas choisi d'option !", ephemeral: true});
        }

        // Send the first message
        const message = await channel.send({
            embeds: [openEmbed],
            components: [openTicket],
        });
        message.pin();
        const msgMention = await channel.send({ content: `<@${interaction.user.id}>, vous avez un nouveau ticket avec les <@&${roleSupport}> !` });
        msgMention.delete();

        return interaction.editReply({
            content: `**Votre demande a été transférée dans ${channel} !**`,
        });
    }
};

/**
 * Create the ticket channel
 * @param {*} interaction 
 * @param {String} ticketType
 * @param {String} roleSupport
 * @returns {Promise<Channel>}
 */
async function createTicket(interaction, ticketType, roleSupport) {
    const ticketChannel = await interaction.guild.channels.create({
            name: `${ticketType}-${interaction.member.displayName}`,
            type: 0, // GuildText
            parent: category_tickets,
            topic: `Ticket adressé **aux ${ticketType}** par <@${interaction.user.id}> (${interaction.user.username}).`,
            permissionOverwrites: [
                {
                    id: roleSupport,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ManageRoles,
                    ],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [ PermissionFlagsBits.ViewChannel ],
                    allow: [
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.SendMessagesInThreads,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.UseApplicationCommands,
                    ],
                },
                {
                    id: interaction.user.id,
                    allow: [ PermissionFlagsBits.ViewChannel ],
                },
            ],
        }
    );

    return ticketChannel;
}


/**
 * Check if the user has already a ticket open
 * @param {*} interaction
 * @param {String} ticketType
 * @returns {Promise<Channel>}
 */
async function checkOpenTicket(interaction, ticketType) {
    const ticketCategory = await interaction.guild.channels.fetch(category_tickets);
    if (!ticketCategory) return null;
    const ticketChannels = ticketCategory?.children?.cache;
    if (!ticketChannels) return null;

    let findChannel = null;
    const promises = ticketChannels.map(async channel => {
        if (channel.topic?.includes(ticketType) && channel.topic.includes(interaction.user.id)) findChannel = channel;
    });
    await Promise.all(promises);
    
    return findChannel;
}