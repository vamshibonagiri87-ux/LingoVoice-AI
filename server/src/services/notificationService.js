const Notification = require('../models/Notification');

class NotificationService {
  async getUserNotifications(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      const err = new Error('Notification not found');
      err.statusCode = 404;
      throw err;
    }
    return notification;
  }

  async createNotification({ userId, type, title, message, link = '' }) {
    return await Notification.create({ userId, type, title, message, link });
  }
}

module.exports = new NotificationService();
