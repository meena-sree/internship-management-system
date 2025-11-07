import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import EditInternshipForm from "./EditInternshipForm";

export default function InternshipListings() {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get("/internships");
        setInternships(res.data);
      } catch (err) {
        setMessage(
          err.response?.data?.message || "Error fetching internships"
        );
      }
    };

    const fetchApplications = async () => {
      if (user?.role === "student") {
        try {
          const token = localStorage.getItem("token");
          const res = await api.get("/applications/student", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(res.data);
        } catch (err) {
          console.error("Error fetching applications:", err);
        }
      }
    };

    fetchInternships();
    fetchApplications();
  }, [user]);

  const handleApply = async (internship_id, file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("internship_id", internship_id);
      formData.append("resume", file);

      await api.post("/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting application");
    }
  };

  const getApplicationStatus = (internship_id) => {
    const app = applications.find((a) => a.internship_id === internship_id);
    return app ? app.status : null;
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/internships/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships((prev) =>
        prev.filter((i) => i.internship_id !== id)
      );
    } catch (err) {
      console.error("Error deleting internship:", err);
    }
  };

  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setEditMode(true);
  };

  const handleUpdate = (updatedInternship) => {
    setInternships((prev) =>
      prev.map((i) =>
        i.internship_id === updatedInternship.internship_id
          ? { ...i, ...updatedInternship, posted_at: i.posted_at }
          : i
      )
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Internships</h2>

      {message && <p className="text-center text-red-600 mb-4">{message}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {internships.map((internship) => {
          const status = getApplicationStatus(internship.internship_id);

          return (
            <div
              key={internship.internship_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h3 className="text-xl font-bold text-blue-600">{internship.title}</h3>
              <p className="mt-1 text-sm text-gray-600 italic">
                Company: {internship.company_name}
              </p>
              <p className="mt-2 text-gray-700">{internship.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Duration: {internship.duration}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Skills: {internship.skills_required}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Posted on: {new Date(internship.posted_at).toLocaleDateString()}
              </p>

              {/* Student Apply Logic */}
              {user?.role === "student" && (
                <>
                  {status === null && (
                    <tr key={internship.internship_id}>
                      <td>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="border p-1"
                        />
                        <button
                          onClick={() => handleApply(internship.internship_id, selectedFile)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  )}

                  {status === "rejected" && (
                    <button
                      disabled
                      className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
                    >
                      Rejected
                    </button>
                  )}

                  {["applied", "interview", "offered"].includes(status) && (
                    <button
                      disabled
                      className="mt-4 w-full bg-blue-400 text-white py-2 rounded cursor-not-allowed"
                    >
                      Applied
                    </button>
                  )}
                </>
              )}

              {/* Company Controls */}
              {user?.role === "company" && user.id === internship.company_id && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(internship)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(internship.internship_id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}

              {editMode && selectedInternship && (
                <EditInternshipForm
                  internship={selectedInternship}
                  onClose={() => setEditMode(false)}
                  onUpdated={handleUpdate}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
