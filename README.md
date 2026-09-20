# One-Click Image Downloader

![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A Chrome extension for quickly building image classification datasets from Google Images. Toggle it on, right-click any image, and it downloads instantly — auto-sorted into a folder and numbered by your search query, no save dialog required.

## Why

Building an image dataset by hand (right-click → "Save image as" → pick a folder → rename) is slow when you need hundreds of labeled examples. This extension skips the dialog entirely: right-click an image while browsing Google Images and it's saved straight into a per-class subfolder with a sequential filename, ready to feed into a classifier.

## Features

- **One-click download** — right-click an image to save it immediately, no context menu or save dialog
- **Auto-folder naming** — subfolder defaults to your Google search query (lowercased, spaces → underscores), so each class gets its own folder automatically
- **Auto-file naming** — files are named `<query>_001.jpg`, `<query>_002.jpg`, etc., with the counter tracked per class
- **Manual overrides** — set a custom subfolder and/or filename from the popup when you don't want the search query used
- **Counter reset** — reset all numbering back to `001` from the popup
- **On/off toggle** — enable only when you want it; badge shows ON/OFF at a glance

## Installation

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this project folder

## Usage

1. Click the extension icon and check **Enable Downloader**
2. Optionally set a custom **Download Subfolder** or **Custom Filename**; leave either blank to auto-derive it from your search query
3. Click **Save Settings**
4. Go to [Google Images](https://images.google.com), search for a class (e.g. `golden retriever`), and right-click any result to download it instantly
5. Use **Reset All Counters** in the popup to restart numbering at `001`

Downloads land in `<Downloads>/<folder>/<filename>_<counter>.<ext>`.

## How it works

- `content.js` listens for right-clicks on images on any page, and when the extension is active, intercepts the default context menu and locates the clicked image's URL
- It reads the current Google search query from the search box (or the URL's `q` parameter) and messages the background script
- `background.js` resolves the folder/filename (manual settings take priority, otherwise the search query), increments a per-class counter in `chrome.storage.local`, and triggers the download via the `chrome.downloads` API
- `popup.js`/`popup.html` provide the settings UI for the on/off toggle, folder/filename overrides, and counter reset

## Permissions

- `downloads` — to save images directly without a save dialog
- `storage` — to persist settings and per-class counters

## License

[MIT](LICENSE)
