const express = require("express");
const router = express.Router();
const { extractEmailFromToken } = require("./validation");
const speakeasy = require("speakeasy");

router.post("/generate", async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ length: 30 });
    console.log(secret);
    res.send(secret.otpauth_url);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/verify", () => {});

module.exports = router;
