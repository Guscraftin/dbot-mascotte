const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage){

        /**
         * Logs the event
         */
        const logChannel = await newMessage.guild.channels.fetch(channel_logs);
        if (!logChannel) return;

        const oldContentMessage = oldMessage.content;
        const newContentMessage = newMessage.content;

        // If the message is a return message, or the message is sent in the log channel, we return
        if (newMessage.type === 19 || oldMessage.channelId === logChannel.id) return;

        let embed = new EmbedBuilder()
            .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.displayAvatarURL() })
            .setColor(color_basic)
            .setTimestamp()
            .setFooter({ text: newMessage.guild.name, iconURL: newMessage.guild.iconURL() })

        // Logs for pinned messages
        if (oldMessage.pinned != newMessage.pinned) {
            embed
                .setDescription(`**Message envoyé par <@${newMessage.author.id}> ${newMessage.pinned === true ? "épinglé" : "désépinglé"} dans ${newMessage.channel}.** [Aller au message.](${newMessage.url})
                `)

        } // Logs for edited messages
        else if ((oldContentMessage === null || oldContentMessage.length <= 1024) && newContentMessage.length <= 1024) {
            embed
                .setDescription(`**Message envoyé par <@${newMessage.author.id}> modifié dans ${newMessage.channel}.** [Aller au message.](${newMessage.url})
                `)
                .addFields([
                    {name: `\`🔅\` - Ancien - \`🔅\``, value: `\`\`\`${oldContentMessage}\`\`\``},
                    {name: `\`🔅\` - Nouveau - \`🔅\``, value: `\`\`\`${newContentMessage}\`\`\``}
                ])

        } else { return; }

        logChannel.send({ embeds: [embed] });
    }
};