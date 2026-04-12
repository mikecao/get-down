import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import App from './App';
import './global.css';
import { initAppInfo } from './lib/appInfo';
import { getDb } from './lib/db';
import { loadSavePath } from './lib/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

async function init() {
  await Promise.allSettled([initAppInfo(), getDb().then(() => loadSavePath())]);
}

void init();
