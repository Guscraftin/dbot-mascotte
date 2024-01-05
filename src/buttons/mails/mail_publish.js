const { channel_mails } = require(process.env.CONSTANT);

module.exports = {
    data: {
        name: "mail_publish",
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const channelMails = await interaction.guild.channels.fetch(channel_mails);

        await channelMails?.send({
            content: interaction.message.content,
            embeds: interaction.message.embeds,
            files: interaction.message.attachments.map(attachment => attachment.url)
        });

        await interaction.message.delete();
        return interaction.editReply({ content: `Le mail a bien été publié.`, ephemeral: true });
    }
}