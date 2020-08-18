const { google } = require('googleapis');

const loginController = {};

loginController.oAuth = async (req, res, next) => {

    const oauth2Client = new google.auth.OAuth2(
        '942116613855-ctqekeujhe5j7t1pu7rbmm8sv2kl2t3i.apps.googleusercontent.com',
        'QREJbz1YLUVaOsaCJuTOt6r7',
        'http://localhost:3000/api/login/google'
    );

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/classroom.profile.photos',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        response_type: 'code',
        prompt: 'consent',
    })

    res.locals.url = url;
    return next();
};
//creates Oauth token 
loginController.afterConsent = (req, res, next) => {

    const oauth2Client = new google.auth.OAuth2(
        '942116613855-ctqekeujhe5j7t1pu7rbmm8sv2kl2t3i.apps.googleusercontent.com',
        'QREJbz1YLUVaOsaCJuTOt6r7',
        'http://localhost:3000/api/login/google'
    );
    
    oauth2Client.getToken(req.query.code)
    .then(data => {
        const { tokens } = data;
        oauth2Client.setCredentials(tokens);
        res.locals.token = tokens.id_token;
        return next();
    })
    .catch(err => {
        if (err) console.log('afterConsent .catch block: ', err)
    })
};

module.exports = loginController;
