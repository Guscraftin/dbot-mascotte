const { Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.ChannelDelete,
  async execute(channel) {
    /**
     * Logs the event
     */
    const logChannel = await channel.guild.channels.fetch(channel_logs);

    if (channel.type === 4) {
      const embedCategorie = new EmbedBuilder()
        .setTitle(`Suppression d'une catégorie`)
        .setColor(color_basic)
        .setDescription(
          `**La catégorie \`${channel.name}\` a été supprimé**.
                > **Id :** \`${channel.id}\`
                `
        )
        .setTimestamp()
        .setFooter({
          text: channel.guild.name,
          iconURL: channel.guild.iconURL(),
        });

      logChannel?.send({ embeds: [embedCategorie] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle(`Suppression d'un salon`)
        .setColor(color_basic)
        .setDescription(
          `**La salon \`${channel.name}\` a été supprimé**.
                > **Id :** \`${channel.id}\`
                > **Catégorie :** ${channel.parent}
                > **Type :** \`${channelType()}\`
                `
        )
        .setTimestamp()
        .setFooter({
          text: channel.guild.name,
          iconURL: channel.guild.iconURL(),
        });

      logChannel?.send({ embeds: [embed] });
    }

    function channelType() {
      switch (channel.type) {
        case 0:
          return "Textuel";
        case 2:
          return "Vocal";
      }
    }
  },
};
