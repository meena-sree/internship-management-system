const Test = require("../models/test.model");
const TestQuestion = require("../models/testQuestion.model");
const TestResult = require("../models/testResult.model");

// ✅ Company creates a test with questions
exports.createTest = async (req, res) => {
  try {
    const { internship_id, title, time_limit, questions } = req.body;

    const test_id = await Test.create(internship_id, title, time_limit);

    for (const q of questions) {
      await TestQuestion.create(test_id, q.question, q.options, q.correct_answer);
    }

    res.status(201).json({ message: "Test created successfully", test_id });
  } catch (err) {
    res.status(500).json({ message: "Error creating test", error: err.message });
  }
};

// ✅ Student fetches test for an internship
exports.getTestByInternship = async (req, res) => {
  try {
    const { internship_id } = req.params;
    const test = await Test.findByInternship(internship_id);
    if (!test) return res.status(404).json({ message: "No test found for this internship" });

    const questions = await TestQuestion.findByTestId(test.test_id);
    res.json({ ...test, questions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching test", error: err.message });
  }
};

// ✅ Student submits answers
exports.submitTest = async (req, res) => {
  try {
    const { test_id, answers } = req.body;
    const student_id = req.user.id;

    const correctAnswers = await TestQuestion.findCorrectAnswers(test_id);
    let score = 0;

    for (let i = 0; i < correctAnswers.length; i++) {
      if (answers[i] === correctAnswers[i].correct_answer) {
        score++;
      }
    }

    await TestResult.save(test_id, student_id, score);
    res.json({ message: "Test submitted", score });
  } catch (err) {
    res.status(500).json({ message: "Error submitting test", error: err.message });
  }
};

// ✅ Get all results for a student
exports.getStudentResults = async (req, res) => {
  try {
    const student_id = req.user.id;
    const results = await TestResult.findByStudent(student_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test results", error: err.message });
  }
};

// ✅ Get all results for a company
exports.getCompanyResults = async (req, res) => {
  try {
    const company_id = req.user.id;
    const results = await TestResult.findByCompany(company_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching test results", error: err.message });
  }
};
