import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

const BINARIES_DIR = path.join(process.cwd(), 'src-tauri', 'binaries');
const YT_DLP_BASE_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download';

// Ensure binaries directory exists
if (!fs.existsSync(BINARIES_DIR)) {
  fs.mkdirSync(BINARIES_DIR, { recursive: true });
}

function download(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));

    console.log(`Downloading ${url}...`);
    const file = fs.createWriteStream(dest);

    https
      .get(url, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirect recursively
          file.close();
          fs.unlinkSync(dest);
          return resolve(download(res.headers.location, dest, redirectCount + 1));
        }

        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(`Request failed: ${res.statusCode}`));
        }

        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', err => {
        fs.unlink(dest, () => reject(err));
      });
  });
}

function makeExecutable(filePath) {
  if (process.platform !== 'win32') {
    fs.chmodSync(filePath, 0o755);
    console.log(`Made ${filePath} executable`);
  }
}

async function downloadBinaries() {
  const platform = process.platform;
  const arch = process.arch;

  console.log(`Detected platform: ${platform}, architecture: ${arch}`);
  console.log('Downloading yt-dlp binaries...\n');

  try {
    if (platform === 'darwin') {
      // macOS - download universal binary
      const url = `${YT_DLP_BASE_URL}/yt-dlp_macos`;
      const tempPath = path.join(BINARIES_DIR, 'yt-dlp-universal-apple-darwin');

      await download(url, tempPath);
      makeExecutable(tempPath);

      // Copy to both architecture-specific names
      const x64Path = path.join(BINARIES_DIR, 'yt-dlp-x86_64-apple-darwin');
      const arm64Path = path.join(BINARIES_DIR, 'yt-dlp-aarch64-apple-darwin');

      fs.copyFileSync(tempPath, x64Path);
      fs.copyFileSync(tempPath, arm64Path);
      fs.unlinkSync(tempPath);

      console.log('\n✓ Created binaries for both macOS architectures');
    } else if (platform === 'win32') {
      // Windows
      const url = `${YT_DLP_BASE_URL}/yt-dlp.exe`;
      const dest = path.join(BINARIES_DIR, 'yt-dlp-x86_64-pc-windows-msvc.exe');

      await download(url, dest);
      console.log('\n✓ Downloaded Windows binary');
    } else if (platform === 'linux') {
      // Linux
      const url = `${YT_DLP_BASE_URL}/yt-dlp_linux`;
      const dest = path.join(BINARIES_DIR, 'yt-dlp-x86_64-unknown-linux-gnu');

      await download(url, dest);
      makeExecutable(dest);
      console.log('\n✓ Downloaded Linux binary');
    } else {
      console.error(`Unsupported platform: ${platform}`);
      process.exit(1);
    }

    console.log('\n✅ All binaries downloaded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error downloading binaries:', error.message);
    process.exit(1);
  }
}

await downloadBinaries();
