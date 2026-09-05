# Project Overview & Tech Stack

## Project Overview

Build a full-stack AI Voice Language Tutor called LingoVoice AI that helps users learn and practice languages through natural voice conversations with an AI tutor.

The platform must allow learners to select a language, assess their current proficiency, participate in real-time or turn-based AI voice conversations, receive pronunciation and grammar feedback, learn vocabulary in context, complete personalized speaking exercises, and track their improvement over time.

LingoVoice AI must transform traditional language learning from a static lesson-based experience into an interactive Speak → Analyze → Correct → Practice → Improve learning loop.

The AI tutor must adapt conversations, vocabulary, grammar complexity, exercises, and feedback according to the learner's proficiency level and historical performance. The platform should support multiple learning scenarios such as daily conversation, travel, interviews, education, business communication, and custom practice.

The system must process user speech, convert it to text, analyze pronunciation and language quality, generate an appropriate AI response, and optionally convert the response back into natural speech.

The completed application should feel like a personal AI language coach that is available anytime and continuously adapts to the learner.

---

## Tech Stack

### Frontend

 Next.js (Pages Router)
 React 19
 Tailwind CSS
 Zustand
 Axios
 Socket.IO Client
 Web Speech API or MediaRecorder API
 Wavesurfer.js or custom audio visualization
 lucide-react icons

### Backend

 Node.js
 Express
 MongoDB
 Mongoose
 JSON Web Tokens
 bcryptjs
 Socket.IO
 helmet
 morgan
 compression
 express-validator
 express-rate-limit

### AI Integration

 Google Generative AI SDK
 OpenRouter API
 Speech-to-Text provider abstraction
 Text-to-Speech provider abstraction
 LangChain and LangGraph available for AI tutor orchestration

### Voice Capabilities

The application should support

 Speech recording
 Audio upload where supported
 Speech-to-text transcription
 AI-generated conversational responses
 Text-to-speech playback
 Pronunciation analysis
 Speaking feedback
 Conversation history analysis

The architecture must allow voice providers to be replaced without changing core application logic.

---

# Authentication, Learning Profiles, and AI Tutoring

## Authentication

The authentication system must support

 User registration
 Login
 JWT-based session handling
 Protected routes
 `authme` profile endpoint
 Password hashing with bcrypt
 Persistent login state through Zustand
 Logout
 Profile updates

The User model must support learner-specific information including

 Name
 Email
 Password
 Native language
 Target language
 Current proficiency level
 Learning goals
 Preferred learning style
 Daily learning target
 Last login

---

## Learning Profile Management

When a new user enters the application, they must complete an onboarding flow.

The onboarding system must collect

 Native language
 Language to learn
 Current proficiency level
 Learning purpose
 Daily practice goal
 Preferred conversation topics

Learning purposes can include

 Daily conversation
 Travel
 Job interviews
 Business communication
 Education
 Exams
 Social communication
 Custom goal

The system must generate a personalized learner profile based on the onboarding information.

Users must be able to update their learning preferences from the settings page.

---

# AI Tutor Orchestration

For AI tutoring, the backend must process each learning interaction through a structured tutoring pipeline.

## Conversation Agent

The Conversation Agent must

 Understand the current conversation context
 Generate natural responses
 Match the learner's proficiency level
 Encourage the learner to continue speaking
 Introduce relevant vocabulary naturally
 Avoid unnecessarily complex language

The Conversation Agent must maintain conversation continuity.

---

## Pronunciation Agent

The Pronunciation Agent must

 Analyze the learner's spoken response
 Compare expected and recognized speech where applicable
 Identify potential pronunciation difficulties
 Detect commonly mispronounced words where supported
 Generate clear improvement feedback
 Suggest focused practice words or phrases

The system must avoid presenting pronunciation scoring as perfectly objective when the underlying speech provider does not provide phoneme-level scoring.

---

## Grammar Agent

