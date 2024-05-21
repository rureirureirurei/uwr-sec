const { validationResult, body } = require("express-validator");
const persistence = require("./persistence");
const config = require('../config.json')
const {verify, sign} = require("jsonwebtoken");

const verifyEmail = body('email').isLength({ min: 1 }).matches(/^[a-zA-Z0-9_]+$/)
const verifyPassword = body('password').isLength({ min: 8 }).matches(/^[a-zA-Z0-9_!@#$%^&*()]+$/)

const getUserJWT = (email) => sign(
    {email: email},
    config.session.key,
    {expiresIn: '1d'}
);

const extractEmailFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Token missing');
    }

    try {
        const decoded = verify(token, config.session.key);
        return decoded.email; // Assuming the JWT contains a email field
    } catch (error) {

        throw new Error('Invalid token');
    }
};

const endpoints = {
    // ----------------------------------- security ----------------------------------------------------
    authenticateToken: async (req, res, next) =>  {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

        if (token == null) return res.sendStatus(401);

        verify(token, config.session.key, (err, user) => {
            if (err) return res.sendStatus(403); // Invalid token
            req.user = user;
            next();
        });
    },

    signIn: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send('Password too short or invalid characters');
        const { email, password } = req.body;
        try {
            const result = await persistence.signIn(email, password);
            if (!result) {
                return res.status(401).send('Invalid email or password');
            }
            const token = getUserJWT(email);
            res.cookie('jwt', token, {
                httpOnly: true, // The cookie only accessible by the web server
                secure: true,   // Set to true if using https
                sameSite: 'strict', // Helps mitigate CSRF attacks
                maxAge: 3600000 // 1 hour
            });
            res.send({ token: token, email: email});
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    signup: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).send('Password too short or invalid characters');
        // todo check if it's possible that we validate body['email'], body['password'] but other data is smuggled?
        const { email, password } = req.body;
        try {
            const result = await persistence.signUp(email, password);
            res.send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    reset: async(req, res) => {
        const { email } = req.body
        try {
            const result = await persistence.genRestoreToken(email);
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
    // ---------------------------------- transfer and transactions -------------------------------------

    transfer: async (req, res) => {
        try {
            const email = extractEmailFromToken(req); // Extract email from JWT
            const { destination, amount } = req.body;
            console.log(email, destination, amount);
            const result = await persistence.transfer(email, destination, amount);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    transactions: async (req, res) => {
        try {
            const email = extractEmailFromToken(req); // Extract email from JWT
            const result = await persistence.transactions(email);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // -----------------------------------------generic validators ---------------------------------------------
    verifyEmail,
    verifyPassword,

}

module.exports = endpoints;