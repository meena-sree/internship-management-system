const db = require("../config/db.config");

const Test = {
  create: async (internship_id, title, time_limit) => {
    const sql = `INSERT INTO Tests (internship_id, title, time_limit) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [internship_id, title, time_limit]);
    return result.insertId;
  },

  findByInternship: async (internship_id) => {
    const sql = `SELECT * FROM Tests WHERE internship_id = ?`;
    const [rows] = await db.query(sql, [internship_id]);
    return rows[0];
  }
};

module.exports = Test;
