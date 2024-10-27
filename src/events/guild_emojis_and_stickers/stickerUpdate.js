const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.GuildStickerUpdate,
  async execute(oldSticker, newSticker) {
    /**
     * Logs the event
     */
    const logChannel = await newSticker.guild.channels.fetch(channel_logs);

    const embed = new EmbedBuilder()
      .setTitle(`Modification d'un autocollant`)
      .setColor(color_basic)
      .setDescription(
        `**L'autocollant \`${newSticker.name}\` a été modifié.**
            ${
              oldSticker.name !== newSticker.name
                ? `> **Nom :** \`${oldSticker.name}\` => \`${newSticker.name}\`\n`
                : ``
            } ${
          oldSticker.tags !== newSticker.tags
            ? `> **Emoji similaire :** :${oldSticker.tags}: => :${newSticker.tags}:\n`
            : ``
        } ${
          oldSticker.description !== newSticker.description
            ? `>>> **Description :** \`\`\`${oldSticker.description}\`\`\` **=>** \`\`\`${newSticker.description}\`\`\``
            : ``
        }
            `
      )
      .setImage(newSticker.url)
      .setTimestamp()
      .setFooter({
        text: newSticker.guild.name,
        iconURL: newSticker.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });
  },
};
