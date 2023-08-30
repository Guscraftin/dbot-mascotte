const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { category_tickets, color_basic, role_admins, role_delegates, role_students } = require(process.env.CONSTANT);
const { Tickets } = require('../../dbObjects');

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

        let channel, name, openEmbed, roleSupport, ticket;
        switch (interaction.values[0]) {
            /*
             * Ticket admins
             */
            case "ticket_admins":
                name = "admins";
                roleSupport = role_admins;

                ticket = await Tickets.findOne({ where: { user_id: interaction.user.id, category: name, status: "opened" } });
                if (ticket) return interaction.editReply({ content: `Vous avez déjà un ticket d'ouvert dans <#${ticket.channel_id}> !`, ephemeral: true});

                channel = await createTicket(interaction, name, roleSupport);
                openEmbed = new EmbedBuilder()
                    .setDescription(`# Ticket aux ${name}\n`+
                        `Bonjour ${interaction.user},\n\n`+
                        `Vous êtes libre de vous exprimer en toute liberté dans ce salon.\n\n`+
                        `Un admin vous répondra dans les plus brefs délais.`)
                    .setColor(color_basic)
                break;

            /*
             * Ticket delegates
             */
            case "ticket_delegues":
                name = "délégués";
                roleSupport = role_delegates;

                // Check if the user is a student
                if (!interaction.member.roles.cache.has(role_students)) return interaction.editReply({ content: "Vous n'avez pas la possibilité de contacter directement les délégués. Pour signaler le problème, veuillez ouvrir un ticket auprès des admins.", ephemeral: true});

                ticket = await Tickets.findOne({ where: { user_id: interaction.user.id, category: name, status: "opened" } });
                if (ticket) return interaction.editReply({ content: `Vous avez déjà un ticket d'ouvert dans <#${ticket.channel_id}> !`, ephemeral: true});

                channel = await createTicket(interaction, name, roleSupport);
                openEmbed = new EmbedBuilder()
                    .setDescription(`# Ticket aux ${name}\n`+
                        `Bonjour ${interaction.user},\n\n`+
                        `Vous êtes libre de vous exprimer en toute liberté dans ce salon. Les admins ont pris l'engagement de ne pas lire le contenu des tickets, à moins qu'ils ne soient explicitement mentionnés à l'intérieur.\n\n`+
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
 * Create the ticket channel and add it in the database
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

    // Add the ticket in the database
    await Tickets.create({
        user_id: interaction.user.id,
        category: ticketType,
        channel_id: ticketChannel.id,
        status: "opened",
    });

    return ticketChannel;
}
