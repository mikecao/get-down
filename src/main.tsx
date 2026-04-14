import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import '@fontsource/jetbrains-mono';
import App from './App';
import './global.css';
import { initAppInfo } from './lib/appInfo';
import { getDb } from './lib/db';
import { loadSavePath, useTabsStore } from './lib/store';

function BootstrapApp() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await getDb();
        await loadSavePath();
        await useTabsStore.persist.rehydrate();
        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : String(error));
        }
      }

      void initAppInfo();
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="max-w-[520px] rounded border border-border bg-card p-6 text-center">
          <div className="font-semibold">Failed to load Get Down</div>
          <div className="mt-2 text-muted-foreground text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-muted-foreground text-sm">
        Loading Get Down...
      </div>
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BootstrapApp />
  </React.StrictMode>,
);
