const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { channelSuggestions, colorYes, colorNo } = require(process.env.CONSTANT);
const { Members } = require('../../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("🔧 Permet de modifier l'état d'une suggestion.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('action').addChoices(
                { name: 'accepter', value: 'accepter' },
                { name: 'refuser', value: 'refuser' },
            ).setDescription("🔧 Action à effectuer sur la suggestion.").setRequired(true))
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
        const message = await interaction.guild.channels.fetch(channelSuggestions).then(channel =>
            channel.messages.fetch(messageId).catch(() => null)
        );
        if (!message) return interaction.reply({ content: "Ce message n'existe pas.", ephemeral: true });
        const embedMsg = message.embeds[0];

        // Get the author of the suggestion
        const authorName = embedMsg.author.name;
        if (authorName.includes(" - ")) return interaction.reply({ content: `Cette [suggestion](${message.url}) a déjà été traitée.`, ephemeral: true });
        const authorId = authorName.split(" (")[1].split(")")[0];
        const author = await interaction.guild.members.fetch(authorId);
        
        // Update the suggestion
        switch (action) {
            /**
             * Accept a suggestion
             */
            case "accepter":
                let embed;    
                if (comment) {
                    embed = new EmbedBuilder()
                        .setAuthor({ name: `${author.displayName} - ✅ Suggestion acceptée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                        .setColor(colorYes)
                        .setDescription(`${embedMsg.description}`)
                        .setFields([{ name: "Commentaire :", value: `>>> ${comment}` }])
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                } else {
                    embed = new EmbedBuilder()
                        .setAuthor({ name: `${author.displayName} - ✅ Suggestion acceptée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                        .setColor(colorYes)
                        .setDescription(`${embedMsg.description}`)
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                }
                
                await message.edit({ embeds: [embed] });
                return interaction.reply({ content: `La [suggestion](${message.url}) a été **acceptée**.`, ephemeral: true });

            /**
             * Refuse a suggestion
             */
            case "refuser":
                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: `${author.displayName} - ❌ Suggestion refusée par ${interaction.member.displayName}`, iconURL: author.displayAvatarURL() })
                    .setColor(colorNo)
                    .setDescription(`${embedMsg.description}`)
                    .setFields([{ name: "Raison :", value: `>>> ${comment}` }])
                    .setTimestamp()
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

                await message.edit({ embeds: [embed2] });
                return interaction.reply({ content: `La [suggestion](${message.url}) a été **refusée**.`, ephemeral: true });

            default:
                return interaction.reply({ content: "Cette action n'existe pas.", ephemeral: true });
        }
    },
};