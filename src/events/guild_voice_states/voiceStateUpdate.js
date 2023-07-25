const { Events } = require('discord.js');
const { role_mute, role_students, role_vocal, vocal_general, vocal_course, vocal_sleep, vocal_panel } = require(process.env.CONSTANT);

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
    }
};