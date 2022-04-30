const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node_mysql',
    password: 'ows@1234'
});

module.exports = pool.promise();