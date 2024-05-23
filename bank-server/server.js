// ------------------------  external imports ------------------------
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https');
const fs = require('fs');

// -------------------------- inner imports --------------------------
const config = require('../config.json')
const transaction = require('./endpoints/transaction')
const auth = require('./endpoints/auth')
const totp = require('./endpoints/totp')
const {initDb} = require("./persistence/initdb");

app.use(cors());
app.use(express.json());

const httpsOptions = {
    key: fs.readFileSync(config.https.key),
    cert: fs.readFileSync(config.https.certificate)
};

initDb();

app.use('/auth', auth)
app.use('/transactions', transaction);
app.use('/totp', totp);


/*
app.post('/generate-totp-secret', endpoints.authenticateToken, enpoints.genTOTP)
*/

/* Actually run server */
https.createServer(httpsOptions, app).listen(config.server.port, () => {
    console.log(`HTTPS Server running on https://localhost:${config.server.port}`);
});
