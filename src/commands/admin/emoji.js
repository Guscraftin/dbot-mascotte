const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojiRegex } = require('../../functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("🔧 Ajouter des emojis sous un message.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option => option.setName('id').setDescription("L'id du message où ajouter les réactions.").setRequired(true))
        .addStringOption(option => option.setName('emojis').setDescription("Les emojis à ajouter dans l'ordre.").setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString("id");
        const emojis = interaction.options.getString("emojis");

        await interaction.deferReply({ ephemeral: true });

        // Get the message
        const message = await interaction.channel.messages.fetch(messageId).catch(() => null);
        if (!message) return interaction.editReply({ content: "Ce message n'existe pas.", ephemeral: true });

        // Check if the id is a number
        const onlyNumber = /^\d+$/;
        if (!onlyNumber.test(messageId)) return interaction.editReply({ content: "L'id doit être l'identifiant d'un message dans ce salon.", ephemeral: true });

        // Filter the emojis
        const msgEmojiRegex = new RegExp("(<:[A-Za-z0-9_]+:[0-9]+>)|(" + emojiRegex() + ")", "gu");
        const emojisArray = emojis.match(msgEmojiRegex) || [];

        // Check the max number of emojis
        const emojisMessage = message.reactions.cache;
        let isMax = false;
        let emojisDeleted = [];
        if (emojisArray.length + emojisMessage.size > 20) {
            emojisDeleted = emojisArray.splice(20 - emojisMessage.size);
            isMax = true;
        }
        
        // Add the emojis
        const promises = emojisArray.map(async (emoji) => {
            await message.react(emoji);
        });
        await Promise.all(promises);

        
        if (isMax) return interaction.editReply({ content: `⚠️ **Le nombre de réactions est limité à 20 par message.** Les \`${emojisDeleted.length}\` derniers emojis n'ont pas pu être ajoutés. Cela correspond aux emojis suivants : ${emojisDeleted}.` });
        else return interaction.editReply({ content: `Les emojis ont bien été ajoutés au message.`, ephemeral: true });
    },
};