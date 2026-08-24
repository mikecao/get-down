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

export function parseCustomArgs(input: string): string[] {
  const args: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let escaped = false;
  let hasToken = false;

  for (const char of input) {
    if (escaped) {
      current += char;
      escaped = false;
      hasToken = true;
      continue;
    }

    if (char === '\\' && quote !== "'") {
      escaped = true;
      hasToken = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      hasToken = true;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      hasToken = true;
      continue;
    }

    if (/\s/.test(char)) {
      if (hasToken) {
        args.push(current);
        current = '';
        hasToken = false;
      }
      continue;
    }

    current += char;
    hasToken = true;
  }

  if (escaped) {
    current += '\\';
  }

  if (hasToken) {
    args.push(current);
  }

  return args;
}

export const DEFAULT_OUTPUT_TEMPLATE = '%(title)s.%(ext)s';

function isAbsoluteOutputTemplate(template: string): boolean {
  return (
    /^[A-Za-z]:[\\/]/.test(template) ||
    template.startsWith('/') ||
    template.startsWith('\\\\') ||
    template.startsWith('~/')
  );
}

export function resolveOutputTemplate(outputPath: string, template?: string): string {
  const trimmed = template?.trim() || DEFAULT_OUTPUT_TEMPLATE;
  if (isAbsoluteOutputTemplate(trimmed)) {
    return trimmed;
  }

  const base = (outputPath || '.').replace(/[\\/]+$/, '');
  const relative = trimmed.replace(/^[\\/]+/, '');
  return `${base}/${relative}`;
}

export function buildYtDlpArgs(settings: Settings, url: string, outputPath: string): string[] {
  const args: string[] = [
    url,
    '-o',
    resolveOutputTemplate(outputPath, settings.outputTemplate),
    '--no-mtime',
    '--no-overwrites',
    '--js-runtimes',
    'deno',
    '--js-runtimes',
    'node',
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
    args.push(...parseCustomArgs(settings.customArgs));
  }

  return args;
}
