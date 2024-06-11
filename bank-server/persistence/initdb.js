const sqlite3 = require('sqlite3').verbose();
const config = require('../../config.json');

const initDb = () => {
    const db = getDb();
    // Check if the tables exist and create them if they don't
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, passwordHash TEXT NOT NULL, salt TEXT NOT NULL)');
        db.run('CREATE TABLE IF NOT EXISTS restoreTokens (email TEXT NOT NULL, token TEXT NOT NULL)');
        db.run('CREATE TABLE IF NOT EXISTS transactions (email TEXT NOT NULL, destination TEXT NOT NULL, amount REAL NOT NULL, date DATE NOT NULL)');
        db.run('CREATE TABLE IF NOT EXISTS totpTokens (email TEXT NOT NULL, secret TEXT NOT NULL)');
    });
    return db;
};

const getDb = () => {
    const db = new sqlite3.Database(config.database.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    })
    return db;
}


module.exports = {
    initDb,
    getDb,
};
