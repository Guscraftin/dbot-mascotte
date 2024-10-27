const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.MessageReactionRemoveAll,
  async execute(message, reactions) {
    /**
     * Logs the event
     */
    const logChannel = await message.guild.channels.fetch(channel_logs);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: reactions.first().client.user.tag,
        iconURL: reactions.first().client.user.displayAvatarURL(),
      })
      .setColor(color_basic)
      .setDescription(
        `**Les réactions \`${getNameEmojis()}\` [de ce message](${
          message.url
        }) ont été supprimé par le bot <@${reactions.first().client.user.id}>.**
            `
      )
      .setTimestamp()
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });

    function getNameEmojis() {
      let listEmoji = [];
      reactions.each((emoji) => listEmoji.push(emoji.emoji.name));
      return listEmoji;
    }
  },
};
