import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app.css';
import { registerSW } from './pwa/registerSW';

// Register the service worker for PWA capabilities
registerSW();

// Mount the React application to the DOM
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
