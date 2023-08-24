const { EmbedBuilder, Events } = require("discord.js");
const { channel_idea_poll, channel_logs, color_basic } = require(process.env.CONSTANT);

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(messageReaction, user) {
        if (user.bot) return;

        const channel = messageReaction.message.channel;

        /**
         * Suggestion system
         */
        if (channel.id === channel_idea_poll && !messageReaction.message.embeds[0].author.name.includes(" - ")) {
            const authorSuggestion = messageReaction.message.embeds[0].author.name.split(" (");
            const authorName = authorSuggestion[0];
            const authorId = authorSuggestion[1].split(")")[0];

            switch (messageReaction.emoji.name) {
                case '💬':
                    await messageReaction.remove();
                    const thread = await messageReaction.message.startThread({ name: `Echange sur l'idée de ${authorName}` });
                    if (authorId === user.id) await thread.send({ content: `${user}, tu peux apporter des précisions supplémentaires et échanger ici avec les autres volontaires concernant ta suggestion ci-dessus.` });
                    else await thread.send({ content: `${user}, tu peux échanger ici avec <@${authorId}> et les autres volontaires sur la suggestion ci-dessus.` })
                    break;
                    
                case '🗑️':
                    if (authorId === user.id) {
                        await messageReaction.message.thread?.delete();
                        await messageReaction.message.delete();
                    } else {
                        await messageReaction.users.remove(user);
                        const embed = new EmbedBuilder()
                            .setTitle("Impossible de supprimer la suggestion")
                            .setDescription(`Vous n'êtes pas l'auteur de cette [suggestion](${messageReaction.message.url}), vous ne pouvez donc pas la supprimer.`)
                            .setColor(color_basic)
                            .setTimestamp()
                            .setFooter({ text: messageReaction.message.guild.name, iconURL: messageReaction.message.guild.iconURL() });

                        await user.send({ embeds: [embed] });
                    }
                    break;
            }
        }


        /**
         * Logs the event
         */
        const logChannel = await messageReaction.message.guild.channels.fetch(channel_logs);
        if (!logChannel) return;
        const emojiName = messageReaction.emoji.name;

        const embed = new EmbedBuilder()
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setColor(color_basic)
            .setDescription(`**<@${user.id}> a ajouté sa réaction ${isDefaultEmoji() ? `\`${messageReaction.emoji.name}\`` : `<:${messageReaction.emoji.name}:${messageReaction.emoji.id}>`} [à ce message](${messageReaction.message.url}).**
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