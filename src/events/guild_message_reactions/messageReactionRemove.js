const { Events, EmbedBuilder } = require('discord.js');
const { channel_logs, color_basic } = require(process.env.CONSTANT);


module.exports = {
    name: Events.MessageReactionRemove,
    async execute(messageReaction, user){

        /**
         * Logs the event
         */
        const logChannel = await messageReaction.message.guild.channels.fetch(channel_logs);
        if (!logChannel) return;
        const emojiName = messageReaction.emoji.name;
        
        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`**<@${user.id}> a retiré sa réaction ${isDefaultEmoji() ? `\`${messageReaction.emoji.name}\`` : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`} [à ce message](${messageReaction.message.url}).**
            `)
            .setTimestamp()
            .setFooter({ text: messageReaction.message.guild.name, iconURL: messageReaction.message.guild.iconURL() })

        logChannel.send({ embeds: [embed] });

        function isDefaultEmoji() {
            let testEmojiName = emojiName.match(/[0-9a-z_]/gi);
            if (testEmojiName === null) testEmojiName = [];

            return testEmojiName.length != emojiName.length;
        }
    }
};