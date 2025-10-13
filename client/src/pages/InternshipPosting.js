import { useState } from "react";
import api from "../utils/api";

export default function InternshipPosting() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    skills_required: "",
  });
  const [message, setMessage] = useState("");
  const [addTest, setAddTest] = useState(false);

  // 10 empty questions by default
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, () => ({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 1,
    }))
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = parseInt(value);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // ✅ Step 1: Create internship
      const res = await api.post("/internships", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const internship_id = res.data.internship_id;

      // ✅ Step 2: If test added, create test
      if (addTest) {
        const testData = {
          internship_id,
          title: `${form.title} - Test`,
          time_limit: 15,
          questions: questions.filter((q) => q.question.trim() !== ""),
        };

        await api.post("/tests", testData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMessage("Internship posted successfully!");
      setForm({ title: "", description: "", duration: "", skills_required: "" });
      setAddTest(false);
      setQuestions(
        Array.from({ length: 10 }, () => ({
          question: "",
          options: ["", "", "", ""],
          correct_answer: 1,
        }))
      );
    } catch (err) {
      setMessage(err.response?.data?.message || "Error posting internship");
    }
  };

  return (
    <div className="flex justify-center items-start bg-gray-200 py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Post Internship</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
            required
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 3 months)"
            value={form.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="skills_required"
            placeholder="Skills Required (comma separated)"
            value={form.skills_required}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          {/* ✅ Toggle to attach test */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={addTest}
              onChange={(e) => setAddTest(e.target.checked)}
              className="mr-2"
            />
            <label className="font-semibold">Attach a Test (Optional)</label>
          </div>

          {/* ✅ Conditional Test Section */}
          {addTest && (
            <div className="border-t mt-4 pt-4 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Add up to 10 Questions
              </h3>

              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border p-3 mb-4 rounded bg-gray-50">
                  <label className="block font-semibold mb-1">
                    Question {qIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                    placeholder="Enter question"
                    className="w-full border p-2 mb-2 rounded"
                  />

                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                      className="w-full border p-2 mb-2 rounded"
                    />
                  ))}

                  <select
                    value={q.correct_answer}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value={1}>Correct Answer: Option 1</option>
                    <option value={2}>Correct Answer: Option 2</option>
                    <option value={3}>Correct Answer: Option 3</option>
                    <option value={4}>Correct Answer: Option 4</option>
                  </select>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Post Internship
          </button>
        </form>

        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
