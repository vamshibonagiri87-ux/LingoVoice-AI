# 🎙️ LingoVoice AI — Interactive AI Voice Language Tutor

> Transform language learning from passive memorization into an interactive **Speak → Analyze → Correct → Practice → Improve** voice learning loop.

**LingoVoice AI** is a full-stack AI voice language tutor platform built with Next.js, Express, MongoDB (with automated zero-dependency in-memory fallback), Socket.IO, and a multi-agent AI tutor orchestration engine (OpenRouter, Google Gemini, and Deterministic Fallback).

---

## ✨ Key Features

- 🗣️ **Real-Time Voice Conversations**: Spoken dialogue with an adaptive AI tutor using the browser's native Web Speech API and backend audio pipelines.
- 🧠 **Multi-Agent Pedagogical Engine**:
  - **Conversation Agent**: Context-aware native dialogue generation adapted to CEFR proficiency levels (A1 to C1).
  - **Pronunciation Agent**: Syllable emphasis, phonetic tips, and clarity scoring without claiming unsupported sensor precision.
  - **Grammar Agent**: Real-time sentence structure corrections with encouraging rule explanations preserving learner intent.
  - **Vocabulary Agent**: Contextual synonym suggestions and active vocabulary tracking.
  - **Progress Agent**: End-of-session pedagogical synthesis, score progression, and recurring mistake clustering.
- 🎭 **5 Tailored Learning Modes**:
  1. **Free Conversation**: Open-ended spoken dialogue on hobbies, travel, tech, and daily life.
  2. **Scenario Roleplay**: Real-world situations (Airport check-in, Hotel requests, Restaurant ordering, Medical clinics, Social meetups).
  3. **Interview Preparation**: Career software engineering and university admissions simulation.
  4. **Pronunciation Studio**: Focused phonetic repetition drills with instant audio playback and accuracy scoring.
  5. **Daily Speaking Challenges**: 60-to-120 second quick prompts to build consistent daily speaking streaks.
- 📊 **Learner Dashboard & Analytics**: Streak tracking, skill progress radar, practice duration counters, and saved vocabulary flashcards.
- ⚡ **Zero-Config Local Development**: Automatically boots an embedded in-memory MongoDB server and deterministic adaptive AI engine if no external database or API keys are provided.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (Pages Router) & React 19
- **Styling**: Tailwind CSS (Dark theme, glassmorphism, glowing accents)
- **State Management**: Zustand with persistent storage
- **HTTP & Real-Time**: Axios & Socket.IO Client
- **Voice & Audio**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), MediaRecorder, Canvas Frequency Visualizer
- **Icons & Effects**: `lucide-react`, `canvas-confetti`

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose (with automated `mongodb-memory-server` fallback)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Real-Time Layer**: Socket.IO for live voice states and tutor streaming
- **Security & Performance**: `helmet`, `cors`, `morgan`, `compression`, `express-rate-limit`, `express-validator`

### AI & Multi-Agent Layer
- **Orchestrator**: Multi-agent coordinator (`tutorOrchestrator`) with optional LangGraph compatibility check
- **Primary AI Provider**: OpenRouter API (`OPENROUTER_API_KEY`)
- **Fallback AI Provider**: Google Generative AI SDK (`GEMINI_API_KEY`)
- **Deterministic Engine**: Intelligent offline conversational & pedagogical fallback engine

---

## 📁 Repository Structure

```
LingoVoiceAI/
├── package.json               # Root workspace scripts (npm run dev, install:all)
├── README.md                  # Complete project documentation & local setup guide
├── spec.md                    # Single source of truth specification
├── server/                    # Express backend & AI tutor service
│   ├── .env.example           # Server environment template
│   ├── package.json
│   └── src/
│       ├── server.js          # HTTP & Socket.IO server entry point
│       ├── app.js             # Express application & middleware stack
│       ├── config/            # DB connection, Socket.IO, and Env config
│       ├── models/            # Mongoose schemas (User, Session, Turns, Feedback, etc.)
│       ├── routes/            # REST API route declarations
│       ├── controllers/       # Thin request parsers & response shapers
│       ├── services/          # Core business logic & database services
│       ├── agents/            # Multi-agent AI tutoring & evaluation pipeline
│       ├── voice/             # STT and TTS provider abstractions
│       └── middleware/        # Auth JWT, rate limiters, validation, error handler
└── client/                    # Next.js frontend application
    ├── .env.local.example     # Client environment template
    ├── package.json
    ├── tailwind.config.js     # Custom design system & animations
    ├── next.config.mjs
    └── src/
        ├── pages/             # Pages Router (/, /login, /onboarding, /dashboard, /conversation/[id], etc.)
        ├── components/        # UI components (AppShell, VoiceRecorder, AudioVisualizer, Feedback, etc.)
        ├── store/             # Zustand stores (authStore, learnerStore, conversationStore)
        ├── services/          # Axios instance, Socket.IO client, Web Speech voice service
        └── styles/            # Tailwind base & global custom classes
```

