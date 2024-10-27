const { EmbedBuilder, Events } = require("discord.js");
const { channel_idea_poll, channel_logs, color_basic } = require(process.env
  .CONSTANT);
const { Suggestions } = require("../../dbObjects");

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(messageReaction, user) {
    if (user.bot) return;

    const message = messageReaction.message;
    const channel = message.channel;

    /**
     * Suggestion system
     */
    if (channel.id === channel_idea_poll) {
      const suggestion = await Suggestions.findOne({
        where: { message_id: message.id },
      });
      const authorName = message.embeds[0].author.name;

      switch (messageReaction.emoji.name) {
        case "💬":
          await messageReaction.remove();
          const thread = await message.startThread({
            name: `Echange sur l'idée de ${authorName}`,
          });
          if (suggestion.author_id === user.id)
            await thread.send({
              content: `${user}, tu peux apporter des précisions supplémentaires et échanger ici avec les autres volontaires concernant ta suggestion ci-dessus.`,
            });
          else
            await thread.send({
              content: `${user}, tu peux échanger ici avec <@${suggestion.author_id}> et les autres volontaires sur la suggestion ci-dessus.`,
            });
          break;

        case "🗑️":
          if (suggestion.author_id === user.id) {
            await message.thread?.delete();
            await suggestion.destroy();
            await message.delete();
          } else {
            await messageReaction.users.remove(user);
            const embed = new EmbedBuilder()
              .setTitle("Impossible de supprimer la suggestion")
              .setDescription(
                `Vous n'êtes pas l'auteur de cette [suggestion](${message.url}), vous ne pouvez donc pas la supprimer.`
              )
              .setColor(color_basic)
              .setTimestamp()
              .setFooter({
                text: message.guild.name,
                iconURL: message.guild.iconURL(),
              });

            await user.send({ embeds: [embed] });
          }
          break;
      }
    }

    /**
     * Logs the event
     */
    const logChannel = await message.guild.channels.fetch(channel_logs);
    const emojiName = messageReaction.emoji.name;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(color_basic)
      .setDescription(
        `**<@${user.id}> a ajouté sa réaction ${
          isDefaultEmoji()
            ? `\`${messageReaction.emoji.name}\``
            : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`
        } [à ce message](${message.url}).**
            `
      )
      .setTimestamp()
      .setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });

    function isDefaultEmoji() {
      let testEmojiName = emojiName.match(/[0-9a-z_]/gi);
      if (testEmojiName === null) testEmojiName = [];

      return testEmojiName.length != emojiName.length;
    }
  },
};
