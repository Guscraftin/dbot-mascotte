const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildScheduledEventUpdate,
    async execute(oldGuildScheduledEvent, newGuildScheduledEvent){
        
        /**
         * Logs the event
         */
        const logChannel = await newGuildScheduledEvent.guild.channels.fetch(channel_logs);
        if (!logChannel) return;
        const user = newGuildScheduledEvent.creator;

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`${user} a **mise à jour** l'événement nommé \`${newGuildScheduledEvent.name}\`
            `)
            .setTimestamp()
            .setFooter({ text: newGuildScheduledEvent.guild.name, iconURL: newGuildScheduledEvent.guild.iconURL() })

        logChannel.send({ embeds: [embed] });
    }
};