const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.GuildEmojiCreate,
  async execute(emoji) {
    /**
     * Logs the event
     */
    const logChannel = await emoji.guild.channels.fetch(channel_logs);

    const embed = new EmbedBuilder()
      .setTitle(`Création d'un emoji`)
      .setColor(color_basic)
      .setDescription(
        `**L'emoji ${emoji} a été créé par ${
          emoji.author === null ? `\`un modérateur\`` : `<@${emoji.author.id}>`
        }.**
            > **Nom:Id :** \`${emoji.identifier}\`
            > **Emoji animé :** \`${emoji.animated ? `Oui` : `Non`}\`
            `
      )
      .setThumbnail(emoji.url)
      .setTimestamp()
      .setFooter({ text: emoji.guild.name, iconURL: emoji.guild.iconURL() });

    logChannel?.send({ embeds: [embed] });
  },
};
