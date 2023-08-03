const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { role_delegates, role_mute } = require(process.env.CONSTANT);
const { Members } = require('../../dbObjects');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("💼 Annuler l'exclusion d'un membre (qu'il puisse à nouveau parler).")
        .setDMPermission(false)
        .addUserOption(option => option.setName("membre").setDescription("Membre à exclure").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("Raison de l'exclusion").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember("membre");
        const reason = interaction.options.getString("raison");

        const user = interaction.member;

        // Check if the user can use this command (if user is not a delegate or an admin)
        if (!user.roles.cache.has(role_delegates) && !user.permissions.has(PermissionFlagsBits.Administrator) ) return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        
        // Get the member in the database
        const memberDB = await Members.findOne({ where: { id: member.id } });

        // Check if the member could be unmuted
        if (member.id === process.env.CLIENT_ID) return interaction.reply({ content: "On ne touche pas à la mascotte !", ephemeral: true });
        if (!memberDB || !memberDB.mute_time) return interaction.reply({ content: "Ce membre n'est déjà pas exclu.", ephemeral: true });
        
        // Remove the time of mute in the database
        const timeRemaining = parseInt(memberDB.mute_time / 1000);
        await memberDB.update({ mute_time: null });
        
        // Remove the mute role
        await member.roles.remove(role_mute, user.user.username + " - " + reason);


        return interaction.reply({ 
            content: `Vous avez bien annulé l'exclusion de ${member} avec comme raison : \`${reason}\`.\n` + 
            `*Son exclusion devait se terminer <t:${timeRemaining}:R>.*`,
            ephemeral: true
        });
    },
};