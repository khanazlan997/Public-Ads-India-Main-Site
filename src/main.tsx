import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against Firestore Free Tier Quota Exhaustion uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason || '');
    if (msg.includes('Quota limit exceeded') || msg.includes('resource-exhausted') || msg.includes('Free daily read units')) {
      event.preventDefault();
      console.warn("Firestore daily free read limit reached. App active in resilient server/local storage mode.");
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || event.error?.message || '';
    if (msg.includes('Quota limit exceeded') || msg.includes('resource-exhausted') || msg.includes('Free daily read units')) {
      event.preventDefault();
      console.warn("Firestore daily free read limit reached. App active in resilient server/local storage mode.");
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
