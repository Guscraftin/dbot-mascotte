const { Events } = require('discord.js');
const { Guilds, Mails, Members, Suggestions, Tickets } = require('../../dbObjects.js');
const { checkBirthdays, muteTimeout, removeEmptyVoiceChannel, syncRoles } = require('../../functions.js');
const { initApp, initCheckMail, checkNewMail } = require('../../app/mails/index.js');
const cron = require("cron");

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        let guildsCount = await client.guilds.fetch();
        let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        await client.user.setPresence({ activities: [{ name: "se réveiller !", type: 0 }], status: "online" });

        // Sync the database
        await Guilds.sync({ alter: true });
        await Mails.sync({ alter: true });
        await Members.sync({ alter: true });
        await Suggestions.sync({ alter: true });
        await Tickets.sync({ alter: true });

        // Relaunch the timeout of the mute
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (!guild) return console.error("ready.js - Le bot n'est pas sur le serveur !");
        if (!guild.available) return console.error("ready.js - Le serveur n'est pas disponible !");

        // Check if the bot is synchronized with the server
        const userConnect = await initApp();
        console.log(`1/6 : ${userConnect} is correctly connect to the app !`);
        console.log(`2/6 : Start initialize mails...`);
        await initCheckMail(guild);
        console.log("3/6 : Start check birthdays...");
        await checkBirthdays(guild);
        console.log("4/6 : Start check user timeout...");
        await muteTimeout(guild);
        console.log("5/6 : Start remove empty voice channel...");
        await removeEmptyVoiceChannel(guild);
        console.log("6/6 : Start synchronize roles...");
        await syncRoles(guild);

        // Launch cron jobs
        new cron.CronJob("0 */5 * * *", () => checkBirthdays(guild), null, true, "Europe/Paris"); // Check 5 time a day
        
        // Launch setInterval (js function)
        setInterval(() => checkNewMail(guild), 10000); // Check every 10 seconds

        // Set the client user's activity
        await client.user.setPresence({ activities: [{ name: "vous câliner !", type: 0 }], status: "online" });

        // Log the bot is ready
        return console.log(`${client.user.username} est prêt à être utilisé par ${usersCount} utilisateurs sur ${guildsCount.size} serveurs !`);
    },
};
