const db = require("../config/db.config");

const TestResult = {
  save: async (test_id, student_id, score) => {
    // ✅ Step 1: Check if a record already exists
    const checkSql = `
      SELECT * FROM TestResults
      WHERE test_id = ? AND student_id = ?
    `;
    const [existing] = await db.query(checkSql, [test_id, student_id]);

    if (existing.length > 0) {
      // ✅ Already attempted → don't overwrite
      return { alreadyAttempted: true };
    }

    // ✅ Step 2: Insert new test result
    const sql = `
      INSERT INTO TestResults (test_id, student_id, score)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [test_id, student_id, score]);
    return { alreadyAttempted: false, result };
  },

  findByStudent: async (student_id) => {
    const sql = `
  SELECT tr.*, t.internship_id, i.title AS internship_title
  FROM TestResults tr
  JOIN Tests t ON tr.test_id = t.test_id
  JOIN Internships i ON t.internship_id = i.internship_id
  WHERE tr.student_id = ?
  ORDER BY tr.submitted_at DESC
`;

    const [rows] = await db.query(sql, [student_id]);
    return rows;
  },

  findByCompany: async (company_id) => {
    const sql = `
      SELECT tr.*, u.name AS student_name, i.title AS internship_title
      FROM TestResults tr
      JOIN Tests t ON tr.test_id = t.test_id
      JOIN Internships i ON t.internship_id = i.internship_id
      JOIN Users u ON tr.student_id = u.user_id
      WHERE i.company_id = ?
      ORDER BY tr.submitted_at DESC
    `;
    const [rows] = await db.query(sql, [company_id]);
    return rows;
  }
};

module.exports = TestResult;
