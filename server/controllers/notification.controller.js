const Notification = require("../models/notification.model");

// Get all notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notifications = await Notification.findByUser(user_id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
};

// Mark notification as read
exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.markAsRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification", error: err.message });
  }
};
