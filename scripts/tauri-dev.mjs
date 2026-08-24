import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const extraArgs = process.argv.slice(2);
const preferredPort = Number.parseInt(process.env.PORT || process.env.VITE_DEV_PORT || '5173', 10);
const tauriJs = path.join(root, 'node_modules', '@tauri-apps', 'cli', 'tauri.js');

const server = await createServer({
  configFile: path.join(root, 'vite.config.ts'),
  root,
  server: {
    port: Number.isFinite(preferredPort) ? preferredPort : 5173,
    strictPort: false,
    host: process.env.TAURI_DEV_HOST || '127.0.0.1',
  },
});

await server.listen();
server.printUrls();

const devUrl = server.resolvedUrls?.local?.[0]?.replace(/\/$/, '');
if (!devUrl) {
  await server.close();
  throw new Error('Vite started but did not report a local URL');
}

console.log(`Tauri will load ${devUrl}`);

const configPatch = JSON.stringify({
  build: {
    beforeDevCommand: '',
    devUrl,
  },
});

// Run the JS CLI through Node so Windows does not mangle --config via tauri.cmd.
const child = spawn(process.execPath, [tauriJs, 'dev', '--config', configPatch, ...extraArgs], {
  cwd: root,
  env: {
    ...process.env,
    TAURI_DEV_URL: devUrl,
  },
  stdio: 'inherit',
  windowsHide: false,
});

let shuttingDown = false;

async function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  try {
    await server.close();
  } catch {
    // Vite may already be stopped.
  }

  process.exit(code ?? 0);
}

child.on('exit', code => {
  void shutdown(code ?? 0);
});

child.on('error', error => {
  console.error(error);
  void shutdown(1);
});

process.on('SIGINT', () => {
  child.kill();
});

process.on('SIGTERM', () => {
  child.kill();
});
