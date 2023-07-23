const { Events } = require('discord.js');
const { Guilds, Members } = require('../../dbObjects.js');
const { muteTimeout, removeEmptyVoiceChannel, syncRoles } = require('../../functions.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        let guildsCount = await client.guilds.fetch();
        let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        // Sync the database
        await Guilds.sync({ alter: true });
        await Members.sync({ alter: true });

        // Relaunch the timeout of the mute
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (!guild) return console.error("ready.js - Le bot n'est pas sur le serveur !");
        if (!guild.available) return console.error("ready.js - Le serveur n'est pas disponible !");

        // Check if the bot is synchronized with the server
        await muteTimeout(guild);
        await removeEmptyVoiceChannel(guild);
        await syncRoles(guild);

        // Log the bot is ready
        return console.log(`${client.user.username} est prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs !`);
    },
};
