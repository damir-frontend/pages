# Demo Pages Application

Live demo hosted on GitHub Pages: [https://damir-frontend.github.io/pages/](https://damir-frontend.github.io/pages/)

## Overview

This project demonstrates a **tab-based page system** implemented in React, featuring **state persistence via `localStorage`** to prevent crashes and memory overload. Users can:

- Add new pages
- Delete existing pages
- Navigate between pages
- (Future) Enable a presentation mode

The system is designed for a **demo mode** where users can interact with pages safely without losing state on reload.

## Features

- **Dynamic Page Management:** Add or delete pages on the fly.
- **Current Page Highlighting:** Active page is visually marked.
- **State Persistence:** All page states are saved in `localStorage` to prevent data loss.
- **Extensible UI:** Placeholder for presentation mode, ready to expand functionality.
- **Responsive UI Components:** Buttons and controls are visually aligned with pages.

## Project Structure

```text
pages/
├─ dist/                  # Production build output
├─ public/                # Static assets
├─ src/
│ ├─ app/
│ │ ├─ shared/utils/      # Shared utility functions
│ │ └─ utils/             # App-wide helpers (storage, zustand store)
│ ├─ App.tsx              # Root app component
│ ├─ assets/              # Images, icons, SVGs
│ ├─ main.tsx             # Entry point
│ └─ pages/
│ ├─ consts.ts            # Constants like MAX_PAGES
│ ├─ model.ts             # Zustand-like page store
│ ├─ page-add/            # Add page button
│ ├─ page-delete/         # Delete page button
│ ├─ page-menu/           # Navigation menu
│ ├─ presentation-button/ # Presentation mode button
│ ├─ styles.module.scss   # Shared page styles
│ ├─ ui.tsx               # Main Pages component
│ └─ utils.ts             # Helper functions for pages
└─ vite.config.ts         # Vite configuration
```

## Getting Started

### Install Dependencies

```bash
npm install
```
Run Locally

```bash
npm run dev
```

Open [http://localhost:5173/pages/](http://localhost:5173/pages/)

### Build & Deploy

```bash
npm run build
npm run deploy
```

This will deploy the dist/ folder to GitHub Pages.

### Technical Notes

- Built with **React 18**, **TypeScript**, and **Vite**
- Uses **Zustand** for state management
- Presentation mode is currently a placeholder for future enhancement
- Tab system persists state via `localStorage` to prevent crashes and memory overload
