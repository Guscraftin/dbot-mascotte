const settings = require('./appSettings');
const graphHelper = require('./graphHelper');
const { Mails } = require('../../dbObjects');
const { channel_test_mail } = require(process.env.CONSTANT);

// FIXME : Check if the authentication has no expiration date else, refresh the token
// TODO : When it's done, remove one by one permission in https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/402e020c-df86-41ee-b7fe-1644cd12ec14/isMSAApp~/false, to keep only the necessary ones
// TODO : Continue to read the documentation of Microsoft Graph API (mainly the part about security) => https://learn.microsoft.com/en-us/graph/

async function initApp() {
    initializeGraph(settings);
    return await greetUserAsync();
}

async function initCheckMail() {
    // Get all actual mails
    try {
        const messagePage = await graphHelper.getLastMail();
        const messages = messagePage.value;

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
        const messagePage = await graphHelper.getLastMail();
        const messages = messagePage.value;

        // Output each message's details
        for (const message of messages) {
            // FIXME : Check only the 100 (see function in graphHelper.js) last mail (rate limit of graph api ?)
            const mail = await Mails.findOne({ where: { id: message.id } });
            if (mail) return;

            const channelMails = await guild.channels.fetch(channel_test_mail);
            if (message?.from?.emailAddress?.address === "noreply-moodle@forge.epita.fr")
            {
                await channelMails?.send({ content: `Nouveau mail reçu __Moodle__ : **\`${message?.subject}\`** !`});
            }
            else if (message.from.emailAddress.address === "discourse@forge.epita.fr")
            {
                await channelMails?.send({ content: `Nouveau mail reçu __News__ : **\`${message?.subject}\`** !`});
            }
            else
            {
                await channelMails?.send({ content: `Nouveau mail reçu : **\`${message?.subject}\`** !`});
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
        console.log(`Error getting user's inbox: ${err}`);
    }

    /*
    const choices = [
        'Display access token',
        'List my inbox',
        'Send mail',
        'Get last mail'
    ];

    while (choice != -1) {
        switch (choice) {
            case -1:
                // Exit
                console.log('Goodbye...');
                break;
            case 0:
                // Display access token
                await displayAccessTokenAsync();
                break;
            case 1:
                // List emails from user's inbox
                await listInboxAsync();
                break;
            case 2:
                // Send an email message
                await sendMailAsync();
                break;
            case 3:
                // Run any Graph code
                await getLastMail();
                break;
            default:
                console.log('Invalid choice! Please try again.');
        }
    }*/
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
/*
async function displayAccessTokenAsync() {
    try {
        const userToken = await graphHelper.getUserTokenAsync();
        console.log(`User token: ${userToken}`);
    } catch (err) {
        console.log(`Error getting user access token: ${err}`);
    }
}

async function listInboxAsync() {
    try {
        const messagePage = await graphHelper.getInboxAsync();
        const messages = messagePage.value;

        // Output each message's details
        for (const message of messages) {
            console.log(`Message: ${message.subject ?? 'NO SUBJECT'}`);
            console.log(`  From: ${message.from?.emailAddress?.name ?? 'UNKNOWN'}`);
            console.log(`  Status: ${message.isRead ? 'Read' : 'Unread'}`);
            console.log(`  Received: ${message.receivedDateTime}`);
        }

        // If @odata.nextLink is not undefined, there are more messages
        // available on the server
        const moreAvailable = messagePage['@odata.nextLink'] != undefined;
        console.log(`\nMore messages available? ${moreAvailable}`);
    } catch (err) {
        console.log(`Error getting user's inbox: ${err}`);
    }
}

async function sendMailAsync() {
    try {
        // Send mail to the signed-in user
        // Get the user for their email address
        const user = await graphHelper.getUserAsync();
        const userEmail = user?.mail ?? user?.userPrincipalName;

        if (!userEmail) {
            console.log('Couldn\'t get your email address, canceling...');
            return;
        }

        await graphHelper.sendMailAsync('Testing Microsoft Graph',
            'Hello world!', userEmail);
        console.log('Mail sent.');
    } catch (err) {
        console.log(`Error sending mail: ${err}`);
    }
}*/