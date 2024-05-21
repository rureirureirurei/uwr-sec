const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2'); // Ensure argon2 is installed
const config = require('../config.json');
const crypto = require("crypto");
const moment = require("moment");

// INIT DB
let db = null;

const createTableIfNotExists = (tableName, createStatement) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`, (err, row) => {
        if (err) return console.error(err.message);
        if (!row) {
            db.run(createStatement, (err) => {
                if (err) return console.error(err.message);
                console.log(`${tableName} table created`);
            });
        } else {
            console.log(`${tableName} table already exists`);
        }
    });
};

const init = () => {
    db = new sqlite3.Database(config.database.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) return console.error(err.message);
        console.log(`Connected to the SQLite database at ${config.database.file}.`);
    });

    createTableIfNotExists('users', 'CREATE TABLE users (login TEXT PRIMARY KEY, passwordHash TEXT NOT NULL, salt TEXT NOT NULL)');
    createTableIfNotExists('restoreTokens', 'CREATE TABLE restoreTokens (login TEXT NOT NULL, token TEXT NOT NULL, validUntil DATE NOT NULL)');
    createTableIfNotExists('transactions', 'CREATE TABLE transactions (login TEXT NOT NULL, destination TEXT NOT NULL, amount MONEY, date DATE NOT NULL)');
};

// Call the init function to initialize the database
init();
function randomString(length = 128) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('base64').replace(/\+/g, '0').replace(/\//g, '0').slice(0, length);
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
            const validUntil = moment().add(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss');;
            db.run('INSERT INTO restoreTokens (login, token, validUntil) VALUES (?, ?, ?)', [login, token, validUntil], (err) => {
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
            db.get("SELECT login, token, validUntil FROM restoreTokens WHERE token = ?", [token], async (err, row) => {
                if (err) {
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                if (!row) {
                    reject('Invalid token');
                    return;
                }
                console.log(row)
                if (moment(row.validUntil).isBefore(moment.now())) {
                    reject('Outdated token');
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
    },

    transactions: async(login) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT destination, amount, date FROM transactions WHERE login = ?", [login], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                resolve(rows);
            });
        });
    },

    transfer: async(login, destination, amount) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO transactions (login, destination, amount, date) VALUES (?, ?, ?, ?)';
            const date = moment().format('YYYY-MM-DDTHH:mm:ss');

            db.run(query, [login, destination, amount, date], function(err) {
                if (err) {
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                resolve({ message: 'Transfer successful', id: this.lastID });
            });
        });
    }
};

module.exports = persistence;
