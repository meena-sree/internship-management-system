import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Fetch applications (with has_test)
      const res = await api.get("/applications/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);

      // ✅ Fetch student's test results
      const resultRes = await api.get("/tests/results/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestResults(resultRes.data);
    } catch (err) {
      console.error("Error fetching applications or test results:", err);
    }
  };

  // ✅ Fetch once + also re-fetch when redirected from TakeTest
  useEffect(() => {
    fetchApplications(); // fetch when page loads

    // ✅ Re-fetch immediately when student completes a test
    const handleStorageChange = (e) => {
      if (e.key === "testCompleted") {
        fetchApplications(); // fetch fresh data
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // ✅ Also handle direct navigation from TakeTest
    if (window.performance?.navigation?.type === 1 || location.pathname === "/student-dashboard") {
      fetchApplications();
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location]);


  const handleTakeTest = (internship_id) => {
    navigate(`/take-test/${internship_id}`);
  };

  const getTestStatus = (internship_id) => {
    const result = testResults.find((r) => r.internship_id === internship_id);
    return result ? `${result.score}/10` : null;
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-semibold">My Applications</h2>

      <table className="mt-4 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Internship</th>
            <th className="border border-gray-300 p-2">Company</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Test</th>
            <th className="border border-gray-300 p-2">Applied On</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => {
            const testStatus = getTestStatus(app.internship_id);
            const showTakeTest =
              app.has_test && !testStatus && app.status !== "rejected";

            return (
              <tr key={app.application_id}>
                <td className="border border-gray-300 p-2">{app.title}</td>
                <td className="border border-gray-300 p-2">
                  {app.company_name}
                </td>

                <td
                  className={`border border-gray-300 p-2 font-semibold
                    ${app.status === "applied" && "text-blue-600"}
                    ${app.status === "interview" && "text-yellow-600"}
                    ${app.status === "rejected" && "text-red-600"}
                    ${app.status === "offered" && "text-green-600"}
                  `}
                >
                  {app.status}
                </td>

                {/* ✅ Test Column */}
                <td className="border border-gray-300 p-2 text-center">
                  {app.has_test ? (
                    testStatus ? (
                      <span className="font-semibold text-green-600">
                        {testStatus}
                      </span>
                    ) : showTakeTest ? (
                      <button
                        onClick={() => handleTakeTest(app.internship_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Take Test
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </td>

                <td className="border border-gray-300 p-2">
                  {new Date(app.applied_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}

          {applications.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No applications yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
