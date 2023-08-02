const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {
    category_vocals, channel_announce, channel_muted,
    color_basic,
    role_admins, role_birthday, role_mute, role_separator, role_students, role_vocal,
    vocal_general, vocal_course, vocal_sleep, vocal_panel
} = require(process.env.CONSTANT.replace("../.", ''));
const { Guilds, Members } = require('./dbObjects.js');
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


/**
 * Check birthday if not already check today
 * @param {import('discord.js').Guild} guild
 * @returns {void}
 */
async function checkBirthdays(guild) {
    const currentDate = new Date();

    const announceChannel = await guild.channels.fetch(channel_announce);
    if (!announceChannel) return console.error("functions.js - Le salon d'annonce n'existe pas !");
    const mutedChannel = await guild.channels.fetch(channel_muted);
    if (!mutedChannel) return console.error("functions.js - Le salon d'anniversaire n'existe pas !");
    const birthdayRole = await guild.roles.fetch(role_birthday);
    if (!birthdayRole) return console.error("functions.js - Le rôle d'anniversaire n'existe pas !");
  
    const members = await guild.members.fetch().catch(() => null);
    if (!members) return console.error("functions.js - Les membres n'ont pas pu être récupérés !");
    const promises = members.map(async member => {
        const user = await Members.findOne({ where: { id: member.id } });
        if (user && user.date_birthday && user.date_birthday.getMonth() === currentDate.getMonth() && user.date_birthday.getDate() === currentDate.getDate()) {
            if (user.channel_birthday) return;

            const embed = new EmbedBuilder()
                .setTitle("Joyeux anniversaire ! 🎉")
                .setColor(color_basic)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Aujourd'hui est l'anniversaire d'un camarade, d'un ami qui fait partie de notre groupe.
Fêtons comme il se doit son anniversaire.

> ### Mais attendez, c'est l'anniversaire de qui ?
Et bien, pour ceux qui ne le sauraient toujours pas, **c'est l'anniversaire de <@${member.id}>**.

Comme ici, les admins sont sympas. L'heureux élu reçoit :
> -> Un rôle pendant toute la journée.
> -> Ainsi que la propriété d'un salon où il peut faire pendant une journée ce que bon lui semble. (Cela peut être simplement un salon pour que les gens lui souhaitent un joyeux anniversaire ou pour qu'il organise une soirée...)
> A lui de configurer son salon (par défaut, tout le monde peut écrire dedans). Il peut néanmoins demander l'aide des admins.

Encore une fois **BON ANNIVERSAIRE !!!**
🎉 Profite bien de ta journée 🎉`)

            await announceChannel.send({ content: `||<@&${role_students}>||`, embeds: [embed] });

            const birthChannel = await mutedChannel.parent.children.create({
                name: `🎁・anniversaire-${member.displayName}`,
                topic: `Salon d'anniversaire de <@${member.id}>. **Souhaitez lui un joyeux anniversaire !**`,
                position: 0,
                permissionOverwrites: [
                    {
                        id: role_students,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: role_mute,
                        deny: [
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.SendMessagesInThreads,
                            PermissionFlagsBits.CreatePublicThreads,
                            PermissionFlagsBits.CreatePrivateThreads,
                            PermissionFlagsBits.AddReactions,
                        ],    
                    },
                    {
                        id: guild.roles.everyone,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: member.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.ManageChannels,
                            PermissionFlagsBits.ManageRoles,
                            PermissionFlagsBits.ManageWebhooks,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.SendMessagesInThreads,
                            PermissionFlagsBits.CreatePublicThreads,
                            PermissionFlagsBits.CreatePrivateThreads,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.AddReactions,
                            PermissionFlagsBits.UseExternalEmojis,
                            PermissionFlagsBits.UseExternalStickers,
                            PermissionFlagsBits.MentionEveryone,
                            PermissionFlagsBits.ManageMessages,
                            PermissionFlagsBits.ManageThreads,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.SendTTSMessages,
                            PermissionFlagsBits.UseApplicationCommands,
                            PermissionFlagsBits.SendVoiceMessages,
                            PermissionFlagsBits.ManageEvents,
                        ],
                    },
                ]
            }).catch(error => console.error(`functions.js - Le salon d'anniversaire n'a pas pu être créé !\n${error}`));
            if (birthChannel) {
                await birthChannel.send(`🎉 Joyeux anniversaire <@${member.id}> ! 🎉`);
                await user.update({ channel_birthday: birthChannel.id });
            }

            await member.roles.add(role_birthday);
        } else {
            if (user && user.channel_birthday) {
                const channel = await guild.channels.fetch(user.channel_birthday);
                if (channel) {
                    await channel.permissionOverwrites.cache.each(async overwrite => {
                        await overwrite.edit({ ViewChannel: false });
                    });
                    await channel.send(`<@&${role_admins}>, son anniversaire est terminé, vous lui envoyer la transcription de ce salon et le supprimer !`)
                }
                await user.update({ channel_birthday: null });
            }

            await member.roles.remove(role_birthday);
        }
    });
    await Promise.all(promises);
}


module.exports = { checkBirthdays, muteTimeout, removeEmptyVoiceChannel, syncRoles };