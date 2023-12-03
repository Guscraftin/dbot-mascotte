const settings = {
    'clientId': process.env.CLIENT_ID_APP,
    'tenantId': process.env.TENANT_ID,
    'graphUserScopes': [
        'user.read',
        'mail.read',
        'mail.send'
    ]
};

module.exports = settings;