const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.StageInstanceCreate,
  async execute(stageInstance) {
    /**
     * Logs the event
     */
    const logChannel = await stageInstance.guild.channels.fetch(channel_logs);

    const embed = new EmbedBuilder()
      .setTitle(`Suppression d'une conférence`)
      .setColor(color_basic)
      .setDescription(
        `La conférence \`${
          stageInstance.topic
        }\` a été **terminée** dans le salon ${stageInstance.channel}.
            ${
              stageInstance.guildScheduledEvent != null
                ? `> **Evenement lié :** [${stageInstance.guildScheduledEvent.name}](${stageInstance.guildScheduledEvent})`
                : ``
            }
            `
      )
      .setTimestamp()
      .setFooter({
        text: stageInstance.guild.name,
        iconURL: stageInstance.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });
  },
};
