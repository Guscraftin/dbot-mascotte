const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { Guilds } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('🔧 Configurer la base de donnée du serveur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addBooleanOption(option =>
            option.setName('automatic_verified').setDescription('Activer la vérification automatique des membres').setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('automatic_mention_idea-poll').setDescription('Activer la mention automatique pour les nouvelles idées et les nouveaux sondages.').setRequired(true)
        ),
    async execute(interaction) {
        const automatic_verified = interaction.options.getBoolean('automatic_verified');
        const automatic_mention_idea_poll = interaction.options.getBoolean('automatic_mention_idea-poll');
        
        const guild = interaction.guild;

        // Update information about the guild in the database
        await Guilds.upsert({ id: guild.id, automatic_verified, automatic_mention_idea_poll }, { where: { id: guild.id } });


        return interaction.reply({ content: `La base de donnée du serveur a bien été mise à jour.`, ephemeral: true });
    },
};