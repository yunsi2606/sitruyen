# Universal Manga Scraper Tool

A powerful, standalone tool to scrape manga chapters from any website, handling infinite scroll, lazy loading, and anti-bot measures.

## 🚀 Quick Start (Windows)

1. **Run the Tool**: Double-click `run_tool.bat` in this folder.
   - Or run `npm install` then `npm start` in your terminal.
2. **Open UI**: Go to [http://localhost:5173](http://localhost:5173) in your browser.

## ✨ Features

- **Universal Support**: Works on almost any manga site thanks to smart heuristics.
- **Headless Toggle**: Switch between background mode (fast) and visible mode (for debugging or manual CAPTCHA solving).
- **Infinite Scroll**: Automatically scrolls to load dynamic content.
- **Anti-Bot Bypass**: Uses **Browser-Native Fetch** within the page context to download images. This ensures 100% accurate headers, cookies, and referers, effectively bypassing strict 403 Forbidden checks on protected CDNs.
- **Output Management**: Downloads images to your specified directory.
- **Real-time Logs**: See exactly what the scraper is doing.

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS (Premium Dark UI)
- **Backend**: Node.js + Express + Socket.IO
- **Scraping Engine**: Playwright (best-in-class browser automation)

## ⚠️ Note

- If a site blocks the scraper, switch "Headless" mode to **Visible** in the UI. This allows you to solve CAPTCHAs manually if needed.
- `Output Directory` defaults to `C:/MangaOutput`. Ensure you have write permissions.