---

## 🚀 Quickstart: Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

---

### Step 1: Install Dependencies

From the root directory, run the install script:

```bash
npm run install:all
```

*(Or install individually)*:
```bash
cd server && npm install
cd ../client && npm install
```

---

### Step 2: Configure Environment Variables (Optional)

The system works **out of the box with zero external configuration** using in-memory MongoDB and the deterministic tutoring engine.

If you wish to configure external MongoDB or AI providers:

#### 1. Server Configuration:
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB (Leave default or point to local/Atlas MongoDB instance)
MONGO_URI=mongodb://localhost:27017/lingovoice

# JWT Secret
JWT_SECRET=lingovoice_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d

# Optional: AI Provider Keys (If left empty, intelligent deterministic engine runs)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
GEMINI_API_KEY=
```

#### 2. Client Configuration:
Create `client/.env.local` (or copy from `client/.env.local.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

### Step 3: Run the Application

You can start both the backend server and frontend client concurrently with a single command from the project root:

```bash
npm run dev
```

Or run each service in separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 3000)
npm run dev:client
```

---

### Step 4: Access the Application

- 🌐 **Web Client**: [http://localhost:3000](http://localhost:3000)
- 🔌 **API Server**: [http://localhost:5000/api](http://localhost:5000/api)
- 🏥 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚡ Instant Demo Login

For immediate testing without manual sign up, you can click the **&ldquo;Instant One-Click Demo Login&rdquo;** button on the `/login` page or use:

- **Email**: `learner@lingovoice.ai`
- **Password**: `password123`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service & AI provider diagnostic status | No |
| `POST` | `/api/auth/register` | Register a new learner account | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/update` | Update user details | Yes |
| `GET` | `/api/profile` | Fetch learner configuration | Yes |
| `PUT` | `/api/profile` | Update learner preferences & goals | Yes |
| `POST` | `/api/profile/assessment` | Submit initial language level assessment | Yes |
| `GET` | `/api/sessions` | List learner's previous sessions | Yes |
| `POST` | `/api/sessions` | Create a new learning session | Yes |
| `GET` | `/api/sessions/:id` | Fetch session details and turns | Yes |
| `POST` | `/api/sessions/:id/end` | Complete session & trigger evaluation | Yes |
| `POST` | `/api/conversations/:sessionId/message` | Submit spoken turn & trigger AI tutor agents | Yes |
| `GET` | `/api/conversations/:sessionId` | Fetch full conversation transcript | Yes |
| `POST` | `/api/voice/transcribe` | Transcribe speech audio | Yes |
| `POST` | `/api/voice/synthesize` | Generate speech parameters for text | Yes |
| `POST` | `/api/voice/analyze` | Evaluate pronunciation against target phrase | Yes |
| `GET` | `/api/scenarios` | List language scenarios (filtered by difficulty/category) | Yes |
| `GET` | `/api/scenarios/:id` | Fetch scenario details | Yes |
| `POST` | `/api/scenarios/:id/start` | Start roleplay session for scenario | Yes |
| `GET` | `/api/practice/daily-challenge` | Fetch today's personalized speaking challenge | Yes |
| `POST` | `/api/practice/submit` | Submit completed practice drill | Yes |
| `GET` | `/api/practice/recommendations` | Get AI-generated exercise recommendations | Yes |
| `GET` | `/api/progress` | Get current skill scores & streak | Yes |
| `GET` | `/api/progress/history` | Get historical score snapshots | Yes |
| `GET` | `/api/progress/insights` | Get recurring mistakes & actionable tips | Yes |
| `GET` | `/api/notifications` | List user in-app notifications | Yes |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | Yes |

---

## 🔌 Real-Time Socket.IO Events

The backend emits live events to synchronized clients connected to session rooms (`session_<sessionId>`):

- `recording_started`: Learner started audio capture
- `audio_processing`: Backend speech recognition pipeline running
- `tutor_thinking`: AI Multi-Agent pipeline orchestrating response
- `tutor_response_ready`: AI Tutor spoken turn ready
- `feedback_ready`: Granular turn-level grammar & pronunciation feedback delivered
- `session_completed`: End-of-session pedagogical synthesis broadcast

---

## 📦 Production Build

To build the client bundle for production:

```bash
npm run build:client
```

To run the server in production mode:

```bash
npm run start
```

---

## 🛡️ License

This project is licensed under the **MIT License**.
