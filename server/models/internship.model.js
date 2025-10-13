const db = require("../config/db.config");

const Internship = {
  create: async (title, description, duration, skills_required, company_id) => {
    const sql = `INSERT INTO Internships (title, description, duration, skills_required, company_id) 
                 VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [title, description, duration, skills_required, company_id]);
    return result;
  },

  findAll: async () => {
    const sql = `SELECT i.*, u.name AS company_name
FROM Internships i
JOIN Users u ON i.company_id = u.user_id
ORDER BY i.posted_at DESC;
`;
    const [rows] = await db.query(sql);
    return rows;
  },

  findById: async (id) => {
    const sql = `SELECT * FROM Internships WHERE internship_id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  update: async (id, title, description, duration, skills_required) => {
    const sql = `UPDATE Internships 
                 SET title = ?, description = ?, duration = ?, skills_required = ? 
                 WHERE internship_id = ?`;
    const [result] = await db.query(sql, [title, description, duration, skills_required, id]);
    return result;
  },

  delete: async (id) => {
    const sql = `DELETE FROM Internships WHERE internship_id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
};

module.exports = Internship;
