# Mousewheel Zoom

An [Obsidian](https://obsidian.md) plugin that lets you zoom editor and preview text with **Ctrl+mousewheel** (Cmd+mousewheel on Mac).

## Features

- **Ctrl+scroll** (or Cmd+scroll on Mac) to zoom in and out
- Works in both **editor** and **reading** (preview) mode
- Zoom range: 50%–200%
- Settings tab with slider and reset button
- Commands: Zoom in, Zoom out, Reset zoom

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
- **Reset:** Use the "Reset zoom" command or the button in Settings

## Development

- Clone this repo
- `npm install`
- `npm run dev` for watch mode
- `npm run build` for production build

### Deploying to Vault

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
