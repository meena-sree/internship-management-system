import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import api from '../utils/api'
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.role === "student" || user?.role === "company") {
        try {
          const token = localStorage.getItem("token");
          const res = await api.get("/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const unread = res.data.filter((n) => n.is_read === 0).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold">
        IMS
      </Link>

      <div className="space-x-6">
        {/* Logged out view */}
        {!user && (
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}

        {/* Logged in: Student */}
        {user?.role === "student" && (
          <>
            <Link to="/student-dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
            <Link to="/internships" className="hover:text-blue-300">
              Internships
            </Link>
            <Link to="/notifications" className="relative hover:text-blue-300">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/offers" className="hover:text-blue-300">
              Offers
            </Link>
          </>
        )}

        {/* Logged in: Company */}
        {user?.role === "company" && (
          <>
            <Link to="/company-dashboard" className="hover:text-green-300">
              Dashboard
            </Link>
            <Link to="/internship-posting" className="hover:text-green-300">
              Post Internship
            </Link>
            <Link to="/internships" className="hover:text-green-300">
              Internships
            </Link>
            <Link to="/notifications" className="relative hover:text-blue-300">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                  {unreadCount}
                </span>
              )}
            </Link>
          </>
        )}
        
        {user?.role === "admin" && (
          <Link to="/admin-dashboard" className="hover:text-yellow-300">
            Admin Dashboard
          </Link>
        )}

        {/* Logout button (only when logged in) */}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
