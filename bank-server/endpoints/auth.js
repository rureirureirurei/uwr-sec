const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const persistence = require("../persistence/persistence");
const { validateEmail, validatePassword, getUserJWT } = require("./validation");

router.post("/signin", validateEmail, validatePassword, async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  console.log(email, password);
  if (!errors.isEmpty())
    return res.status(400).send("Password too short or invalid characters");
  try {
    const result = await persistence.auth.signIn(email, password);
    if (!result) {
      return res.status(401).send("Invalid email or password");
    }
    const token = getUserJWT(email);
    res.cookie("jwt", token, {
      httpOnly: true, // The cookie only accessible by the web server
      secure: true, // Set to true if using https
      sameSite: "strict", // Helps mitigate CSRF attacks
      maxAge: 3600000, // 1 hour
    });
    res.send({ token: token, email: email });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/signup", validateEmail, validatePassword, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).send("Password too short or invalid characters");
  // todo check if it's possible that we validate body['email'], body['password'] but other data is smuggled?
  const { email, password } = req.body;
  try {
    const result = await persistence.auth.signUp(email, password);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/reset/token", validateEmail, async (req, res) => {
  const { email } = req.body;
  try {
    const result = await persistence.auth.genRestoreToken(email);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/reset/password", async (req, res) => {
  const { token, password } = req.body;
  try {
    const result = await persistence.auth.updatePassword(token, password);
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
