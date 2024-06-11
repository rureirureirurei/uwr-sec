const express = require("express");
const router = express.Router();
const { extractEmailFromToken } = require("./validation");
const persistence = require("../persistence/persistence");

router.post("/generate", async (req, res) => {
  const speakeasy = require("speakeasy");
  try {
    const secret = speakeasy.generateSecret({ length: 30, name: "Denys Bank" });
    const email = extractEmailFromToken(req);
    await persistence.totp.addToken(email, secret.base32);
    res.send({ url: secret.otpauth_url, secret: secret.base32 });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/verify", async (req, res) => {
  try {
    const code = req.body.code;
    const email = extractEmailFromToken(req);
    console.log(code, email);
    const verifyRes = await persistence.totp.verifyToken(email, code);
    console.log(verifyRes);
    res.send(verifyRes);
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
