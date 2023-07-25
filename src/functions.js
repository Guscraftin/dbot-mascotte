const {
    category_vocals,
    role_mute, role_separator, role_vocal,
    vocal_general, vocal_course, vocal_sleep, vocal_panel
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
                await user.roles.remove(role_mute, "Fin de l'exclusion");
            }
        } else {
            setTimeout(async () => {
                const memberDB = await Members.findOne({ where: { id: member.id } });
                if (memberDB.mute_time > Date.now()) return;
                await Members.update({ mute_time: null }, { where: { id: member.id } });
                const user = await guild.members.fetch(member.id);
                if (!user) await member.destroy();
                else {
                    await user.roles.remove(role_mute, "Fin de l'exclusion");
                }
            }, timeRemaining);
        }
    }
}


/**
 * Remove the empty voice channel except the vocal_general, vocal_course, vocal_sleep and vocal_panel in the category_vocals
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function removeEmptyVoiceChannel(guild) {
    const channelsNotDelete = [vocal_general, vocal_course, vocal_sleep, vocal_panel];

    const category = await guild.channels.fetch(category_vocals);
    if (!category) return console.error("functions.js - La catégorie n'existe pas !");

    const promises = await category.children.cache.map(async channel => {
        if (channel.members.size === 0 && !channelsNotDelete.includes(channel.id)) {
            await channel.delete();
        }
    });
    await Promise.all(promises);
}


/**
 * Sync roles (role_separator and role_vocal)
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function syncRoles(guild) {
    const role = await guild.roles.fetch(role_vocal);
    if (!role) return console.error("functions.js - Le rôle n'existe pas !");

    const members = await guild.members.fetch();
    const promises = await members.map(async member => {
        if (member.user.bot) return;

        await member.roles.add(role_separator);
        if (member.voice.channelId) await member.roles.add(role);
        else await member.roles.remove(role);
    });
    await Promise.all(promises);
}


module.exports = { muteTimeout, removeEmptyVoiceChannel, syncRoles };