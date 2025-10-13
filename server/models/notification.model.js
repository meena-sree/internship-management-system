const db = require("../config/db.config");

const Notification = {
  create: async (user_id, message) => {
    const sql = `INSERT INTO Notifications (user_id, message) VALUES (?, ?)`;
    const [result] = await db.query(sql, [user_id, message]);
    return result;
  },

  findByUser: async (user_id) => {
    const sql = `SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [user_id]);
    return rows;
  },

  markAsRead: async (id) => {
    const sql = `UPDATE Notifications SET is_read = TRUE WHERE notification_id = ?`;
    const [result] = await db.query(sql, [id]);
    return result;
  }
};

module.exports = Notification;