The Grammar Agent must

 Analyze the learner's sentence structure
 Identify grammar mistakes
 Explain corrections clearly
 Preserve the learner's intended meaning
 Provide a corrected version
 Identify recurring grammar patterns

Feedback should be encouraging and educational rather than overly critical.

---

## Vocabulary Agent

The Vocabulary Agent must

 Detect vocabulary gaps
 Suggest useful alternative words
 Introduce contextual vocabulary
 Track newly learned words
 Generate examples using the learner's current level

Vocabulary recommendations must relate to the learner's conversations and learning goals whenever possible.

---

## Progress Agent

The Progress Agent must

 Analyze completed sessions
 Track recurring mistakes
 Monitor conversation consistency
 Track vocabulary growth
 Identify improvement areas
 Recommend future exercises

The Progress Agent must update the learner's progress profile after each completed session.

---

## Tutor Orchestrator

The Tutor Orchestrator coordinates

1. Conversation Agent
2. Pronunciation Agent
3. Grammar Agent
4. Vocabulary Agent
5. Progress Agent

LangGraph must be importable as an orchestration substrate, and the tutoring session metadata must report

`langGraph 'available'  'not-installed'`

The platform must continue functioning when LangGraph is unavailable.

---

# Voice Conversation System

## Voice Input

Users must be able to

 Start a voice conversation
 Record their speech
 Stop recording
 Submit recorded speech
 View transcription results
 Retry recording
 Delete a recording before submission where supported

The frontend must clearly show microphone states

 Idle
 Listening
 Processing
 AI responding
 Playing response
 Error

---

## Speech-to-Text

The backend must receive or process user speech and generate a transcription.

The transcription pipeline must support

 Language selection
 Transcription confidence when provided
 Error handling
 Retry handling
 Fallback providers where configured

The system must store the final transcript as part of the conversation turn.

---

## AI Response Generation

After transcription, the AI Tutor must

1. Understand the learner's message.
2. Analyze the current conversation context.
3. Determine the learner's language level.
4. Generate an appropriate response.
5. Generate optional corrections.
6. Generate vocabulary suggestions.
7. Return structured feedback.

The AI response must contain

 Tutor response
 Corrected learner sentence when necessary
 Grammar feedback
 Vocabulary suggestions
 Practice recommendations

The conversation must remain natural and should not interrupt the learner after every minor mistake.

---

## Text-to-Speech

The system must convert AI tutor responses into natural speech where a configured TTS provider is available.

Users must be able to

 Play AI responses
 Replay responses
 Pause audio
 Change playback speed where supported

The system must store the text response independently from generated audio.

---

# Learning Modes

## Free Conversation Mode

Users can have an open-ended conversation with the AI tutor.

The AI should

 Ask questions
 Respond naturally
 Adapt difficulty
 Remember session context
 Encourage longer responses

Example topics include

 Daily life
 Hobbies
 Movies
 Technology
 Travel
 Food
 Education

---

## Scenario Practice Mode

The application must provide predefined conversation scenarios.

Initial scenarios include

 Airport conversation
 Hotel check-in
 Restaurant ordering
 Job interview
 College interview
 Business meeting
 Shopping
 Doctor appointment communication
 Meeting new people

Each scenario must include

 Scenario title
 Description
 Difficulty level
 Target vocabulary
 Learning objectives

The AI tutor must role-play the other participant in the scenario.

---

## Interview Practice Mode

The system must simulate language-focused interviews.

The user can select

 Job interview
 College interview
 General communication interview

The AI must

 Ask questions
 Wait for spoken answers
 Analyze responses
 Provide session feedback

At the end of the session, the system must generate an interview summary.

---

## Daily Challenge Mode

The system must generate short daily speaking challenges.

Examples include

 Describe your day for one minute
 Explain your favorite movie
 Introduce yourself
 Describe a recent experience
 Explain how to solve a simple problem

Challenges must adapt to the learner's proficiency level.

---

## Pronunciation Practice Mode

