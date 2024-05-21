const config = require('../config.json')
const endpoints = require('./endpoints')

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');

app.use(session({
    secret: config.session.key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(cors());
app.use(express.json());

const httpsOptions = {
    key: fs.readFileSync(config.https.key),
    cert: fs.readFileSync(config.https.certificate)
};

app.post('/transfer', endpoints.authenticateToken, endpoints.transfer);

app.post('/signin',
    endpoints.verifyLogin,
    endpoints.verifyPassword,
    endpoints.login
);

app.post('/signup',
    endpoints.verifyLogin,
    endpoints.verifyPassword,
    endpoints.signup
);

app.post('/reset',
    endpoints.verifyLogin,
    endpoints.reset
);

app.post('/update/password',
    endpoints.verifyPassword,
    endpoints.updatePassword,
);

app.get('/transactions', endpoints.authenticateToken, endpoints.transactions)

/* Actually run server */
https.createServer(httpsOptions, app).listen(config.server.port, () => {
    console.log(`HTTPS Server running on https://localhost:${config.server.port}`);
});
