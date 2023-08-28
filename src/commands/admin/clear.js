const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("🔧 Supprimer un nombre défini de messages dans ce salon.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addIntegerOption(option => option.setName('message').setDescription("Le nombre de message à supprimer.").setMinValue(1).setMaxValue(100).setRequired(true))
        .addUserOption(option => option.setName('membre').setDescription("Le membre dont il faut supprimer les messages.")),
	async execute(interaction) {
        const amountToDelete = interaction.options.getInteger('message');
        const member = interaction.options.getUser('membre');

        await interaction.deferReply({ ephemeral: true });
        const messagesToDelete = await interaction.channel.messages.fetch();

        if (member) {
            let i = 0;
            const filteredMemberMessages = [];
            (await messagesToDelete).filter(msg => {
                if (msg.author.id === member.id && amountToDelete > i) {
                    filteredMemberMessages.push(msg); i++;
                }
            });

            await interaction.channel.bulkDelete(filteredMemberMessages, true).then(messages => {
                interaction.editReply({ content: `J'ai supprimé ${messages.size} messages de l'utilisateur ${member} !`, ephemeral: true });
            })
        } else {
            await interaction.channel.bulkDelete(amountToDelete, true).then(messages => {
                interaction.editReply({ content: `J'ai supprimé ${messages.size} messages dans ce salon !`, ephemeral: true });
            });
        }
    }
};