Users must be able to practice individual words and short phrases.

The system must provide

 Target text
 Audio playback
 Recording capability
 Transcription or pronunciation feedback where supported
 Practice repetition tracking

---

# Proficiency System

The platform must support the following learner levels

 Beginner
 Elementary
 Intermediate
 Upper Intermediate
 Advanced

Optionally, the system may map these levels to CEFR-style levels

 A1
 A2
 B1
 B2
 C1

The AI tutor must adjust

 Sentence complexity
 Vocabulary difficulty
 Speaking speed recommendations
 Feedback complexity
 Conversation topics

---

## Initial Assessment

New users may complete an initial language assessment.

The assessment can include

 Basic introduction questions
 Vocabulary questions
 Grammar prompts
 Voice responses
 Short conversation

The AI must estimate an initial proficiency level and confidence score.

The estimated level must remain editable by the user.

---

# Feedback System

After a conversation turn or session, the user must receive structured feedback.

## Feedback Categories

The system should analyze

 Pronunciation
 Grammar
 Vocabulary
 Fluency
 Sentence construction
 Confidence indicators where inferable

Feedback must clearly distinguish between

 Confirmed transcription or language observations
 AI-generated learning recommendations
 Provider-generated scores

The platform must not falsely claim precise phoneme-level accuracy unless the configured provider supports it.

---

## Session Feedback

At the end of each learning session, generate

 Overall session summary
 Strong points
 Areas to improve
 Grammar corrections
 Vocabulary learned
 Recommended next exercise
 Personalized learning tip

---

# Progress Tracking

## Dashboard Metrics

The learner dashboard must display

 Current learning streak
 Total practice time
 Total conversations
 Words learned
 Completed challenges
 Current proficiency level
 Recent improvement areas

---

## Skill Tracking

The system must track separate skill categories

 Speaking
 Pronunciation
 Grammar
 Vocabulary
 Fluency
 Listening where supported

Progress values must be based on recorded learning interactions and should not be presented as scientifically precise proficiency measurements unless backed by validated assessment methods.

---

## Learning History

Users must be able to view

 Previous sessions
 Conversation topics
 Session duration
 AI feedback
 Corrections
 Vocabulary learned
 Practice dates

Users must also be able to reopen a previous session and review the transcript.

---

# Conversation and Session Management

Every conversation must belong to a learning session.

A session can have the following statuses

 CREATED
 ACTIVE
 PROCESSING
 COMPLETED
 FAILED
 CANCELLED

Each conversation turn must store

 Session ID
 Speaker
 Original transcript
 AI response
 Audio metadata where applicable
 Feedback
 Timestamp

The backend must maintain an immutable historical record of completed interactions.

---

# Real-Time Layer

The Socket.IO server must support real-time learning events.

Events may include

 recording_started
 recording_stopped
 audio_processing
 transcription_ready
 tutor_thinking
 tutor_response_ready
 feedback_ready
 session_completed

Subscribed clients must receive relevant events for active sessions.

The frontend must render these events through appropriate UI states rather than exposing raw backend event logs to learners.

---

# AI Provider Strategy

## Primary Provider

The system should prefer OpenRouter when

`OPENROUTER_API_KEY`

is configured.

---

## Fallback Provider

The system should fall back to Google Gemini when

`GEMINI_API_KEY`

is configured.

---

## Deterministic Fallback

When no AI provider is configured, the application must provide a limited deterministic fallback.

The fallback should support

 Basic conversation prompts
 Simple grammar correction rules
 Static vocabulary exercises
 Basic scenario templates

The fallback must clearly operate within its limited capabilities and should not claim advanced AI analysis.

---

# Frontend Pages

The application uses the Next.js Pages Router.

The root `` page redirects authenticated users to the dashboard and unauthenticated users to login.

---

## ``

Landing page featuring

 LingoVoice AI introduction
 Product value proposition
 Voice conversation demonstration
 Feature highlights
 Learning modes
 CTA buttons
 Responsive layout
 Dark theme support

