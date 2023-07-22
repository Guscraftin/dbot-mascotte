const { Events } = require('discord.js');
const { categoryVocals, roleMute, roleStudents, vocalGeneral, vocalCourse, vocalSleep, vocalPanel } = require(process.env.CONSTANT);
const { Members } = require('../../dbObjects.js');
const { Op } = require('sequelize');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        let guildsCount = await client.guilds.fetch();
        let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        // Sync the database
        await Members.sync({ alter: true });

        // Relaunch the timeout of the mute
        muteTimeout(client);
        removeEmptyVoiceChannel(client);

        // Log the bot is ready
        return console.log(`${client.user.username} est prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs !`);
    },
};


/**
 * Relaunch the timeout of the mute
 * @param {import('discord.js').Client} client
 * @returns {void}
 */
async function muteTimeout(client) {
    const members = await Members.findAll({ where: { mute_time: { [Op.not]: null } } });
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (!guild) return console.error("ready.js - Le bot n'est pas sur le serveur !");

    for (const member of members) {
        const timeRemaining = member.mute_time - Date.now();

        if (timeRemaining <= 0) {
            await Members.update({ mute_time: null }, { where: { id: member.id } });
            const user = await guild.members.fetch(member.id);
            if (!user) await member.destroy();
            else {
                await user.roles.remove(roleMute, "Fin de l'exclusion");
            }
        } else {
            setTimeout(async () => {
                const memberDB = await Members.findOne({ where: { id: member.id } });
                if (memberDB.mute_time > Date.now()) return;
                await Members.update({ mute_time: null }, { where: { id: member.id } });
                const user = await guild.members.fetch(member.id);
                if (!user) await member.destroy();
                else {
                    await user.roles.remove(roleMute, "Fin de l'exclusion");
                }
            }, timeRemaining);
        }
    }
}


/**
 * Remove the empty voice channel except the vocalGeneral, vocalCourse, vocalSleep and vocalPanel in the categoryVocals
 * @param {import('discord.js').Client} client
 * @returns {void}
 */
async function removeEmptyVoiceChannel(client) {
    const channelsNotDelete = [vocalGeneral, vocalCourse, vocalSleep, vocalPanel];
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (!guild) return console.error("ready.js - Le bot n'est pas sur le serveur !");

    const category = await guild.channels.fetch(categoryVocals);
    if (!category) return console.error("ready.js - La catégorie n'existe pas !");

    await category.children.cache.forEach(async channel => {
        if (channel.members.size === 0 && !channelsNotDelete.includes(channel.id)) {
            await channel.delete();
        }
    });
}