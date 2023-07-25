const { Events } = require('discord.js');
const { role_separator, role_students } = require(process.env.CONSTANT);
const { Guilds } = require('../../dbObjects.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (member.user.bot) return;

        // Get information about the guild in the database
        let guildDB = await Guilds.findOne({ where: { id: member.guild.id } });
        if (!guildDB) guildDB = await Guilds.create({ id: member.guild.id });

        // Add the role to the member
        if (guildDB.automatic_verified) await member.roles.add(role_students);
        await member.roles.add(role_separator);
    },
};