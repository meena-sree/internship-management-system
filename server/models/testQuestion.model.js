const db = require("../config/db.config");

const TestQuestion = {
  create: async (test_id, question, options, correct_answer) => {
    const sql = `
      INSERT INTO TestQuestions (test_id, question, option1, option2, option3, option4, correct_answer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      test_id,
      question,
      options[0],
      options[1],
      options[2],
      options[3],
      correct_answer
    ]);
    return result;
  },

  findByTestId: async (test_id) => {
    const sql = `SELECT question_id, question, option1, option2, option3, option4 FROM TestQuestions WHERE test_id = ?`;
    const [rows] = await db.query(sql, [test_id]);
    return rows;
  },

  findCorrectAnswers: async (test_id) => {
    const sql = `SELECT question_id, correct_answer FROM TestQuestions WHERE test_id = ?`;
    const [rows] = await db.query(sql, [test_id]);
    return rows;
  }
};

module.exports = TestQuestion;
