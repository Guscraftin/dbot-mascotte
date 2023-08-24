const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
    name: Events.MessageBulkDelete, 
    async execute(messages, channel){
        
        /**
         * Logs the event
         * TODO: Add all messages supressed by a bot
         */
        const logChannel = await channel.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('💥 - Suppression en masse de message')
            .setColor(color_basic)
            .setDescription(`**Plusieurs messages supprimés par un bot dans le salon ${channel}.**
            `)
            .setTimestamp()
            .setFooter({ text: channel.guild.name, iconURL: channel.guild.iconURL() })

        logChannel.send({ embeds: [embed] });
    }
};