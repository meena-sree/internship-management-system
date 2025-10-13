import { useEffect, useState } from "react";
import api from "../utils/api";

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/applications/company", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI immediately
      setApplications((prev) =>
        prev.map((a) =>
          a.application_id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // ✅ Helper to color code test scores
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return "text-gray-500";
    if (score < 5) return "text-red-600 font-semibold";
    if (score < 8) return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-semibold">
        Applications for My Internships
      </h2>

      <table className="mt-4 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Internship</th>
            <th className="border border-gray-300 p-2">Student</th>
            <th className="border border-gray-300 p-2">Resume</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Test Score</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app.application_id}>
              <td className="border border-gray-300 p-2">
                {app.internship_title}
              </td>
              <td className="border border-gray-300 p-2">
                {app.student_name}
              </td>

              <td className="border border-gray-300 p-2">
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              </td>

              <td className="border border-gray-300 p-2">
                {app.status === "applied" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(app.application_id, "interview")
                      }
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(app.application_id, "rejected")
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {app.status === "interview" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(app.application_id, "offered")
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Offer
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(app.application_id, "rejected")
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {["offered", "rejected"].includes(app.status) && (
                  <span className="font-semibold">{app.status}</span>
                )}
              </td>

              {/* ✅ New Test Score column */}
              <td className="border border-gray-300 p-2 text-center">
                {app.test_score !== null && app.test_score !== undefined ? (
                  <span className={getScoreColor(app.test_score)}>
                    {app.test_score}/10
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
            </tr>
          ))}

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