---

## `login`

Form for

 Emailpassword authentication
 JWT handling
 Zustand persistence
 Validation
 Loading states
 Error states

---

## `register`

Form for

 User registration
 Password validation
 Account creation
 Session persistence
 Error handling

---

## `onboarding`

Multi-step onboarding flow.

Steps include

1. Choose native language.
2. Choose target language.
3. Select proficiency level.
4. Select learning goals.
5. Set daily practice target.
6. Choose preferred topics.

The final step must create or update the learner profile.

---

## `dashboard`

Personal learning dashboard containing

 Welcome section
 Current learning streak
 Practice statistics
 Skill progress
 Recent sessions
 Daily challenge
 Recommended next lesson

The dashboard should use a clean learning-focused application layout.

---

## `learn`

Main learning hub.

Users can select

 Free conversation
 Scenario practice
 Interview practice
 Pronunciation practice
 Daily challenge

---

## `conversation[id]`

Full voice conversation interface.

The page must include

 Conversation history
 AI tutor messages
 User transcripts
 Microphone controls
 Audio visualization
 Recording state
 AI processing indicator
 Text-to-speech playback
 End session button

---

## `scenarios`

List of available learning scenarios.

Users must be able to filter scenarios by

 Difficulty
 Category
 Learning goal

---

## `scenarios[id]`

Interactive AI role-play interface for a selected scenario.

---

## `practice`

Practice hub for

 Pronunciation exercises
 Vocabulary practice
 Grammar exercises
 Speaking challenges

---

## `progress`

Detailed learning analytics page.

The page must display

 Skill trends
 Practice history
 Learning streak
 Vocabulary growth
 Recurring mistakes
 AI recommendations

---

## `history`

List of previous learning sessions.

Users must be able to

 Search sessions
 Filter by learning mode
 Open a session
 Review transcripts
 Review feedback

---

## `settings`

Settings page containing

 Profile management
 Native language
 Target language
 Learning goals
 Daily target
 Theme settings
 AI provider health
 Voice service status

---

# Backend Architecture

## Routes Layer

Routes handle

 HTTP routing
 Request validation
 Authentication middleware
 Authorization
 Error middleware

Routes must not contain business logic.

---

## Controllers Layer

Controllers are responsible for

 Request parsing
 Calling services
 Response shaping

Controllers must never communicate directly with MongoDB.

---

## Services Layer

Services own business logic including

 Authentication
 User profile management
 Conversation lifecycle
 Speech processing
 AI tutoring
 Feedback generation
 Progress calculation
 Scenario management
 Notification creation

---

## AI Agents Layer

The Agents Layer contains

 conversationAgent
 pronunciationAgent
 grammarAgent
 vocabularyAgent
 progressAgent
 tutorOrchestrator

Agents must remain independent from HTTP request and response logic.

---

## Voice Layer

The Voice Layer must provide provider abstractions.

Suggested interfaces include

 baseSpeechToText.js
 baseTextToSpeech.js
 speechService.js
 audioService.js

Individual providers must implement a common interface.

---

## Config Layer

The Config Layer centralizes

 Environment variables
 Database configuration
 Socket.IO configuration
 AI provider configuration
 Voice provider configuration

MongoDB must support an in-memory fallback for local development when a database connection is unavailable.

---

# Database Collections

## Users

Stores authenticated user information.

Fields include

 name
 email
 password with `select false`
 nativeLanguage
 targetLanguage
 proficiencyLevel
 learningGoal
 dailyTargetMinutes
 role
 lastLogin

Roles

 learner
 admin

---

## LearningProfiles

Stores personalized learner configuration.

Fields include

 userId
 nativeLanguage
 targetLanguage
 proficiencyLevel
 proficiencyConfidence
 learningGoals
 preferredTopics
 dailyTargetMinutes
 strengths
 improvementAreas

