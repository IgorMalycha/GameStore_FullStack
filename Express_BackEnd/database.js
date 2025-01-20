const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'TINProject',
    port: 3306,
    database: 'my_database',
    connectionLimit: 20,
    queueLimit: 0
});

const promiseDb = db.promise();

db.connect((err) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych: ', err);
    } else {
        console.log('Połączono z bazą danych MySQL');
    }
});

module.exports = promiseDb;