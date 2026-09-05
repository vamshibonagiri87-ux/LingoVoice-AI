import { create } from 'zustand';
import api from '../services/api';
import voiceService from '../services/voice';
import { getSocket, joinSessionRoom, leaveSessionRoom } from '../services/socket';

export const useConversationStore = create((set, get) => ({
  session: null,
  turns: [],
  recordingState: 'idle', // 'idle' | 'listening' | 'processing' | 'responding' | 'speaking' | 'error'
  audioLevel: 0,
  frequencyData: null,
  interimTranscript: '',
  currentTranscript: '',
  activeFeedback: null,
  sessionSummary: null,
  isLoadingSession: false,
  isTtsPlaying: false,
  error: null,

  setRecordingState: (recordingState) => set({ recordingState }),
  setAudioLevel: (audioLevel, frequencyData) => set({ audioLevel, frequencyData }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  setCurrentTranscript: (currentTranscript) => set({ currentTranscript }),
  setActiveFeedback: (activeFeedback) => set({ activeFeedback }),
  setIsTtsPlaying: (isTtsPlaying) => set({ isTtsPlaying }),

  initSession: async (sessionId, userId) => {
    set({ isLoadingSession: true, error: null, sessionSummary: null });
    try {
      const res = await api.get(`/sessions/${sessionId}`);
      if (res.data.success) {
        const { session, turns } = res.data.data;
        set({ session, turns, isLoadingSession: false });

        // Join socket room
        joinSessionRoom(sessionId, userId);

        // Setup socket event listeners
        const socket = getSocket();
        if (socket) {
          socket.off('tutor_thinking');
          socket.off('tutor_response_ready');
          socket.off('feedback_ready');
          socket.off('session_completed');

          socket.on('tutor_thinking', () => {
            set({ recordingState: 'responding' });
          });

          socket.on('tutor_response_ready', ({ tutorTurn }) => {
            if (tutorTurn) {
              const currentTurns = get().turns;
              const exists = currentTurns.some((t) => t._id === tutorTurn._id);
              if (!exists) {
                set({
                  turns: [...currentTurns, tutorTurn],
                  recordingState: 'idle'
                });
                // Auto play TTS for tutor response
                get().playTutorVoice(tutorTurn.transcript);
              }
            }
          });

          socket.on('feedback_ready', ({ feedback }) => {
            if (feedback) {
              set({ activeFeedback: feedback });
            }
          });

          socket.on('session_completed', ({ summary, overallFeedback }) => {
            set({ sessionSummary: { summary, overallFeedback }, recordingState: 'idle' });
          });
        }

        // Auto play first tutor turn greeting if new session
        if (turns.length === 1 && turns[0].speaker === 'tutor') {
          setTimeout(() => {
            get().playTutorVoice(turns[0].transcript);
          }, 600);
        }
      }
    } catch (err) {
      console.error('[ConversationStore] Failed to load session:', err);
      set({ isLoadingSession: false, error: err.response?.data?.error || 'Failed to load conversation session' });
    }
  },

  startVoiceRecording: async (language = 'es-ES') => {
    set({ recordingState: 'listening', interimTranscript: '', currentTranscript: '', error: null });

    const langCodeMap = {
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Japanese': 'ja-JP',
      'Italian': 'it-IT',
      'English': 'en-US'
    };

    const targetLang = get().session?.targetLanguage || 'Spanish';
    const effectiveLang = langCodeMap[targetLang] || language;

    voiceService.startListening({
      language: effectiveLang,
      onResult: ({ final, interim }) => {
        if (interim) set({ interimTranscript: interim });
        if (final) {
          const combined = (get().currentTranscript + ' ' + final).trim();
          set({ currentTranscript: combined, interimTranscript: '' });
        }
      },
      onAudioLevel: (level, dataArray) => {
        set({ audioLevel: level, frequencyData: dataArray });
      },
      onError: (err) => {
        set({ recordingState: 'error', error: err.message });
      },
      onEnd: () => {
        if (get().recordingState === 'listening') {
          // Finished speaking
        }
      }
    });
  },

  stopVoiceRecordingAndSubmit: async () => {
    voiceService.stopListening();
    const finalSpokenText = (get().currentTranscript + ' ' + get().interimTranscript).trim();

    if (!finalSpokenText) {
      set({ recordingState: 'idle', interimTranscript: '', currentTranscript: '' });
      return;
    }

    set({ recordingState: 'processing' });
    await get().sendMessage(finalSpokenText);
  },

  cancelRecording: () => {
    voiceService.stopListening();
    set({ recordingState: 'idle', interimTranscript: '', currentTranscript: '', audioLevel: 0 });
  },

  sendMessage: async (transcriptText) => {
    const session = get().session;
    if (!session || !transcriptText.trim()) return;

    set({ recordingState: 'processing', error: null });

    try {
      const res = await api.post(`/conversations/${session._id}/message`, {
        transcript: transcriptText.trim()
      });

      if (res.data.success) {
        const { userTurn, tutorTurn, feedback } = res.data.data;
        const currentTurns = get().turns;

        set({
          turns: [...currentTurns, userTurn, tutorTurn],
          activeFeedback: feedback,
          currentTranscript: '',
          interimTranscript: '',
          recordingState: 'idle'
        });

        // Play TTS for tutor response
        get().playTutorVoice(tutorTurn.transcript);
      }
    } catch (err) {
      console.error('[ConversationStore] Send message error:', err);
      set({
        recordingState: 'error',
        error: err.response?.data?.error || 'Failed to process spoken response'
      });
    }
  },

  playTutorVoice: (text, customRate = 0.95) => {
    const targetLang = get().session?.targetLanguage || 'Spanish';
    const langCodeMap = {
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Japanese': 'ja-JP',
      'Italian': 'it-IT',
      'English': 'en-US'
    };
    const lang = langCodeMap[targetLang] || 'es-ES';

    voiceService.speakText(text, {
      language: lang,
      rate: customRate,
      onStart: () => set({ isTtsPlaying: true }),
      onEnd: () => set({ isTtsPlaying: false }),
      onError: () => set({ isTtsPlaying: false })
    });
  },

  stopTts: () => {
    voiceService.stopSpeaking();
    set({ isTtsPlaying: false });
  },

  endCurrentSession: async () => {
    const session = get().session;
    if (!session) return;

    try {
      const res = await api.post(`/sessions/${session._id}/end`);
      if (res.data.success) {
        const { session: updatedSession, evaluation } = res.data.data;
        set({
          session: updatedSession,
          sessionSummary: evaluation,
          recordingState: 'idle'
        });
        return evaluation;
      }
    } catch (err) {
      console.error('[ConversationStore] End session error:', err);
    }
  },

  cleanup: () => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
    const session = get().session;
    if (session) {
      leaveSessionRoom(session._id);
    }
    set({
      session: null,
      turns: [],
      recordingState: 'idle',
      interimTranscript: '',
      currentTranscript: '',
      activeFeedback: null,
      sessionSummary: null,
      isTtsPlaying: false,
      error: null
    });
  }
}));
