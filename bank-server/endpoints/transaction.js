const express = require('express');
const router = express.Router();
const persistence = require("../persistence/persistence");
const { extractEmailFromToken} = require('./validation');
router.post(
    '/list',
    async (req, res) => {
        try {
            const email = extractEmailFromToken(req); // Extract email from JWT
            const result = await persistence.transaction.list(email);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
)
router.post(
    '/transfer',
    async (req, res) => {
        try {
            const email = extractEmailFromToken(req); // Extract email from JWT
            const { destination, amount } = req.body;
            console.log(email, destination, amount);
            const result = await persistence.transaction.transfer(email, destination, amount);
            res.send(result);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
)

module.exports = router;