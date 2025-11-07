import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [role, setRole] = useState("student"); // default tab
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      // Allow admin to log in regardless of selected tab
      if (res.data.user.role !== role && res.data.user.role !== "admin") {
        setMessage(`This account is registered as ${res.data.user.role}, not ${role}.`);
        return;
      }

      dispatch(loginSuccess(res.data)); // update Redux store
      setMessage("Login successful!");

      // Redirect based on role
      if (res.data.user.role === "student") {
        navigate("/student-dashboard");
      } else if (res.data.user.role === "company") {
        navigate("/company-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 bg-white">
      {/* Tagline Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">IMS</h1>
        <p className="text-lg text-gray-600">Where Talent Meets Opportunity</p>
      </div>

      {/* Login Box */}
      <div className="bg-gray-300 shadow-lg rounded-lg w-96">
        {/* Tabs */}
        <div className="flex">
          <button
            className={`w-1/2 py-2 font-bold ${role === "student" ? "bg-gray-300" : "bg-gray-100"
              }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`w-1/2 py-2 font-bold ${role === "company" ? "bg-gray-300" : "bg-gray-100"
              }`}
            onClick={() => setRole("company")}
          >
            Company
          </button>
        </div>

        {/* Admin tab — styled separately and centered */}
        <div className="text-center py-2 border-t border-gray-200 bg-gray-100">
          <button
            className={`font-bold text-sm px-4 py-1 rounded ${role === "admin"
              ? "bg-gray-300 text-black"
              : "text-gray-700 hover:text-black"
              }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Login
          </button>

          {message && <p className="text-center mt-2">{message}</p>}

          {role !== "admin" && (
            <div className="text-center mt-4">
              Don’t have an account?{" "}
              {role === "student" ? (
                <Link to="/student-register" className="text-blue-600 hover:underline">
                  Register as Student
                </Link>
              ) : (
                <Link to="/company-register" className="text-blue-600 hover:underline">
                  Register as Company
                </Link>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
