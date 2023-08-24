const { ChannelType, Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
    name: Events.ThreadDelete,
    async execute(thread){

        /**
         * Logs the event
         */
        const logChannel = await thread.guild.channels.fetch(channel_logs);

        const embed = new EmbedBuilder()
            .setTitle(`Suppression d'un thread ${thread.type === ChannelType.PublicThread ? 'public' : 'privé'}`)
            .setColor(color_basic)
            .setDescription(`Le thread ${thread.type === ChannelType.PublicThread ? `public` : `privé`} \`${thread.name}\` a été **supprimé** dans le salon ${thread.parent} par un modérateur.`)
            .setTimestamp()
            .setFooter({ text: thread.guild.name, iconURL: thread.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });
    }
};