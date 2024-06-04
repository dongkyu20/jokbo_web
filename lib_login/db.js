var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '비밀번호',
    database: 'jokbo_db'
});
db.connect();

module.exports = db;