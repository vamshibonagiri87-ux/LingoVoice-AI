const conversationService = require('../services/conversationService');

const postMessage = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const transcript = req.body.transcript || req.body.text || req.body.message || '';
    const audioReference = req.body.audioReference;

    if (!transcript.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Spoken transcript text is required'
      });
    }

    const result = await conversationService.processMessage(sessionId, req.user._id, {
      transcript: transcript.trim(),
      audioReference
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await conversationService.getConversationHistory(sessionId, req.user._id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { postMessage, getConversation };
