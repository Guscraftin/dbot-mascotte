const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.MessageReactionRemoveEmoji,
  async execute(reaction) {
    /**
     * Logs the event
     */
    const logChannel = await reaction.message.guild.channels.fetch(
      channel_logs
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: reaction.client.user.tag,
        iconURL: reaction.client.user.displayAvatarURL(),
      })
      .setColor(color_basic)
      .setDescription(
        `**La réaction \`${reaction.emoji.name}\` [de ce message](${reaction.message.url}) a été supprimé par le bot <@${reaction.client.user.id}>.**
            `
      )
      .setTimestamp()
      .setFooter({
        text: reaction.message.guild.name,
        iconURL: reaction.message.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });
  },
};
