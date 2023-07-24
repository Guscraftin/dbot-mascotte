const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { Guilds } = require('../../dbObjects.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('🔧 Configurer la base de donnée du serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addBooleanOption(option =>
            option.setName('automatic_verified').setDescription('Activer la vérification automatique des membres').setRequired(true)
        ),
    async execute(interaction) {
        const automatic_verified = interaction.options.getBoolean('automatic_verified');
        
        const guild = interaction.guild;

        // Get information about the guild in the database
        let guildDB = await Guilds.findOne({ where: { id: guild.id } });
        if (!guildDB) guildDB = await Guilds.create({ id: guild.id });

        // Update the database
        await guildDB.update({ automatic_verified });


        return interaction.reply({ content: `La base de donnée du serveur a bien été mise à jour.`, ephemeral: true });
    },
};