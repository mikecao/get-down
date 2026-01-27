import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import App from './App';
import './global.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
