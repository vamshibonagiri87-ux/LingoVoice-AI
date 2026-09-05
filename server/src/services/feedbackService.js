const Feedback = require('../models/Feedback');

class FeedbackService {
  async getSessionFeedback(sessionId, userId) {
    return await Feedback.findOne({ sessionId, userId });
  }

  async createOrUpdateFeedback(feedbackData) {
    return await Feedback.findOneAndUpdate(
      { sessionId: feedbackData.sessionId, userId: feedbackData.userId },
      feedbackData,
      { upsert: true, new: true }
    );
  }
}

module.exports = new FeedbackService();
