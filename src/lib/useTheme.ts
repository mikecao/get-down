import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import { getSetting, setSetting } from './db';

const THEME_KEY = 'theme';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  getCurrentWindow().setTheme(theme === 'dark' ? 'dark' : 'light');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Use system preference as initial value before SQLite loads
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [loaded, setLoaded] = useState(false);

  // Load saved theme from SQLite on mount
  useEffect(() => {
    getSetting(THEME_KEY).then(stored => {
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
      }
      setLoaded(true);
    });
  }, []);

  // Apply theme and persist to SQLite on change
  useEffect(() => {
    applyTheme(theme);
    if (loaded) {
      setSetting(THEME_KEY, theme);
    }
  }, [theme, loaded]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
