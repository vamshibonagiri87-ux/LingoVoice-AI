const voiceService = require('../services/voiceService');

const transcribe = async (req, res, next) => {
  try {
    const { audioData, language, text } = req.body;
    const result = await voiceService.transcribeAudio(audioData, { language, text });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const synthesize = async (req, res, next) => {
  try {
    const { text, language, speed, pitch } = req.body;
    const result = await voiceService.synthesizeSpeech(text, { language, speed, pitch });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const analyze = async (req, res, next) => {
  try {
    const { recognizedText, targetText, language } = req.body;
    const result = await voiceService.analyzeSpeech(recognizedText, targetText, language);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const status = voiceService.getVoiceHealth();
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { transcribe, synthesize, analyze, getStatus };
