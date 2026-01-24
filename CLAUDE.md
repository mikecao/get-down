# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

get-down is a desktop download tool built with Tauri v2, React 19, and Vite. It uses yt-dlp as an external binary to handle media downloads from various websites.

## Development Commands

```shell
# Download yt-dlp binaries (required before first build)
pnpm download-binaries

# Install dependencies
pnpm install

# Development mode (runs both Vite dev server and Tauri)
pnpm dev

# Production build
pnpm build

# Linting and formatting (uses Biome)
pnpm lint
pnpm format
pnpm check
```

## Architecture

### Tauri Backend (`src-tauri/`)
- `main.rs` - Minimal Tauri setup with dialog and shell plugins
- `tauri.conf.json` - App configuration, bundles yt-dlp as external binary via `externalBin`
- `binaries/` - Platform-specific yt-dlp executables (downloaded via `pnpm download-binaries`)

### React Frontend (`src/`)
- `App.tsx` - Main component managing download state with Immer for immutable updates
- `components/Download.tsx` - Core download logic: spawns yt-dlp via `Command.sidecar()`, parses stdout for progress/speed/size
- `components/` - UI components (DropZone, Search, SavePath, Downloads, ProgressBar, Button)
- `lib/constants.ts` - Status constants (LOADING, DOWNLOADING, COMPLETE, ERROR)

### Key Patterns
- Path alias: `@/` maps to `src/`
- CSS Modules for component styling
- Download state tracked per-item with status, progress, speed, size
- yt-dlp stdout parsed with regex to extract download progress info

### Build Targets
MSI (Windows), DMG/APP (macOS), AppImage (Linux)

## Git Workflow

Always ask for confirmation before committing or pushing changes.
