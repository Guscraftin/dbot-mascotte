const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.GuildScheduledEventDelete,
  async execute(guildScheduledEvent) {
    /**
     * Logs the event
     */
    const logChannel = await guildScheduledEvent.guild.channels.fetch(
      channel_logs
    );

    const user = guildScheduledEvent.creator;

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(color_basic)
      .setDescription(
        `${user} a **supprimé** un événement nommé \`${guildScheduledEvent.name}\`
            `
      )
      .setTimestamp()
      .setFooter({
        text: guildScheduledEvent.guild.name,
        iconURL: guildScheduledEvent.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });
  },
};
