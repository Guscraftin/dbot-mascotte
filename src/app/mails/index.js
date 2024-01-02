const settings = require('./appSettings');
const graphHelper = require('./graphHelper');
const { Mails } = require('../../dbObjects');
const { channel_test_mail } = require(process.env.CONSTANT);

// TODO : When it's done, remove one by one permission in https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/402e020c-df86-41ee-b7fe-1644cd12ec14/isMSAApp~/false, to keep only the necessary ones
// TODO : Continue to read the documentation of Microsoft Graph API (mainly the part about security) => https://learn.microsoft.com/en-us/graph/

async function initApp() {
    initializeGraph(settings);
    return await greetUserAsync();
}

async function initCheckMail() {
    // Get all actual mails
    try {
        const messages = await graphHelper.getLastMail();

        for (const message of messages) {
            const mail = await Mails.findOne({ where: { id: message.id } });
            if (mail) return;

            await Mails.create({ id: message.id });
        }
    } catch (err) {
        console.log(`Error getting user's inbox: ${err}`);
    }
}

async function checkNewMail(guild) {
    // Get the last mail
    try {
        const messages = await graphHelper.getLastMail();

        // Output each message's details
        for (const message of messages) {
            // TODO : Check only the 100 (see function in graphHelper.js) last mail (rate limit of graph api ?)
            // Use endpoints with server to get a notifications systems with the graph api (to get the last mail in real-time)
            const mail = await Mails.findOne({ where: { id: message.id } });
            if (mail) return;

            const channelMails = await guild.channels.fetch(channel_test_mail);
            if (message?.from?.emailAddress?.address === "noreply-moodle@forge.epita.fr") {
                await channelMails?.send({ content: `Nouveau mail reçu __Moodle__ : **\`${message?.subject}\`** !` });
            }
            else if (message.from.emailAddress.address === "discourse@forge.epita.fr") {
                await channelMails?.send({ content: `Nouveau mail reçu __News__ : **\`${message?.subject}\`** !` });
            }
            else {
                await channelMails?.send({ content: `Nouveau mail reçu : **\`${message?.subject}\`** !` });
            }

            await Mails.create({ id: message.id });
            // console.log(`Message: ${message.subject ?? 'NO SUBJECT'}`);
            // console.log(`  From: ${message.from?.emailAddress?.name ?? 'UNKNOWN'}`);
            // console.log(`  Status: ${message.isRead ? 'Read' : 'Unread'}`);
            // console.log(`  Received: ${message.receivedDateTime}`);
            // console.log(`  HasAttachments: ${message.hasAttachments}`);
            // console.log(`  Body: ${message.body.content}`);
        }
    } catch (err) {
        if (err.statusCode === 429) {
            console.error('Rate limit exceeded. To many requests for last mails.');
        } else {
            console.log(`Error getting user's inbox: ${err}`);
        }
    }
}
module.exports.initApp = initApp;
module.exports.initCheckMail = initCheckMail;
module.exports.checkNewMail = checkNewMail;


function initializeGraph(settings) {
    graphHelper.initializeGraphForUserAuth(settings, (info) => {
        console.log(info.message);
    });
}

async function greetUserAsync() {
    try {
        const user = await graphHelper.getUserAsync();
        return user?.displayName ?? 'unknown';
    } catch (err) {
        console.log(`Error getting user: ${err}`);
    }
}