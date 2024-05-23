const { getDb } = require("./initdb");
const argon2 = require("argon2"); // Ensure argon2 is installed
const config = require("../../config.json");
const crypto = require("crypto");
const moment = require("moment");

function randomString(length = 128) {
  const buffer = crypto.randomBytes(length);
  return buffer
    .toString("base64")
    .replace(/\+/g, "0")
    .replace(/\//g, "0")
    .slice(0, length);
}

const db = getDb();
// TODO doesn't feel  right,
// better to pass some persistence agent idk.

module.exports = {
  signIn: async (email, password) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT passwordHash, salt FROM users WHERE email = ?",
        [email],
        async (err, row) => {
          if (err) {
            reject("Error on the server.");
            return;
          }
          if (!row) {
            reject("User not found");
            return;
          }
          const match = await argon2.verify(
            row.passwordHash,
            row.salt + password + config.database.pepper,
          );
          if (match) {
            resolve("email successful");
          } else {
            reject("email failed");
          }
        },
      );
    });
  },
  signUp: async (email, password) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT email FROM users WHERE email = ?",
        [email],
        async (err, row) => {
          if (err) {
            reject("Error on the server.");
            return;
          }
          if (row) {
            reject("User already exists");
            return;
          }
          const salt = randomString(128);
          const passwordHash = await argon2.hash(
            salt + password + config.database.pepper,
          );
          db.run(
            "INSERT INTO users (email, passwordHash, salt) VALUES (?, ?, ?)",
            [email, passwordHash, salt],
            (err) => {
              if (err) {
                reject(`Failed to create user: ${err.message}`);
                return;
              }
              resolve("User created");
            },
          );
        },
      );
    });
  },
  genRestoreToken: async (email) => {
    return new Promise((resolve, reject) => {
      const token = randomString(128);
      const validUntil = moment()
        .add(5, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss");
      db.run(
        "INSERT INTO restoreTokens (email, token, validUntil) VALUES (?, ?, ?)",
        [email, token, validUntil],
        (err) => {
          if (err) {
            reject(`Failed to create restore token: ${err.message}`);
            return;
          }
          resolve(token);
        },
      );
    });
  },
  updatePassword: async (token, newPassword) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT email, token, validUntil FROM restoreTokens WHERE token = ?",
        [token],
        async (err, row) => {
          if (err) {
            reject(`Error on the server. ${err.message}`);
            return;
          }
          if (!row) {
            reject("Invalid token");
            return;
          }
          if (moment(row.validUntil).isBefore(moment.now())) {
            reject("Outdated token");
            return;
          }
          const email = row.email;
          const salt = randomString(128);
          const passwordHash = await argon2.hash(
            salt + newPassword + config.database.pepper,
          );
          db.run(
            "UPDATE users SET passwordHash = ?, salt = ? WHERE email = ?",
            [passwordHash, salt, email],
            (err) => {
              if (err) {
                reject(`Failed to update user: ${err.message}`);
                return;
              }
              resolve("User password updated");
            },
          );
        },
      );
    });
  },
};
