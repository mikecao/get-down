import { create } from 'zustand';
import type { Settings } from './store';

interface SettingsUIState {
  showSettings: boolean;
  toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsUIState>()(set => ({
  showSettings: false,
  toggleSettings: () => {
    set(state => ({ showSettings: !state.showSettings }));
  },
}));

export function buildYtDlpArgs(settings: Settings, url: string, outputPath: string): string[] {
  const args: string[] = [
    url,
    '-o',
    `${outputPath}/%(title)s.%(ext)s`,
    '--no-mtime',
    '--no-overwrites',
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
