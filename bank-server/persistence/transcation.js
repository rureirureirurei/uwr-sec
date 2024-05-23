const moment = require("moment/moment");
const {getDb} = require('./initdb')

const db = getDb();
// TODO doesnt feel  right,
// better to pass some persistence agent idk.

module.exports = {
    list: async (email) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT destination, amount, date FROM transactions WHERE email = ?", [email], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                resolve(rows);
            });
        });
    },
    transfer: async (email, destination, amount) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO transactions (email, destination, amount, date) VALUES (?, ?, ?, ?)';
            const date = moment().format('YYYY-MM-DDTHH:mm:ss');

            db.run(query, [email, destination, amount, date], function (err) {
                if (err) {
                    reject(`Error on the server. ${err.message}`);
                    return;
                }
                resolve({message: 'Transfer successful', id: this.lastID});
            });
        });
    }
}