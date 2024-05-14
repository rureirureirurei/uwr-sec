const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2'); // Ensure argon2 is installed
const config = require('../config.json');
const crypto = require("crypto");

// INIT DB
let db = null;
const init = () => {
    db = new sqlite3.Database(config.database.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) return console.error(err.message);
        console.log(`Connected to the SQLite database at ${config.database.file}.`);
    });

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
        if (err) return console.error(err.message);
        if (!row) {
            db.run('CREATE TABLE users (login TEXT PRIMARY KEY, passwordHash TEXT NOT NULL, salt TEXT NOT NULL)', (err) => {
                if (err) return console.error(err.message);
                console.log('User table created');
            });
        } else console.log('User table already exists');
    });

    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='restoreTokens'", (err, row) => {
        if (err) return console.error(err.message);
        if (!row) {
            db.run('CREATE TABLE restoreTokens (login TEXT NOT NULL, token TEXT NOT NULL)', (err) => {
                if (err) return console.error(err.message);
                console.log('Restore Tokens table created');
            });
        } else console.log('Restore Tokens table already exists');
    });
}
init();

function randomString(length = 128) {
    const buffer = crypto.randomBytes(length);
    const randomString = buffer.toString('base64').replace(/\+/g, '0').replace(/\//g, '0').slice(0, length);
    return randomString;
}

const persistence = {

    login: async (login, password) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT passwordHash, salt FROM users WHERE login = ?", [login], async (err, row) => {
                if (err) {
                    reject('Error on the server.');
                    return;
                }
                if (!row) {
                    reject('User not found');
                    return;
                }
                const match = await argon2.verify(row.passwordHash, row.salt + password + config.database.pepper);
                if (match) {
                    resolve('Login successful');
                } else {
                    reject('Login failed');
                }
            });
        });
    },

    signUp: async (login, password) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT login FROM users WHERE login = ?", [login], async (err, row) => {
                if (err) {
                    reject('Error on the server.');
                    return;
                }
                if (row) {
                    reject('User already exists');
                    return;
                }
                const salt = randomString(128);
                const passwordHash = await argon2.hash(salt + password + config.database.pepper);
                db.run('INSERT INTO users (login, passwordHash, salt) VALUES (?, ?, ?)', [login, passwordHash, salt], (err) => {
                    if (err) {
                        reject(`Failed to create user: ${err.message}`);
                        return;
                    }
                    resolve('User created');
                });
            });
        });
    },

    genRestoreToken: async (login) => {
        return new Promise((resolve, reject) => {
            const token = randomString(128);
            db.run('INSERT INTO restoreTokens (login, token) VALUES (?, ?)', [login, token], (err) => {
                if (err) {
                    console.log(`ERR: ${err.message}`)
                    reject(`Failed to create restore token: ${err.message}`);
                    return;
                }
                resolve(token);
            })
        })
    },

    updatePassword: async (token, newPassword) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT login, token FROM restoreTokens WHERE token = ?", [token], async (err, row) => {
                if (err) {
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                if (!row) {
                    reject('Invalid token');
                    return;
                }
                const login = row.login
                const salt = randomString(128);
                const passwordHash = await argon2.hash(salt + newPassword + config.database.pepper);
                db.run('UPDATE users SET passwordHash = ?, salt = ? WHERE login = ?', [passwordHash, salt, login], (err) => {
                    if (err) {
                        reject(`Failed to update user: ${err.message}`);
                        return;
                    }
                    resolve('User password updated');
                });
            });
        });
    }
};

module.exports = persistence;
