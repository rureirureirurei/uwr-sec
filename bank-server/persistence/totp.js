const { getDb } = require("./initdb");
const argon2 = require("argon2"); // Ensure argon2 is installed
const config = require("../../config.json");
const crypto = require("crypto");
const moment = require("moment");
const speakeasy = require("speakeasy");

const db = getDb();
// TODO doesn't feel right,
// better to pass some persistence agent idk.

module.exports = {
    addToken: async (email, secret) => {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM totpTokens WHERE email = ?",
                [email],
                (err) => {
                    if (err) {
                        reject(`Error on the server when removing existing totp secret for ${email}.`);
                        return;
                    }
                    db.run(
                        "INSERT INTO totpTokens (email, secret) VALUES(?, ?)",
                        [email, secret],
                        (err) => {
                            if (err) {
                                reject(`Error on the server when adding totp secret for ${email}.`);
                                return;
                            }
                            resolve(`Added totp secret for ${email}`);
                        },
                    );
                },
            );
        });
    },
    verifyToken: async (email, code) => {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT secret FROM totpTokens WHERE email = ?",
                [email],
                (err, row) => {
                    if (err) {
                        reject(`Error on the server when verifying totp token for ${email}.`);
                        return;
                    }
                    if (!row) {
                        reject(`No token found for ${email}`);
                        return;
                    }
                    const verified = speakeasy.totp.verify({
                        secret: row.secret,
                        encoding: 'base32',
                        token: code
                    });
                    if (verified) {
                        resolve(`Token verified successfully for ${email}`);
                    } else {
                        reject(`Invalid token for ${email}`);
                    }
                }
            );
        });
    }
};
