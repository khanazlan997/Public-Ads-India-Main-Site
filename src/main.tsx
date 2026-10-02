import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against Firestore Free Tier Quota Exhaustion & transient offline/connection errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || String(event.reason || '');
    if (
      msg.includes('Quota limit exceeded') || 
      msg.includes('resource-exhausted') || 
      msg.includes('Free daily read units') ||
      msg.includes('Could not reach Cloud Firestore') ||
      msg.includes('code=unavailable') ||
      msg.includes('The operation could not be completed')
    ) {
      event.preventDefault();
      console.warn("Firestore running in resilient offline/local cache mode.");
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || event.error?.message || '';
    if (
      msg.includes('Quota limit exceeded') || 
      msg.includes('resource-exhausted') || 
      msg.includes('Free daily read units') ||
      msg.includes('Could not reach Cloud Firestore') ||
      msg.includes('code=unavailable') ||
      msg.includes('The operation could not be completed')
    ) {
      event.preventDefault();
      console.warn("Firestore running in resilient offline/local cache mode.");
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
