const settings = require('./appSettings');
const graphHelper = require('./graphHelper');
const TurndownService = require('turndown');
const { Mails } = require('../../dbObjects');
const { channel_mails, channel_test_mail, role_mail_moodle, role_mail_news } = require(process.env.CONSTANT);

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

            const turndownService = new TurndownService();
            const channelMails = await guild.channels.fetch(channel_mails);
            const channelTestMails = await guild.channels.fetch(channel_test_mail);

            /**
             * Mail from Moodle
             */
            if (message?.from?.emailAddress?.address === "noreply-moodle@forge.epita.fr") {
                const patternGetTbody = /<tbody>([\s\S]*?)<\/tbody>/i;
                const tbodyMsg = message.body.content.match(patternGetTbody);
                if (!tbodyMsg || tbodyMsg.length < 2) {
                    console.log("Error parsing the mail from Moodle: tbody not found");
                    continue;
                }

                const motif = 'dir="ltr" style="text-align:left">';
                const indexMotif = tbodyMsg[1].indexOf(motif);
                if (indexMotif === -1) {
                    console.log("Error parsing the mail from Moodle: motif not found");
                    continue;
                }
                const msgContent = tbodyMsg[1].substring(indexMotif + motif.length);

                let markdown = turndownService.turndown(msgContent);
                const initMsgMaxLength = 2000 - `||<@&${role_mail_moodle}>||\n\`\`\`fix\n${message.subject}\n\`\`\`\n`.length;
                const initPart = markdown.substring(0, initMsgMaxLength);
                markdown = markdown.substring(initMsgMaxLength);
                await channelTestMails?.send(`||<@&${role_mail_moodle}>||\n\`\`\`fix\n${message.subject}\n\`\`\`\n${initPart}`);
                while (markdown.length > 0) {
                    const msgMaxLength = 2000;
                    const part = markdown.substring(0, msgMaxLength);
                    markdown = markdown.substring(msgMaxLength);
                    await channelTestMails?.send(`${part}`);
                }
            }
            /**
             * Mail from News
             */
            else if (message.from.emailAddress.address === "discourse@forge.epita.fr") {
                // Check if it is a announce or a delegate news
                const categoryOfNews = message?.subject?.match(/\[([^\[\]]+)]/g).map(element => element.slice(1, -1));
                if (categoryOfNews[1]?.includes("Annonces") || categoryOfNews[1]?.includes("Délégués")) {
                    // Remove the useless part of the initial message (profile + footer)
                    const patternFirstPart = /<tbody[\s\S]*?<\/tbody>/i;
                    const mailWithoutFirstPart = message.body.content.replace(patternFirstPart, '');
                    const patternLastPart = /<div style="color:#666"><hr style="background-color:#ddd; height:1px; border:1px; background-color:#ddd; height:1px; border:1px">[\s\S]*/i;
                    const mailOnlyContent = mailWithoutFirstPart.replace(patternLastPart, '');

                    // Convert the html to markdown + Send the message
                    let markdown = turndownService.turndown(mailOnlyContent);
                    const initMsgMaxLength = 2000 - `||<@&${role_mail_news}>||\n`.length;
                    const initPart = markdown.substring(0, initMsgMaxLength);
                    markdown = markdown.substring(initMsgMaxLength);
                    await channelMails?.send(`||<@&${role_mail_news}>||\n${initPart}`);
                    while (markdown.length > 0) {
                        const msgMaxLength = 2000;
                        const part = markdown.substring(0, msgMaxLength);
                        markdown = markdown.substring(msgMaxLength);
                        await channelMails?.send(`${part}`);
                    }
                } else {
                    await channelTestMails?.send({ content: `Nouveau mail reçu __News__ : **\`${message?.subject}\`** !` });
                }
            }
            /**
             * Other Mail
             */
            else {
                await channelTestMails?.send({ content: `Nouveau mail reçu : **\`${message?.subject}\`** !` });
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