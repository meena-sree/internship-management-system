const db = require('../config/db.config');

const User = {
  create: async (name, email, password, role) => {
    const sql = `INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, email, password, role]);
    return result;
  },

  findByEmail: async (email) => {
    const sql = `SELECT * FROM Users WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows;
  }
};

module.exports = User;
