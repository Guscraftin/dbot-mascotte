const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    /**
     * Logs the event
     */
    const logChannel = await message.guild.channels.fetch(channel_logs);

    if (message.author === null) {
      const embedBot = new EmbedBuilder()
        .setTitle(`Suppression d'un message`)
        .setColor(color_basic)
        .setDescription(
          `**Message envoyé par \`un membre\` supprimé dans ${message.channel}.**
                `
        )
        .setTimestamp()
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL(),
        });

      logChannel?.send({ embeds: [embedBot] });
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(color_basic)
        .setDescription(
          `**Message envoyé par ${message.author} supprimé dans ${message.channel}.**
                ${message.content}
                `
        )
        .setTimestamp()
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL(),
        });

      logChannel?.send({ embeds: [embed] });
    }
  },
};
