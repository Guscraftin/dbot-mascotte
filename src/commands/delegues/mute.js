const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { roleDelegues, roleMute } = require(process.env.CONSTANT);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("🚨 Exclure un membre (qu'il ne puisse plus parler).")
        .setDMPermission(false)
        .addUserOption(option => option.setName("membre").setDescription("Membre à exclure").setRequired(true))
        .addIntegerOption(option => option.setName("durée").setDescription("Durée de l'exclusion (en minutes)").setMinValue(1).setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("Raison de l'exclusion").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember("membre");
        const duration = interaction.options.getInteger("durée");
        const reason = interaction.options.getString("raison");

        const user = interaction.member;

        // Check if the user can use this command (if user is not a delegate or an admin)
        if (!user.roles.cache.has(roleDelegues) && !user.permissions.has(PermissionFlagsBits.Administrator) ) return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        
        
        // Check if the member could be muted
        if (member.roles.cache.has(roleMute)) return interaction.reply({ content: "Ce membre est déjà exclu.", ephemeral: true });
        if (member.id === process.env.CLIENT_ID) return interaction.reply({ content: "Vous ne pouvez pas sanctionner la mascotte.", ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: "Vous ne pouvez pas sanctionner un bot.", ephemeral: true });
        if (member.roles.cache.has(roleDelegues)) return interaction.reply({ content: "Vous ne pouvez pas exclure un délégué.", ephemeral: true });
        if (member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "Vous ne pouvez pas exclure un administrateur.", ephemeral: true });
        
        
        // TODO: Manage the duration of the mute (setTimeout() + Fonction au démarrage du bot qui remet les timeouts en place via les infos de la DB)


        // Add the mute role
        await member.roles.add(roleMute, user.user.username + " - " + reason);
        

        return interaction.reply({ content: `${member} a bien été exclu pour ${duration} minutes.`, ephemeral: true });
    },
};