import { getVersion } from '@tauri-apps/api/app';
import { Command } from '@tauri-apps/plugin-shell';
import { create } from 'zustand';

interface AppInfoState {
  appVersion: string;
  ytDlpVersion: string;
}

export const useAppInfo = create<AppInfoState>()(() => ({
  appVersion: '',
  ytDlpVersion: '',
}));

export async function initAppInfo() {
  const appVersion = await getVersion();
  useAppInfo.setState({ appVersion });

  const command = Command.sidecar('binaries/yt-dlp', ['--version']);
  command.stdout.on('data', line => {
    useAppInfo.setState({ ytDlpVersion: line.trim() });
  });
  command.stderr.on('data', line => {
    useAppInfo.setState(state => ({
      ytDlpVersion: state.ytDlpVersion || line.trim(),
    }));
  });
  await command.spawn().catch(() => {
    useAppInfo.setState({ ytDlpVersion: 'Unknown' });
  });
}
