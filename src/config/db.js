const mysql = require("mysql2");
const dotenv = require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test Connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to main database:", err.message);
  } else {
    console.log("Connected to main database");
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = pool;
