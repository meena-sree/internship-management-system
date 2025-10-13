const db = require("../config/db.config");

const Application = {
  create: async (student_id, internship_id, resume) => {
    const sql = `INSERT INTO Applications (student_id, internship_id, resume, status) 
                 VALUES (?, ?, ?, 'applied')`;
    const [result] = await db.query(sql, [student_id, internship_id, resume]);
    return result;
  },

  // check if application already exists
  findExisting: async (student_id, internship_id) => {
    const sql = `SELECT * FROM Applications 
                 WHERE student_id = ? AND internship_id = ? 
                 ORDER BY applied_at DESC LIMIT 1`;
    const [rows] = await db.query(sql, [student_id, internship_id]);
    return rows[0]; // latest application if exists
  },

  findByStudent: async (student_id) => {
    const sql = `
    SELECT 
      a.*, 
      i.title, 
      u.name AS company_name,
      CASE WHEN t.test_id IS NOT NULL THEN 1 ELSE 0 END AS has_test
    FROM Applications a
    JOIN Internships i ON a.internship_id = i.internship_id
    JOIN Users u ON i.company_id = u.user_id
    LEFT JOIN Tests t ON i.internship_id = t.internship_id
    WHERE a.student_id = ?
    ORDER BY a.applied_at DESC
  `;
    const [rows] = await db.query(sql, [student_id]);
    return rows;
  },


  findByCompany: async (company_id) => {
  const sql = `
    SELECT 
      a.application_id,
      a.student_id,
      a.internship_id,
      a.status,
      a.applied_at,
      u.name AS student_name,
      i.title AS internship_title,
      tr.score AS test_score
    FROM Applications a
    JOIN Internships i ON a.internship_id = i.internship_id
    JOIN Users u ON a.student_id = u.user_id
    LEFT JOIN Tests t ON i.internship_id = t.internship_id
    LEFT JOIN TestResults tr ON tr.test_id = t.test_id AND tr.student_id = a.student_id
    WHERE i.company_id = ?
    ORDER BY a.applied_at DESC
  `;
  const [rows] = await db.query(sql, [company_id]);
  return rows;
},


  findById: async (id) => {
    const sql = `SELECT * FROM Applications WHERE application_id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const sql = `UPDATE Applications SET status = ? WHERE application_id = ?`;
    const [result] = await db.query(sql, [status, id]);
    return result;
  }
};

module.exports = Application;
