const {body} = require("express-validator");
const {sign, verify} = require("jsonwebtoken");
const config = require("../../config.json");


exports.validateEmail = body('email').isLength({ min: 1 })//.matches(/^[a-zA-Z0-9_@/.]+$/)
exports.validatePassword = body('password').isLength({ min: 4 })//.matches(/^[a-zA-Z0-9_!@/.#$%^&*()]+$/)

exports.getUserJWT = (email) => sign(
    {email: email},
    config.session.key,
    {expiresIn: '1d'}
);

exports.extractEmailFromToken = (req) => {
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

exports.authenticateToken = async (req, res, next) =>  {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

    if (token == null) return res.sendStatus(401);

    verify(token, config.session.key, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user;
        next();
    });
}
