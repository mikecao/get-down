import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import App from './App';
import './global.css';
import { initAppInfo } from './lib/appInfo';
import { getDb } from './lib/db';
import { loadSavePath } from './lib/store';

async function init() {
  initAppInfo();
  // Initialize SQLite connection and load save path before rendering
  await getDb();
  await loadSavePath();

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

init();
