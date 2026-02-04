import { create } from 'zustand';
import type { Settings } from './store';

interface SettingsUIState {
  settingsOpenForTabId: string | null;
  toggleSettings: (tabId: string) => void;
}

export const useSettingsStore = create<SettingsUIState>()(set => ({
  settingsOpenForTabId: null,
  toggleSettings: (tabId: string) => {
    set(state => ({
      settingsOpenForTabId: state.settingsOpenForTabId === tabId ? null : tabId,
    }));
  },
}));

export function buildYtDlpArgs(settings: Settings, url: string, outputPath: string): string[] {
  const args: string[] = [
    url,
    '-o',
    `${outputPath}/%(title)s.%(ext)s`,
    '--no-mtime',
    '--no-overwrites',
    '--js-runtimes',
    'deno,nodejs',
  ];

  if (settings.format) {
    args.push('-f', settings.format);
  }

  if (settings.extractAudio) {
    args.push('-x');
    if (settings.audioFormat) {
      args.push('--audio-format', settings.audioFormat);
    }
  }

  if (settings.rateLimit) {
    args.push('--rate-limit', settings.rateLimit);
  }

  if (settings.concurrentFragments) {
    args.push('-N', settings.concurrentFragments);
  }

  if (settings.writeSubs) {
    args.push('--write-subs');
    if (settings.subLangs) {
      args.push('--sub-langs', settings.subLangs);
    }
  }

  if (settings.restrictFilenames) {
    args.push('--restrict-filenames');
  }

  if (settings.cookiesFromBrowser) {
    args.push('--cookies-from-browser', settings.cookiesFromBrowser);
  }

  if (settings.customArgs) {
    const customArgsList = settings.customArgs.split(/\s+/).filter(Boolean);
    args.push(...customArgsList);
  }

  return args;
}
