const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { channel_suggestions, color_yes, color_no } = require(process.env.CONSTANT);
const { Members } = require('../../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggestion")
        .setDescription("🔧 Permet de modifier l'état d'une suggestion.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('action').addChoices(
                { name: 'accepter', value: 'accepter' },
                { name: 'refuser', value: 'refuser' },
                { name: 'commenter', value: 'commenter' },
            ).setDescription("Action à effectuer sur la suggestion.").setRequired(true))
        .addStringOption(option => option.setName('id').setDescription("L'id du message de la suggestion.").setRequired(true))
        .addStringOption(option => option.setName('commentaire').setDescription("Le commentaire a ajouter.").setRequired(true)),
    async execute(interaction) {
        const action = interaction.options.getString("action");
        const messageId = interaction.options.getString("id");
        const comment = interaction.options.getString("commentaire");

        // Check if the id is a number
        const onlyNumber = /^\d+$/;
        if (!onlyNumber.test(messageId)) return interaction.reply({ content: "L'id doit être l'identifiant du message de la suggestion.", ephemeral: true });

        // Get the message of the suggestion
        const message = await interaction.guild.channels.fetch(channel_suggestions).then(channel =>
            channel.messages.fetch(messageId).catch(() => null)
        );
        if (!message) return interaction.reply({ content: "Ce message n'existe pas.", ephemeral: true });
        const embedMsg = message.embeds[0];

        // Get the author of the suggestion
        const authorName = embedMsg.author.name;
        if (authorName.includes(" - ")) return interaction.reply({ content: `Cette [suggestion](${message.url}) a déjà été traitée.`, ephemeral: true });
        const authorId = authorName.split(" (")[1].split(")")[0];
        const author = await interaction.guild.members.fetch(authorId);

        // Remove the specials emojis
        const deleteEmojis = ["💬", "🗑️"];
        const reactions = await message.reactions.cache.filter(reactionEmoji => deleteEmojis.includes(reactionEmoji.emoji.name));
        await reactions.each(reaction => reaction.remove());

        // Update the suggestion
        switch (action) {
            /**
             * Accept a suggestion
             */
            case "accepter":
                let acceptEmbed;    
                if (comment) {
                    acceptEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${author.displayName} - ✅ Suggestion acceptée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                        .setColor(color_yes)
                        .setDescription(embedMsg.description)
                        .setFields([{ name: "Commentaire :", value: `>>> ${comment}` }])
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                } else {
                    acceptEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${author.displayName} - ✅ Suggestion acceptée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                        .setColor(color_yes)
                        .setDescription(embedMsg.description)
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                }
                
                await message.edit({ embeds: [acceptEmbed] });
                return interaction.reply({ content: `La [suggestion](${message.url}) a été **acceptée**.`, ephemeral: true });

            /**
             * Refuse a suggestion
             */
            case "refuser":
                const refuseEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${author.displayName} - ❌ Suggestion refusée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                    .setColor(color_no)
                    .setDescription(embedMsg.description)
                    .setFields([{ name: "Raison :", value: `>>> ${comment}` }])
                    .setTimestamp()
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

                await message.edit({ embeds: [refuseEmbed] });
                return interaction.reply({ content: `La [suggestion](${message.url}) a été **refusée**.`, ephemeral: true });

            /**
             * Comment a suggestion
             */
            case "commenter":
                const commentEmbed = new EmbedBuilder()
                    .setAuthor(embedMsg.author)
                    .setColor(embedMsg.color)
                    .setDescription(embedMsg.description)
                    .setFields([{ name: "Commentaire :", value: `>>> ${comment}` }])
                    .setTimestamp()
                    .setFooter(embedMsg.footer)

                await message.edit({ embeds: [commentEmbed] });
                return interaction.reply({ content: `La [suggestion](${message.url}) a été **commentée**.`, ephemeral: true });

            /**
             * DEFAULT
             */
            default:
                return interaction.reply({ content: "Cette action n'existe pas.", ephemeral: true });
        }
    },
};