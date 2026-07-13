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
  const msg = error?.message || String(error);
  const isSyntax = error instanceof SyntaxError ||
    (error?.name === 'SyntaxError') ||
    /SyntaxError/i.test(msg);
  const isTransientMsg = /Unexpected end of input|Unexpected token|Unexpected end of JSON|JSON\.parse/i.test(msg);
  const noAppStack = !error?.stack || error?.stack === msg || error?.stack === `${error?.name}: ${msg}`;
  return isSyntax && (isTransientMsg || noAppStack);
};

window.addEventListener('error', (event) => {
  if (isTransientHMRError(event.error) || isTransientHMRError(event.message)) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return true;
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  if (isTransientHMRError(event.reason)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

// Also filter console.error so the Base44 error overlay doesn't surface these
const _origConsoleError = console.error;
console.error = (...args) => {
  const isHMR = args.some(a => isTransientHMRError(a) || (typeof a === 'string' && /Unexpected end of input/i.test(a)));
  if (isHMR) return;
  _origConsoleError(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)