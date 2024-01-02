const { channel_mails } = require(process.env.CONSTANT);

module.exports = {
    data: {
        name: "mail_publish",
    },
    async execute(interaction) {
        const channelMails = await interaction.guild.channels.fetch(channel_mails);

        await channelMails?.send({
            content: interaction.message.content,
            embeds: interaction.message.embeds,
            files: interaction.message.attachments.map(attachment => attachment.url)
        });

        await interaction.message.delete();
        return interaction.reply({ content: `Le mail a bien été publié.`, ephemeral: true });
    }
}