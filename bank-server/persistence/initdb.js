const sqlite3 = require('sqlite3').verbose();
const config = require('../../config.json');

const initDb = () => {
    const db = getDb();
    // Check if the tables exist and create them if they don't
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS users (login TEXT PRIMARY KEY, passwordHash TEXT NOT NULL, salt TEXT NOT NULL)');
        db.run('CREATE TABLE IF NOT EXISTS restoreTokens (login TEXT NOT NULL, token TEXT NOT NULL)');
        db.run('CREATE TABLE IF NOT EXISTS transactions (login TEXT NOT NULL, destination TEXT NOT NULL, amount REAL NOT NULL, date DATE NOT NULL)');
    });
    return db;
};

const getDb = () => {
    db = new sqlite3.Database(config.database.file, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Connected to the SQLite database at ${config.database.file}.`);
    })
    return db;
}


module.exports = {
    initDb,
    getDb,
};
