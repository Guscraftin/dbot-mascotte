const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.StageInstanceUpdate,
    async execute(oldStageInstance, newStageInstance){

        /**
         * Logs the event
         */
        const logChannel = await newStageInstance.guild.channels.fetch(channel_logs);

        const embed = new EmbedBuilder()
            .setTitle(`Modification d'une conférence`)
            .setColor(color_basic)
            .setDescription(`**La conférence \`${newStageInstance.topic}\` a été modifiée dans le salon ${newStageInstance.channel}.**
            > **Sujet :** \`${oldStageInstance.topic}\` => \`${newStageInstance.topic}\`
            `)
            .setTimestamp()
            .setFooter({ text: newStageInstance.guild.name, iconURL: newStageInstance.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });
    }
};