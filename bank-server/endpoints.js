const { validationResult, body } = require("express-validator");
const persistence = require("./persistence");
const config = require('../config.json')
const {verify, sign} = require("jsonwebtoken");

const verifyLogin = body('login').isLength({ min: 1 }).matches(/^[a-zA-Z0-9_]+$/)
const verifyPassword = body('password').isLength({ min: 8 }).matches(/^[a-zA-Z0-9_!@#$%^&*()]+$/)

const getUserJWT = (username) => sign(
    {username: username},
    config.session.key,
    {expiresIn: '1d'}
);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

    if (token == null) return res.sendStatus(401);

    verify(token, config.session.key, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        console.log(user)
        next();
    });
}

const endpoints = {
    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send('Password too short or invalid characters');
        const { login, password } = req.body;
        try {
            const result = await persistence.login(login, password);
            if (!result) {
                return res.status(401).send('Invalid login or password');
            }
            const token = getUserJWT(login);
            res.cookie('jwt', token, {
                httpOnly: true, // The cookie only accessible by the web server
                secure: true,   // Set to true if using https
                sameSite: 'strict', // Helps mitigate CSRF attacks
                maxAge: 3600000 // 1 hour
            });
            res.send({ token: token, login: login});
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    signup: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send('Password too short or invalid characters');
        // todo check if it's possible that we validate body['login'], body['password'] but other data is smuggled?
        const { login, password } = req.body;
        try {
            const result = await persistence.signUp(login, password);
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    transfer: async (req, res) => {
        console.log('Data received:', req.body); // Log the received data
        res.status(200).json({ message: `Data received ${req.body.cardNumber}` }); // Send JSON response back to client
    },
    reset: async(req, res) => {
        const { login } = req.body
        try {
            const result = await persistence.genRestoreToken(login);
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updatePassword: async(req, res) => {
        const { token, password } = req.body
        try {
            const result = await persistence.updatePassword(token, password);
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    verifyLogin,
    verifyPassword,
}

module.exports = endpoints;