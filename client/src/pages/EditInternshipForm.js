import { useState } from "react";
import api from "../utils/api";

export default function EditInternshipForm({ internship, onClose, onUpdated }) {
  const [form, setForm] = useState({
    internship_id: internship.internship_id,
    title: internship.title,
    description: internship.description,
    duration: internship.duration,
    skills_required: internship.skills_required,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/internships/${form.internship_id}`,
        {
          title: form.title,
          description: form.description,
          duration: form.duration,
          skills_required: form.skills_required,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated(form); //  notify parent
      onClose();       //  close modal
    } catch (err) {
      console.error("Error updating internship:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Internship</h2>
        <form onSubmit={handleUpdate} className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Description"
            required
          />
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Duration"
            required
          />
          <input
            type="text"
            name="skills_required"
            value={form.skills_required}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Skills Required"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
