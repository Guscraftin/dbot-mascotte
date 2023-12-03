const { EmbedBuilder, Events } = require('discord.js');
const { channel_logs, color_basic, role_mute, role_students, role_vocal, vocal_general, vocal_course, vocal_sleep, vocal_panel } = require(process.env.CONSTANT);

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState){
        const oldChannel = await oldState?.channel?.fetch() || null;
        const channelsNotDelete = [vocal_general, vocal_course, vocal_sleep, vocal_panel];

        /**
         * Manage the panel of voice channel
         */
        if (newState && newState.channelId === vocal_panel) {
            // Create a new voice channel
            const voiceChannel = await newState.channel.clone({ name: `Salon de ${newState.member.displayName}` });
            await voiceChannel.permissionOverwrites.edit(role_students, {
                ViewChannel: true,
            });
            await voiceChannel.permissionOverwrites.edit(role_mute, {
                SendMessages: false,
                SendMessagesInThreads: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                AddReactions: false,
                Speak: false,
            });
            await voiceChannel.permissionOverwrites.edit(newState.guild.id, {
                ViewChannel: false,
            });
            await voiceChannel.permissionOverwrites.edit(newState.member.id, {
                ViewChannel: true,
                ManageChannels: true,
                ManageRoles:true,
                PrioritySpeaker:true,
            });

            // Move the user to the new voice channel
            await newState.setChannel(voiceChannel);
        }

        
        // Delete the voice channel if it's empty
        if (oldChannel?.members?.size === 0 && !channelsNotDelete.includes(oldState.channelId)) {
            await oldState.channel.delete();
        }


        /**
         * Manage the voice role
         */
        const oldRole = await oldState.guild.roles.fetch(role_vocal);
        if (oldRole) {
            if (!oldState?.channelId) await oldState.member.roles.add(oldRole);
            else if (!newState?.channelId) await newState.member.roles.remove(oldRole);
        }


        /**
         * Logs the event
         */
        const logChannel = await newState.guild.channels.fetch(channel_logs);
        if (logChannel) {
        if (oldState.channel === null) {
            const embedJoin = new EmbedBuilder()
                .setAuthor({ name: newState.member.user.tag, iconURL: newState.member.displayAvatarURL() })
                .setColor(color_basic)
                .setDescription(`<@${newState.member.id}> **a rejoint le salon vocal ${newState.channel} ||(\`${newState?.channel?.name}\`)||.**
                `)
                .setTimestamp()
                .setFooter({ text: newState.guild.name, iconURL: newState.guild.iconURL() })

            logChannel?.send({ embeds: [embedJoin] });

        } else if (newState.channel === null) {
            const embedLeave = new EmbedBuilder()
                .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL() })
                .setColor(color_basic)
                .setDescription(`<@${oldState.member.id}> **a quitté le salon vocal ${oldState.channel} ||(\`${oldState.channel.name}\`)||.**
                `)
                .setTimestamp()
                .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL() })

            logChannel?.send({ embeds: [embedLeave] });
        
        } else if (oldState.channelId != newState.channelId) {
            const embedMove = new EmbedBuilder()
                .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL() })
                .setColor(color_basic)
                .setDescription(`<@${oldState.member.id}> **a changé de salon vocal ${oldState.channel} => ${newState.channel}.**
                ||(\`${oldState.channel.name}\` => \`${newState.channel.name}\`)||
                `)
                .setTimestamp()
                .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL() })

            logChannel?.send({ embeds: [embedMove] });

        } else {
            const embedDeaf = new EmbedBuilder()
                .setAuthor({ name: oldState.member.user.tag, iconURL: oldState.member.displayAvatarURL() })
                .setColor(color_basic)
                .setDescription(`**Le statut du micro de <@${oldState.member.id}> à été mis à jour dans le salon vocal ${oldState.channel} ||(\`${oldState.channel.name}\`)||.**
                ${!oldState.selfMute && newState.selfMute ? `> 🎙 **Muet :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.selfMute && !newState.selfMute ? `> 🎙 **Muet :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.selfDeaf && newState.selfDeaf ? `> 🔈 **Sourd :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.selfDeaf && !newState.selfDeaf ? `> 🔈 **Sourd :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.serverMute && newState.serverMute ? `> 🎙 **Muet par un modo :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.serverMute && !newState.serverMute ? `> 🎙 **Muet par un modo :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.serverDeaf && newState.serverDeaf ? `> 🔈 **Sourd par un modo :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.serverDeaf && !newState.serverDeaf ? `> 🔈 **Sourd par un modo :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.selfVideo && newState.selfVideo ? `> 📷 **Camera :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.selfVideo && !newState.selfVideo ? `> 📷 **Camera :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.streaming && newState.streaming ? `> 📺 **Partage d'écran :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.streaming && !newState.streaming ? `> 📺 **Partage d'écran :** \`Activé\` => \`Désactivé\`\n` : ``} ${!oldState.suppress && newState.suppress ? `> 📣 **Muet dans Stage :** \`Désactivé\` => \`Activé\`\n` : ``} ${oldState.suppress && !newState.suppress ? `> 📣 **Muet dans Stage :** \`Activé\` => \`Désactivé\`\n` : ``}
                `)
                .setTimestamp()
                .setFooter({ text: oldState.guild.name, iconURL: oldState.guild.iconURL() })

            logChannel?.send({ embeds: [embedDeaf] });
        }}

    }
};