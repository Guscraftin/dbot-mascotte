const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.GuildScheduledEventCreate,
    async execute(guildScheduledEvent){

        /**
         * Logs the event
         */
        const logChannel = await guildScheduledEvent.guild.channels.fetch(channel_logs);
        if (!logChannel) return;
        const user = guildScheduledEvent.creator;

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`${user} a **créé** un nouvel événement nommé \`${guildScheduledEvent.name}\`
            `)
            .setTimestamp()
            .setFooter({ text: guildScheduledEvent.guild.name, iconURL: guildScheduledEvent.guild.iconURL() })

        logChannel.send({ embeds: [embed] });
    }
};