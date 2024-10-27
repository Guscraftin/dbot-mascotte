const { ChannelType, Events, EmbedBuilder } = require("discord.js");
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
  name: Events.ThreadMembersUpdate,
  async execute(addedMembers, removedMembers, thread) {
    /**
     * Logs the event
     */
    const logChannel = await thread.guild.channels.fetch(channel_logs);

    // Create the code for the embed
    let addedCode = "";
    addedMembers.forEach((value, key) => {
      addedCode += `> ✅ : <@${key}>\n`;
    });
    let removedCode = "";
    removedMembers.forEach((value, key) => {
      removedCode += `> ❌ : <@${key}>\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`Thread : Membre`)
      .setColor(color_basic)
      .setDescription(
        `La liste des membres du thread ${
          thread.type === ChannelType.PublicThread ? `public` : `privé`
        } <#${thread.id}> (\`${
          thread.name
        }\`) a été **mis à jour** dans le salon ${thread.parent}.
            ${addedCode}${removedCode}
            `
      )
      .setTimestamp()
      .setFooter({ text: thread.guild.name, iconURL: thread.guild.iconURL() });

    logChannel?.send({ embeds: [embed] });
  },
};
