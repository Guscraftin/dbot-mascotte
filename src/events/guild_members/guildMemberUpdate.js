const { EmbedBuilder, Events } = require('discord.js');
const { channel_logs, color_basic, role_organizer_event, role_class } = require(process.env.CONSTANT);

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.user.bot) return;

        /**
         * Add or remove the role organizer_event if the user has or not the role students
         */
        if (!oldMember.roles.cache.has(role_class) && newMember.roles.cache.has(role_class)) {
            await newMember.roles.add(role_organizer_event);
        } else if (oldMember.roles.cache.has(role_class) && !newMember.roles.cache.has(role_class)) {
            await newMember.roles.remove(role_organizer_event);
        }


        /**
         * Logs the event
         */
        const logChannel = await newMember.guild.channels.fetch(channel_logs);
        if (logChannel) {
        const addRoles = listAddRole();
        const removeRoles = listRemoveRole();

        const embed = new EmbedBuilder()
            .setAuthor({ name: oldMember.user.tag, iconURL: oldMember.user.displayAvatarURL() })
            .setColor(color_basic)
            .setThumbnail(newMember.user.displayAvatarURL())
            .setDescription(`**${newMember.user} a été mis à jour.**
            ${oldMember.displayName !== newMember.displayName ? `> **Surnom :** \`${oldMember.displayName}\` => \`${newMember.displayName}\`\n` : ``}${addRoles.length !== 0 ? `> **Rôle ajouté :** ${addRoles}\n` : ``}${removeRoles.length !== 0 ? `> **Rôle supprimé :** ${removeRoles}\n` : ``}`)
            .setTimestamp()
            .setFooter({ text: newMember.guild.name, iconURL: newMember.guild.iconURL() })

        logChannel?.send({ embeds: [embed] });


        function listAddRole() {
            let listNewRole = [];
            newMember.roles.cache.forEach(element => {
                listNewRole.push(element);
            });
            oldMember.roles.cache.forEach(element => {
                let indexElement = listNewRole.indexOf(element);
                if (indexElement !== -1) {
                    listNewRole.splice(indexElement, 1);
                }
            });
            return listNewRole;
        }

        function listRemoveRole() {
            let listOldRole = [];
            oldMember.roles.cache.forEach(element => {
                listOldRole.push(element);
            });
            newMember.roles.cache.forEach(element => {
                let indexElement = listOldRole.indexOf(element);
                if (indexElement !== -1) {
                    listOldRole.splice(indexElement, 1);
                }
            });
            return listOldRole;
        }}

    },
};