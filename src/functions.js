const {
    categoryVocals,
    roleMute, roleSeparator, roleVocal,
    vocalGeneral, vocalCourse, vocalSleep, vocalPanel
} = require(process.env.CONSTANT.replace("../.", ''));
const { Members } = require('./dbObjects.js');
const { Op } = require('sequelize');



/**
 * Relaunch the timeout of the mute
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function muteTimeout(guild) {
    const members = await Members.findAll({ where: { mute_time: { [Op.not]: null } } });

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
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function removeEmptyVoiceChannel(guild) {
    const channelsNotDelete = [vocalGeneral, vocalCourse, vocalSleep, vocalPanel];

    const category = await guild.channels.fetch(categoryVocals);
    if (!category) return console.error("functions.js - La catégorie n'existe pas !");

    const promises = await category.children.cache.map(async channel => {
        if (channel.members.size === 0 && !channelsNotDelete.includes(channel.id)) {
            await channel.delete();
        }
    });
    await Promise.all(promises);
}


/**
 * Sync roles (roleSeparator and roleVocal)
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function syncRoles(guild) {
    const role = await guild.roles.fetch(roleVocal);
    if (!role) return console.error("functions.js - Le rôle n'existe pas !");

    const members = await guild.members.fetch();
    const promises = await members.map(async member => {
        if (member.user.bot) return;

        await member.roles.add(roleSeparator);
        if (member.voice.channelId) await member.roles.add(role);
        else await member.roles.remove(role);
    });
    await Promise.all(promises);
}


module.exports = { muteTimeout, removeEmptyVoiceChannel, syncRoles };