---

## LearningSessions

Stores learning sessions.

Fields include

 userId
 mode
 scenarioId
 targetLanguage
 status
 startTime
 endTime
 duration
 summary
 overallFeedback

Modes include

 conversation
 scenario
 interview
 pronunciation
 challenge

---

## ConversationTurns

Stores individual learner and AI interactions.

Fields include

 sessionId
 speaker
 transcript
 normalizedTranscript
 audioReference
 feedback
 timestamp

Speaker values

 user
 tutor

---

## Feedback

Stores structured AI feedback.

Fields include

 userId
 sessionId
 turnId
 pronunciationFeedback
 grammarFeedback
 vocabularyFeedback
 fluencyFeedback
 strengths
 improvements
 recommendations

---

## Vocabulary

Stores learner vocabulary.

Fields include

 userId
 word
 meaning
 language
 example
 sourceSessionId
 familiarityLevel
 lastPracticedAt

---

## ProgressRecords

Stores historical progress snapshots.

Fields include

 userId
 date
 speakingScore
 pronunciationScore
 grammarScore
 vocabularyScore
 fluencyScore
 practiceMinutes

Scores must include metadata describing their source or estimation method when applicable.

---

## Scenarios

Stores language-learning scenarios.

Fields include

 title
 description
 category
 difficulty
 targetLanguage
 objectives
 vocabulary
 openingPrompt

---

## Notifications

Stores learner notifications.

Fields include

 userId
 type
 title
 message
 isRead

---

# API Endpoints

## Health

### GET `apihealth`

Returns

 Server status
 Database status
 AI provider status
 Voice provider status

---

# Authentication

### POST `apiauthregister`

Registers a new user.

### POST `apiauthlogin`

Authenticates a user and issues a JWT.

### GET `apiauthme`

Fetches the current authenticated user.

### POST `apiauthlogout`

Logs out the current user.

---

# Learning Profile

### GET `apiprofile`

Fetches the learner profile.

### PUT `apiprofile`

Updates learner preferences.

### POST `apiprofileassessment`

Submits an initial language assessment.

---

# Learning Sessions

### GET `apisessions`

Lists user learning sessions.

### POST `apisessions`

Creates a new learning session.

### GET `apisessionsid`

Fetches a single learning session.

### POST `apisessionsidend`

Completes a learning session.

### DELETE `apisessionsid`

Deletes a session where deletion is supported by the application's data policy.

---

# Voice

### POST `apivoicetranscribe`

Processes submitted audio and returns transcription.

### POST `apivoicesynthesize`

Generates speech audio from approved tutor response text.

### POST `apivoiceanalyze`

Processes supported pronunciation or speech analysis.

The endpoint must clearly return provider limitations when detailed pronunciation scoring is unavailable.

---

# Conversations

### POST `apiconversationssessionIdmessage`

Submits a learner message.

The backend must

1. Process transcript.
2. Retrieve conversation context.
3. Run the tutor orchestration pipeline.
4. Generate an AI response.
5. Generate feedback.
6. Store the interaction.
7. Return structured results.

### GET `apiconversationssessionId`

Fetches conversation history.

---

# Scenarios

### GET `apiscenarios`

Lists available scenarios.

### POST `apiscenarios`

Creates a scenario for administrators.

### GET `apiscenariosid`

Fetches scenario details.

### POST `apiscenariosidstart`

Starts a learning session using the selected scenario.

---

# Practice

### GET `apipracticedaily-challenge`

Fetches a personalized daily challenge.

### POST `apipracticesubmit`

Submits a practice attempt.

### GET `apipracticerecommendations`

Fetches AI-generated learning recommendations.

---

# Progress

### GET `apiprogress`

Fetches current learner progress.

### GET `apiprogresshistory`

Fetches historical progress records.

### GET `apiprogressinsights`

Returns recurring mistakes and AI recommendations.

---

# Notifications

### GET `apinotifications`

