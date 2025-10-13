// server/config/db.config.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Sree@2025',
  database: process.env.DB_NAME || 'internship_db'
});

// Optional test (runs once on startup)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database.");
    connection.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

module.exports = db;
