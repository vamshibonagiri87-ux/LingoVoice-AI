import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export default function App({ Component, pageProps }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initializeAuth();
    initTheme();
  }, [initializeAuth, initTheme]);

  return (
    <>
      <Head>
        <title>LingoVoice AI - Interactive Voice Language Tutor</title>
        <meta name="description" content="Master speaking any language through interactive, real-time voice conversations with your adaptive AI language coach." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
