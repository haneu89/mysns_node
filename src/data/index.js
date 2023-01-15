require('dotenv').config();
const mysql = require('mysql2');

exports.connection = mysql.createPool(
  {
    host:process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

exports.query = (queryString, params) => {
  return new Promise((resolve, reject) => {
    this.connection.query(queryString, params, (err, rows, fields) => {
      (err) ? reject(err) : resolve(rows);
    });
  })
}