Lists user notifications.

### PUT `apinotificationsidread`

Marks a notification as read.

---

# Folder Structure

## Frontend Structure

client

└── src

    ├── components

    │   ├── AppShell

    │   ├── VoiceRecorder

    │   ├── AudioVisualizer

    │   ├── ConversationPanel

    │   ├── TutorFeedback

    │   ├── ProgressChart

    │   ├── ScenarioCard

    │   └── ProtectedRoute

    ├── pages

    │   ├── _app.js

    │   ├── index.js

    │   ├── login.js

    │   ├── register.js

    │   ├── onboarding.js

    │   ├── dashboard.js

    │   ├── learn.js

    │   ├── progress.js

    │   ├── history.js

    │   ├── settings.js

    │   ├── conversation

    │   │   └── [id].js

    │   ├── scenarios

    │   │   ├── index.js

    │   │   └── [id].js

    │   └── practice

    │       └── index.js

    ├── store

    │   ├── authStore.js

    │   ├── learnerStore.js

    │   └── conversationStore.js

    └── services

        ├── api.js

        ├── socket.js

        └── voice.js

---

## Backend Structure

server

└── src

    ├── config

    │   ├── env.js

    │   ├── db.js

    │   └── socket.js

    ├── routes

    │   ├── authRoutes.js

    │   ├── profileRoutes.js

    │   ├── sessionRoutes.js

    │   ├── conversationRoutes.js

    │   ├── voiceRoutes.js

    │   ├── scenarioRoutes.js

    │   ├── progressRoutes.js

    │   └── notificationRoutes.js

    ├── controllers

    │   ├── authController.js

    │   ├── profileController.js

    │   ├── sessionController.js

    │   ├── conversationController.js

    │   ├── voiceController.js

    │   └── progressController.js

    ├── services

    │   ├── authService.js

    │   ├── profileService.js

    │   ├── sessionService.js

    │   ├── conversationService.js

    │   ├── aiTutorService.js

    │   ├── voiceService.js

    │   ├── feedbackService.js

    │   └── progressService.js

    ├── agents

    │   ├── tutorOrchestrator.js

    │   ├── conversationAgent.js

    │   ├── pronunciationAgent.js

    │   ├── grammarAgent.js

    │   ├── vocabularyAgent.js

    │   └── progressAgent.js

    ├── voice

    │   ├── baseSpeechToText.js

    │   ├── baseTextToSpeech.js

    │   ├── speechToTextProvider.js

    │   └── textToSpeechProvider.js

    ├── models

    │   ├── User.js

    │   ├── LearningProfile.js

    │   ├── LearningSession.js

    │   ├── ConversationTurn.js

    │   ├── Feedback.js

    │   ├── Vocabulary.js

    │   ├── ProgressRecord.js

    │   ├── Scenario.js

    │   └── Notification.js

    └── middleware

        ├── authMiddleware.js

        ├── validationMiddleware.js

        └── errorMiddleware.js

---

# Development Phases

## Phase 1 Foundation

Build

 Next.js frontend
 Express backend
 MongoDB connection
 In-memory fallback
 JWT authentication
 Zustand auth store
 AppShell layout
 Landing page
 Login and registration

---

## Phase 2 Learner Onboarding

Build

 Onboarding flow
 Learning profile
 Language selection
 Proficiency selection
 Learning goals
 Daily learning target

---

## Phase 3 Voice Conversation MVP

Build

 Microphone recording
 Speech-to-text integration
 Conversation sessions
 AI tutor responses
 Conversation history
 Text-to-speech integration

The primary MVP loop must work

Speak → Transcribe → AI Responds → Listen → Continue

---

## Phase 4 AI Feedback Engine

Build

 Grammar Agent
 Vocabulary Agent
 Pronunciation feedback
 Conversation Agent
 Tutor Orchestrator
 Structured session feedback

---

## Phase 5 Learning Modes

