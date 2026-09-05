const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const LearningProfile = require('../models/LearningProfile');
const Vocabulary = require('../models/Vocabulary');

const router = express.Router();

router.use(protect);

router.get('/daily-challenge', async (req, res, next) => {
  try {
    const profile = await LearningProfile.findOne({ userId: req.user._id });
    const targetLanguage = profile?.targetLanguage || req.user.targetLanguage || 'Spanish';

    const challenges = {
      Spanish: [
        {
          id: 'dc-es-1',
          title: 'Describe Your Morning Routine',
          prompt: 'Habla durante 60 segundos sobre tu rutina de la mañana: ¿A qué hora te levantas, qué desayunas y cómo te preparas para el día?',
          targetLanguage: 'Spanish',
          difficulty: 'Beginner',
          targetMinutes: 1,
          keyVocabulary: ['despertarse', 'desayunar', 'prepararse', 'café'],
          tip: 'Use reflexive verbs like "me levanto" and "me ducho".'
        },
        {
          id: 'dc-es-2',
          title: 'Explain Your Favorite Film or Series',
          prompt: 'Describe tu película o serie favorita. ¿Quiénes son los personajes principales y por qué te gusta?',
          targetLanguage: 'Spanish',
          difficulty: 'Intermediate',
          targetMinutes: 2,
          keyVocabulary: ['protagonista', 'argumento', 'recomendar', 'emocionante'],
          tip: 'Use descriptive adjectives and opinion phrases like "en mi opinión".'
        }
      ],
      French: [
        {
          id: 'dc-fr-1',
          title: 'Décrivez Votre Journée',
          prompt: 'Parlez pendant 1 minute de votre journée type. Que faites-vous le matin et le soir?',
          targetLanguage: 'French',
          difficulty: 'Beginner',
          targetMinutes: 1,
          keyVocabulary: ['se réveiller', 'manger', 'travailler', 'soir'],
          tip: 'Faites attention à la conjugaison au présent.'
        }
      ],
      English: [
        {
          id: 'dc-en-1',
          title: 'Explain a Recent Challenge You Overcame',
          prompt: 'Speak for 1-2 minutes about a challenging situation you faced recently and how you resolved it.',
          targetLanguage: 'English',
          difficulty: 'Intermediate',
          targetMinutes: 2,
          keyVocabulary: ['challenge', 'overcome', 'solution', 'perseverance'],
          tip: 'Structure your thoughts: Problem -> Action -> Result.'
        }
      ]
    };

    const list = challenges[targetLanguage] || challenges['Spanish'];
    const challenge = list[Math.floor(Math.random() * list.length)];

    res.status(200).json({
      success: true,
      data: challenge
    });
  } catch (err) {
    next(err);
  }
});

router.post('/submit', async (req, res, next) => {
  try {
    const { challengeId, transcript, score } = req.body;
    res.status(200).json({
      success: true,
      message: 'Challenge completed successfully! 🌟',
      data: {
        challengeId,
        score: score || 90,
        feedback: 'Fantastic effort! Your spoken response demonstrates clear communicative flow.'
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/recommendations', async (req, res, next) => {
  try {
    const vocabList = await Vocabulary.find({ userId: req.user._id }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        drills: [
          {
            type: 'pronunciation',
            title: 'Pronunciation Drill: Vowel Clarity',
            description: 'Practice crisp vowel sounds and syllable accents in 5 short phrases.',
            estimatedMinutes: 3
          },
          {
            type: 'scenario',
            title: 'Scenario: Restaurant Ordering',
            description: 'Practice polite ordering forms and requesting the bill with the AI tutor.',
            estimatedMinutes: 5
          }
        ],
        vocabularyToReview: vocabList
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
