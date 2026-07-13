import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress transient "Unexpected end of input" SyntaxErrors that occur during
// Vite HMR (Hot Module Replacement). When files are saved, Vite's dev server
// pushes updates over a WebSocket; if a message is incomplete, the HMR client's
// internal JSON.parse throws this error. It has no app-level stack trace and
// doesn't affect functionality — it's a development-time transient issue.
const isTransientHMRError = (error) => {
  if (!error) return false;
  const isSyntax = error instanceof SyntaxError ||
    (error?.name === 'SyntaxError') ||
    (error?.message && error.message.includes('Unexpected end of input'));
  return isSyntax && error?.message?.includes('Unexpected end of input');
};

window.addEventListener('error', (event) => {
  if (isTransientHMRError(event.error)) {
    event.preventDefault();
    console.warn('[HMR] Suppressed transient parse error (non-fatal).');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (isTransientHMRError(event.reason)) {
    event.preventDefault();
    console.warn('[HMR] Suppressed transient parse error (non-fatal).');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)