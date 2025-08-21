import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './app.css';
import { registerSW } from './pwa/registerSW';
import { loadWordlist } from './dictionary';
import { useGameStore } from './store/useGameStore';

loadWordlist().then((dict) =>
  useGameStore.setState({ dictionary: dict })
);

registerSW();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
