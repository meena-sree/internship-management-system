import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function TakeTest() {
  const { internship_id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/tests/${internship_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(res.data);
      } catch (err) {
        setMessage("No test found or already attempted.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [internship_id]);

  const handleAnswer = (question_id, optionNumber) => {
    setAnswers({ ...answers, [question_id]: optionNumber });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const sortedAnswers = Object.values(answers).map((a) => parseInt(a));

    const res = await api.post(
      "/tests/submit",
      {
        test_id: test.test_id,
        answers: sortedAnswers,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setScore(res.data.score);
    setMessage("Test submitted successfully!");

    // ✅ Trigger dashboard refresh immediately
    window.localStorage.setItem("testCompleted", Date.now().toString());

    // ✅ Redirect instantly to dashboard
    navigate("/student-dashboard");
  } catch (err) {
    if (err.response?.status === 400) {
      alert("You have already attempted this test.");
      navigate("/student-dashboard");
    } else {
      setMessage("Error submitting test.");
    }
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading test...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">{message || "No test found."}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {test.title || "Internship Test"}
        </h2>
        <form onSubmit={handleSubmit}>
          {test.questions.map((q, qIndex) => (
            <div key={q.question_id} className="mb-6">
              <p className="font-semibold mb-2">
                {qIndex + 1}. {q.question}
              </p>
              <div className="space-y-1">
                {[q.option1, q.option2, q.option3, q.option4].map(
                  (opt, optIndex) => (
                    <label
                      key={optIndex}
                      className="block border rounded px-3 py-1 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question_${q.question_id}`}
                        value={optIndex + 1}
                        onChange={() =>
                          handleAnswer(q.question_id, optIndex + 1)
                        }
                        className="mr-2"
                        required
                      />
                      {opt}
                    </label>
                  )
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit Test
          </button>
        </form>
      </div>
    </div>
  );
}
