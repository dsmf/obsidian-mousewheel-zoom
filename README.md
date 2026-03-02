# Mousewheel Zoom

An [Obsidian](https://obsidian.md) plugin that lets you zoom editor and preview text with **Ctrl+mousewheel** (Cmd+mousewheel on Mac).

## Features

- **Ctrl+scroll** (or Cmd+scroll on Mac) to zoom in and out
- **Zoom mode** – per-pane (default): zoom only the pane under cursor; everywhere: zoom all panes at once
- Works in **editor**, **reading** (preview), **file explorer**, **search results**, **backlinks**, **outline**, and **tag pane**
- Zoom range: 50%–200%
- Commands: Zoom in, Zoom out, Reset zoom, Reset zoom (all panes)

## Installation

### From Obsidian (Community Plugins)

1. Open **Settings** → **Community plugins** → **Browse**
2. Search for "Mousewheel Zoom" and install
3. Enable the plugin

### Manual installation

Copy `main.js`, `styles.css`, and `manifest.json` to your vault:

```
VaultFolder/.obsidian/plugins/obsidian-mousewheel-zoom/
```

## Usage

- **Zoom in:** Hold Ctrl (or Cmd on Mac) and scroll up
- **Zoom out:** Hold Ctrl (or Cmd on Mac) and scroll down
- **Per-pane mode (default):** Zoom applies only to the pane under your cursor
- **Everywhere mode:** Zoom applies to all panes at once (set in Settings)
- **Reset:** Use "Reset zoom" for the active pane, or "Reset zoom (all panes)" / Settings button

## Development

- Clone this repo
- `npm install`
- `npm run dev` for watch mode
- `npm run build` for production build

### Deploying to Test Vault

Set the `VAULT` environment variable to your test vault path, then run:

```bash
npm run deploy
```

On Windows (PowerShell):

```powershell
$env:VAULT = "C:\Path\To\Your\Vault"
npm run deploy
```

This builds the plugin and copies `main.js`, `manifest.json`, and `styles.css` to `VAULT/.obsidian/plugins/obsidian-mousewheel-zoom/`.

## Releasing

- Update `manifest.json` version
- Update `versions.json` with `"plugin-version": "min-obsidian-version"`
- Create a GitHub release and attach `main.js`, `styles.css`, `manifest.json`

## API Documentation

See https://docs.obsidian.md
