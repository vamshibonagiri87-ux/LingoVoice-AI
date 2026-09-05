const Scenario = require('../models/Scenario');
const sessionService = require('./sessionService');

const DEFAULT_SCENARIOS = [
  {
    title: 'Airport Check-In & Boarding',
    description: 'Navigate check-in counters, baggage drops, and gate inquiries with airport personnel.',
    category: 'Travel',
    difficulty: 'Beginner',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Airline Check-In Agent', userRole: 'Traveler' },
    objectives: ['Request boarding pass', 'Confirm baggage weight', 'Ask for gate directions'],
    vocabulary: [
      { word: 'tarjeta de embarque', translation: 'boarding pass', context: 'Aquí está mi tarjeta de embarque.' },
      { word: 'equipaje de mano', translation: 'carry-on luggage', context: 'Tengo solo una maleta pequeña.' },
      { word: 'puerta de salida', translation: 'departure gate', context: '¿Cuál es la puerta para este vuelo?' }
    ],
    openingPrompt: 'You are an airline counter agent at Madrid-Barajas Airport. Welcome the passenger warmly and ask for their passport and ticket.',
    initialTutorMessage: '¡Buenos días! Bienvenido al mostrador de Iberia. ¿Me permite su pasaporte y número de reserva, por favor?',
    isDefault: true
  },
  {
    title: 'Hotel Check-In & Requests',
    description: 'Check into your hotel room, ask about breakfast times, WiFi, and request amenities.',
    category: 'Travel',
    difficulty: 'Elementary',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Hotel Receptionist', userRole: 'Guest' },
    objectives: ['Provide reservation name', 'Ask about breakfast hours', 'Request an extra room key'],
    vocabulary: [
      { word: 'habitación', translation: 'room', context: 'Tengo una reserva para una habitación doble.' },
      { word: 'desayuno incluido', translation: 'breakfast included', context: '¿El desayuno está incluido en el precio?' },
      { word: 'clave de wifi', translation: 'wifi password', context: '¿Cuál es la clave de wifi?' }
    ],
    openingPrompt: 'You are the front desk manager at a boutique hotel. Welcome the guest and look up their reservation.',
    initialTutorMessage: '¡Buenas tardes! Bienvenido al Hotel Sol y Mar. ¿Tiene una reservación con nosotros hoy?',
    isDefault: true
  },
  {
    title: 'Authentic Restaurant Ordering',
    description: 'Ask for recommendations, order tapas, clarify dietary preferences, and ask for the bill.',
    category: 'Dining',
    difficulty: 'Beginner',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Waiter / Camareo', userRole: 'Customer' },
    objectives: ['Ask for the daily special', 'Order main course and beverage', 'Politely request the check'],
    vocabulary: [
      { word: 'la cuenta, por favor', translation: 'the check, please', context: '¿Nos trae la cuenta cuando pueda?' },
      { word: 'plato del día', translation: 'dish of the day', context: '¿Cuál es el plato del día recomendado?' },
      { word: 'para llevar', translation: 'to go / takeaway', context: '¿Puedo pedir esto para llevar?' }
    ],
    openingPrompt: 'You are a warm, attentive waiter at a traditional bistro. Greet the customer and hand them the menu.',
    initialTutorMessage: '¡Buenas noches! Bienvenidos a nuestro restaurante. ¿Les gustaría empezar con algo de beber mientras miran la carta?',
    isDefault: true
  },
  {
    title: 'Software Developer Job Interview',
    description: 'Discuss technical experience, problem solving, teamwork, and career ambitions.',
    category: 'Career & Work',
    difficulty: 'Intermediate',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Engineering Hiring Manager', userRole: 'Candidate' },
    objectives: ['Introduce background & projects', 'Explain a technical problem solved', 'Ask question about the company culture'],
    vocabulary: [
      { word: 'desarrollo de software', translation: 'software development', context: 'Tengo 3 años de experiencia en desarrollo web.' },
      { word: 'trabajo en equipo', translation: 'teamwork', context: 'Disfruto mucho el trabajo en equipo y la colaboración.' },
      { word: 'desafío técnico', translation: 'technical challenge', context: 'Fue un gran desafío técnico optimizar la base de datos.' }
    ],
    openingPrompt: 'You are an engineering director interviewing a candidate. Welcome them and ask them to introduce themselves.',
    initialTutorMessage: 'Hola, un gusto saludarte. Gracias por unirte a la entrevista de hoy. Para comenzar, ¿podrías contarnos un poco sobre tu trayectoria y tus proyectos recientes?',
    isDefault: true
  },
  {
    title: 'Doctor Appointment & Health Symptoms',
    description: 'Describe physical symptoms, pain levels, and understand prescription instructions.',
    category: 'Health',
    difficulty: 'Intermediate',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Medical Doctor', userRole: 'Patient' },
    objectives: ['Describe headache or throat symptoms', 'Explain when the symptoms began', 'Understand dosage instructions'],
    vocabulary: [
      { word: 'dolor de cabeza', translation: 'headache', context: 'Tengo un fuerte dolor de cabeza desde ayer.' },
      { word: 'fiebre', translation: 'fever', context: 'He tenido un poco de fiebre por la noche.' },
      { word: 'receta médica', translation: 'medical prescription', context: '¿Necesito una receta médica para este medicamento?' }
    ],
    openingPrompt: 'You are a compassionate doctor at a clinic. Greet the patient and ask what brings them in today.',
    initialTutorMessage: 'Hola, tome asiento por favor. Cuénteme, ¿qué síntomas ha tenido y cómo se siente hoy?',
    isDefault: true
  },
  {
    title: 'College Admissions Interview',
    description: 'Explain your academic interests, motivations, and why you selected this institution.',
    category: 'Education',
    difficulty: 'Upper Intermediate',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Admissions Officer', userRole: 'Prospective Student' },
    objectives: ['Explain academic passions', 'Articulate reasons for university choice', 'Share extracurricular interests'],
    vocabulary: [
      { word: 'carrera universitaria', translation: 'university degree / major', context: 'Quiero estudiar la carrera de lingüística computacional.' },
      { word: 'investigación', translation: 'research', context: 'Me apasiona la investigación científica.' },
      { word: 'beca académica', translation: 'academic scholarship', context: 'He solicitado una beca académica para este semestre.' }
    ],
    openingPrompt: 'You are an admissions dean. Welcome the prospective student warmly.',
    initialTutorMessage: 'Bienvenido a nuestra universidad. Nos alegra mucho tenerte aquí. ¿Qué te motivó a postular a nuestro programa?',
    isDefault: true
  },
  {
    title: 'Meeting New Friends at a Social Gathering',
    description: 'Break the ice, discuss hobbies, favorite music, travel, and make friendly connections.',
    category: 'Social',
    difficulty: 'Beginner',
    targetLanguage: 'Spanish',
    role: { tutorRole: 'Friendly Host / Peer', userRole: 'Guest' },
    objectives: ['Introduce name & where you live', 'Share 2 favorite hobbies', 'Ask the other person about their interests'],
    vocabulary: [
      { word: 'mucho gusto', translation: 'nice to meet you', context: '¡Mucho gusto en conocerte!' },
      { word: 'pasatiempos', translation: 'hobbies', context: 'Uno de mis pasatiempos favoritos es la fotografía.' },
      { word: 'música en vivo', translation: 'live music', context: '¿Te gusta escuchar música en vivo?' }
    ],
    openingPrompt: 'You are a warm, outgoing person at a community event. Smile and strike up a friendly chat.',
    initialTutorMessage: '¡Hola! Qué agradable ver caras nuevas por aquí. Me llamo Carlos, ¿y tú cómo te llamas?',
    isDefault: true
  }
];

class ScenarioService {
  async seedDefaultScenarios() {
    const count = await Scenario.countDocuments();
    if (count === 0) {
      console.log('[Scenarios] Seeding default language learning scenarios...');
      await Scenario.insertMany(DEFAULT_SCENARIOS);
      console.log(`[Scenarios] Seeded ${DEFAULT_SCENARIOS.length} scenarios successfully.`);
    }
  }

  async listScenarios({ category, difficulty, targetLanguage, search } = {}) {
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (targetLanguage) query.targetLanguage = targetLanguage;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    return await Scenario.find(query).sort({ difficulty: 1, title: 1 });
  }

  async getScenarioById(id) {
    const scenario = await Scenario.findById(id);
    if (!scenario) {
      const err = new Error('Scenario not found');
      err.statusCode = 404;
      throw err;
    }
    return scenario;
  }

  async createScenario(scenarioData) {
    return await Scenario.create(scenarioData);
  }

  async startScenarioSession(scenarioId, userId) {
    const scenario = await this.getScenarioById(scenarioId);
    return await sessionService.createSession(userId, {
      mode: 'scenario',
      scenarioId: scenario._id,
      targetLanguage: scenario.targetLanguage
    });
  }
}

module.exports = new ScenarioService();
