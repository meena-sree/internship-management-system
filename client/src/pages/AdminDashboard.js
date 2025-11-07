import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminDashboard() {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/internships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships(res.data);
    } catch (err) {
      console.error("Error fetching internships", err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/internships/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInternships(); // refresh after update
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Internship Approvals</h2>

      {internships.length === 0 ? (
        <p className="text-center text-gray-600">No internships found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Company</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Duration</th>
              <th className="border border-gray-300 p-2">Skills</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((i) => (
              <tr key={i.internship_id}>
                <td className="border border-gray-300 p-2">{i.title}</td>
                <td className="border border-gray-300 p-2">{i.company_name}</td>
                <td className="border border-gray-300 p-2">{i.company_email}</td>
                <td className="border border-gray-300 p-2">{i.duration}</td>
                <td className="border border-gray-300 p-2">{i.skills_required}</td>
                <td
                  className={`border border-gray-300 p-2 font-semibold text-center ${
                    i.is_approved === "approved"
                      ? "text-green-600"
                      : i.is_approved === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {i.is_approved.charAt(0).toUpperCase() + i.is_approved.slice(1)}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  {i.is_approved === "pending" ? (
                    <>
                      <button
                        onClick={() => handleStatus(i.internship_id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(i.internship_id, "rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
