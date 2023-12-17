require('isomorphic-fetch');
const azure = require('@azure/identity');
const graph = require('@microsoft/microsoft-graph-client');
const authProviders =
    require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');

let _settings = undefined;
let _deviceCodeCredential = undefined;
let _userClient = undefined;

function initializeGraphForUserAuth(settings, deviceCodePrompt) {
    if (!settings) {
        throw new Error('Settings cannot be undefined');
    }

    _settings = settings;

    _deviceCodeCredential = new azure.DeviceCodeCredential({
        clientId: settings.clientId,
        tenantId: settings.tenantId,
        userPromptCallback: deviceCodePrompt
    });

    const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
        _deviceCodeCredential, {
        scopes: settings.graphUserScopes
    });

    _userClient = graph.Client.initWithMiddleware({
        authProvider: authProvider
    });
}
module.exports.initializeGraphForUserAuth = initializeGraphForUserAuth;

async function getUserAsync() {
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    await renewTokenIfNeeded();

    return _userClient.api('/me')
        // Only request specific properties
        .select(['displayName', 'mail', 'userPrincipalName'])
        .get();
}
module.exports.getUserAsync = getUserAsync;


async function renewTokenIfNeeded() {
    if (!_deviceCodeCredential) {
        throw new Error('Graph has not been initialized for user auth');
    }

    if (!_settings?.graphUserScopes) {
        throw new Error('Setting "scopes" cannot be undefined');
    }

    const expirationBufferInMs = 300000; // 5 minutes before expiry for renewal
    const token = await _deviceCodeCredential.getToken(_settings?.graphUserScopes);

    const now = Date.now();
    const expiresOn = token.expiresOnTimestamp - expirationBufferInMs;

    if (expiresOn <= now) {
        await _deviceCodeCredential.getToken(_settings?.graphUserScopes);

        const authProvider = new authProviders.TokenCredentialAuthenticationProvider(
            _deviceCodeCredential, {
            scopes: _settings.graphUserScopes
        });

        _userClient = graph.Client.initWithMiddleware({
            authProvider: authProvider
        });

        // FIXME: Delete when it's not necessary
        console.log('Token renewed');
    }
}

async function getLastMail() {
    if (!_userClient) {
        throw new Error('Graph has not been initialized for user auth');
    }

    await renewTokenIfNeeded();

    return _userClient.api('/me/mailFolders/inbox/messages')
        .select(['from', 'isRead', 'receivedDateTime', 'subject', 'body', 'hasAttachments'])
        .top(100)
        .orderby('receivedDateTime DESC')
        .get();
}
module.exports.getLastMail = getLastMail;