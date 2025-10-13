import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/notifications/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: 1 } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">🔔 Notifications</h1>
      <p className="mt-2 text-gray-700">Here are your latest updates.</p>

      <ul className="mt-6 space-y-2">
        {notifications.map((n) => (
          <li
            key={n.notification_id}
            className={`p-3 rounded shadow ${
              n.is_read ? "bg-gray-100" : "bg-yellow-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{n.message}</span>
              {!n.is_read && (
                <button
                  onClick={() => markAsRead(n.notification_id)}
                  className="ml-4 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Mark as Read
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </li>
        ))}
        {notifications.length === 0 && (
          <p className="text-gray-500">No notifications yet.</p>
        )}
      </ul>
    </div>
  );
}
