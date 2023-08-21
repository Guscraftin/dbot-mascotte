const { Events } = require('discord.js');
const { role_organizer_event, role_students } = require(process.env.CONSTANT);

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.user.bot) return;

        /**
         * Add or remove the role organizer_event if the user has or not the role students
         */
        if (!oldMember.roles.cache.has(role_students) && newMember.roles.cache.has(role_students)) {
            await newMember.roles.add(role_organizer_event);
        } else if (oldMember.roles.cache.has(role_students) && !newMember.roles.cache.has(role_students)) {
            await newMember.roles.remove(role_organizer_event);
        }
    },
};