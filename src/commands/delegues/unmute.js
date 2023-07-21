const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { roleDelegues, roleMute } = require(process.env.CONSTANT);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("🚨 Annuler l'exclusion d'un membre (qu'il puisse à nouveau parler).")
        .setDMPermission(false)
        .addUserOption(option => option.setName("membre").setDescription("Membre à exclure").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("Raison de l'exclusion").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember("membre");
        const reason = interaction.options.getString("raison");

        const user = interaction.member;

        // Check if the user can use this command (if user is not a delegate or an admin)
        if (!user.roles.cache.has(roleDelegues) && !user.permissions.has(PermissionFlagsBits.Administrator) ) return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        
        
        // Check if the member could be unmuted
        if (member.id === process.env.CLIENT_ID) return interaction.reply({ content: "On ne touche pas à la mascotte !", ephemeral: true });
        if (!member.roles.cache.has(roleMute)) return interaction.reply({ content: "Ce membre n'est déjà pas exclu.", ephemeral: true });
        
        
        // Remove the mute role
        await member.roles.remove(roleMute, user.user.username + " - " + reason);


        return interaction.reply({ content: `Vous avez bien annulé l'exclusion de ${member} pour \`${reason}\`.`, ephemeral: true });
    },
};