Build

 Free conversation
 Scenario practice
 Interview practice
 Daily challenge
 Pronunciation practice

---

## Phase 6 Progress Intelligence

Build

 Progress tracking
 Vocabulary tracking
 Session analytics
 Learning streak
 Recurring mistake detection
 Personalized recommendations

---

## Phase 7 Real-Time Experience

Build

 Socket.IO integration
 Live voice processing states
 AI processing indicators
 Real-time session updates
 Notification system

---

# UI and UX Requirements

The UI must use a modern, immersive, learning-focused aesthetic.

The interface must be

 Fully responsive
 Mobile-friendly
 Accessible
 Minimal and uncluttered
 Optimized for voice interaction

The main conversation screen should prioritize the speaking experience.

The voice interface must visually communicate

 Listening
 Processing
 AI thinking
 AI speaking
 Session completion

The application should include

 Smooth transitions
 Loading states
 Skeleton loaders
 Empty states
 Clear microphone permission errors
 Audio processing feedback

The AI tutor interface should feel conversational rather than like a traditional form-based learning application.

---

# Security Requirements

The application must

 Hash passwords with bcrypt
 Sign and verify JWTs using `JWT_SECRET`
 Set HTTP security headers through helmet
 Limit CORS to `CLIENT_URL`
 Rate-limit authentication endpoints
 Validate request bodies using express-validator
 Never expose API keys to the frontend
 Store all secrets through `process.env`
 Validate audio upload size and type
 Avoid logging sensitive user audio content unnecessarily

Voice recordings and transcripts must be handled according to the application's stated data retention policy.

---

# Error Handling Requirements

The system must provide clear errors for

 MICROPHONE_PERMISSION_DENIED
 AUDIO_RECORDING_FAILED
 AUDIO_PROCESSING_FAILED
 SPEECH_TO_TEXT_FAILED
 TEXT_TO_SPEECH_FAILED
 AI_PROVIDER_UNAVAILABLE
 SESSION_NOT_FOUND
 INVALID_LANGUAGE
 AUTH_EXPIRED
 RATE_LIMITED

Errors must never silently fail.

The frontend must display user-friendly messages while the backend retains structured error information for debugging.

---

# Final Expected Outcome

The completed LingoVoice AI platform must allow a learner to

1. Create an account.
2. Select a native and target language.
3. Set learning goals and proficiency level.
4. Start a voice conversation with an AI tutor.
5. Speak naturally.
6. Have speech processed into text.
7. Receive an intelligent AI response.
8. Listen to the AI tutor's voice response.
9. Receive grammar, vocabulary, pronunciation, and fluency feedback.
10. Practice through real-world scenarios.
11. Complete daily speaking challenges.
12. Track learning progress over time.
13. Receive personalized recommendations.

The final application should feel like a combination of

A personal language tutor + AI conversation partner + pronunciation coach + adaptive learning system.

Its defining innovation is not simply teaching language through exercises, but creating a continuous, personalized speaking environment where the learner can practice without fear of judgment.

---

# Codex & AI Agent Implementation Instructions

The AI coding agent must build the application phase by phase.

The agent must

 Follow the folder structure strictly.
 Keep controllers thin.
 Push business logic into services.
 Never call MongoDB directly from a controller.
 Keep AI agents independent from HTTP logic.
 Route all AI processing through `aiTutorService`.
 Route all voice providers through the Voice Layer abstraction.
 Treat every secret as `process.env`.
 Use an in-memory fallback when MongoDB is unavailable.
 Validate every API request.
 Handle microphone and audio errors explicitly.
 Store conversation and feedback data consistently.
 Keep AI feedback structured and machine-readable.
 Avoid claiming unsupported pronunciation precision.
 Report the list of files created or changed at the end of every development phase.

The implementation priority must always be

First make the core voice conversation loop work.

Then build

AI feedback → learning modes → progress intelligence → advanced personalization.

The MVP should never become blocked by advanced features that are not required for the core experience.
