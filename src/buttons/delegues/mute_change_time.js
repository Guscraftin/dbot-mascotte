const { EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic, role_mute } = require(process.env.CONSTANT);
const { Members } = require("../../dbObjects");

module.exports = {
  data: {
    name: "mute_change_time",
  },
  async execute(interaction) {
    // Get information in the message
    const message = interaction.message;
    const member = message.mentions.members.first();
    const duration = message.content.split("<t:")[2].split(":R>")[0];
    const logChannel = await interaction.guild.channels.fetch(channel_logs);

    // Get the member in the database
    const memberDB = await Members.findOne({ where: { id: member.id } });
    if (!memberDB)
      return interaction.reply({
        content: "Ce membre n'est pas dans la base de donnée.",
        ephemeral: true,
      });

    // Update the mute time
    await memberDB.update({ mute_time: duration * 1000 });

    // Launch the timeout
    setTimeout(async () => {
      const memberDB = await Members.findOne({ where: { id: member.id } });
      if (memberDB.mute_time > Date.now()) return;
      await Members.update({ mute_time: null }, { where: { id: member.id } });
      await member.roles.remove(role_mute, "Fin de l'exclusion");
    }, duration * 1000 - Date.now());

    // Logs the event
    const embed = new EmbedBuilder()
      .setTitle(`Update the mute`)
      .setColor(color_basic)
      .setDescription(
        `**Modification du mute de ${member}.**
            > **Id :** \`${member.id}\` (\`${member.user.username}\`)
            > **Nouvelle durée :** \`${
              parseInt((duration - parseInt(Date.now() / 1000)) / 60) + 1
            } minutes\`
            > **Fin de l'exclusion :** <t:${duration}:R>
            `
      )
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    logChannel?.send({ embeds: [embed] });

    // Return the message
    return interaction.reply({
      content: `L'exclusion de ${member} se terminera <t:${duration}:R>.`,
      ephemeral: true,
    });
  },
};
