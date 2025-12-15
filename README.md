# Stock Broker Client Dashboard

A frontend-only **live stock dashboard** built with **React + Vite**.  
Users log in with an email, subscribe to a few supported stocks, and see prices update every second with a live intraday trend chart.

---

## Features

- **Email login only** (no password, no backend; stored in `localStorage`).
- **Per‑user subscriptions** for 5 stocks: `GOOG`, `TSLA`, `AMZN`, `META`, `NVDA`.
- **Live price simulation** using a random‑walk generator updating every second.
- **Intraday trend chart**:
  - Shows last 60 ticks for the selected subscribed stock.
  - Simple SVG line chart with X/Y axes.
- **Light / Dark theme toggle** (persists while the app is open).
- **Clean layout**:
  - Left column: supported stocks with subscribe buttons.
  - Right column: subscribed prices table.
  - Bottom: intraday trend panel.

---

## Tech Stack

- **Frontend:** React 18, Vite
- **Routing:** `react-router-dom`
- **State:** React hooks (`useState`, `useEffect`, `useMemo`)
- **Styling:** Custom CSS (no UI framework)
- **Storage:** `localStorage` for:
  - `currentUser`
  - `subscriptions_<email>`

---

## Getting Started

### 1. Clone and install
git clone <your-repo-url> stock-dashboard
cd stock-dashboard
npm install

text

### 2. Run in development
npm run dev

text

Vite will print a local URL like `http://localhost:5173`.  
Open it in your browser.

---

## How It Works

### Login flow

- User enters an email on the login page.
- Email is validated and stored in `localStorage` as `currentUser`.
- App navigates to `/dashboard`.
- If there is already a `currentUser`, visiting `/login` will redirect to `/dashboard`.

### Dashboard behaviour

- **Supported stocks** are hard-coded: `GOOG`, `TSLA`, `AMZN`, `META`, `NVDA`.
- User can **subscribe/unsubscribe** per stock:
  - Subscriptions are stored under key `subscriptions_<currentUserEmail>`.
- A `setInterval` runs every second:
  - Applies a small random ±2% change to each stock’s price (random walk).
  - Appends the new price to the symbol’s history array (max 60 points).

### Live trend chart

- Clicking a row in the “Subscribed prices” table selects that symbol.
- The SVG chart reads the last 60 prices for the selected symbol and:
  - Normalizes them to fit inside the chart area.
  - Draws a line path with X/Y axes and min/max price labels.
- X‑axis text: `Time → (last 60 ticks)`.

---

## Light & Dark Mode

- Theme is managed at the app level (`theme-dark` / `theme-light` on root).
- A “Light mode / Dark mode” pill appears:
  - On the login card.
  - On the dashboard header.
- CSS uses `.app-root.theme-light` overrides to:
  - Switch backgrounds, panels, and text colors.
  - Adjust chart colors and subscribed row highlights.

---
## Project Structure (key files)

src/
├── main.jsx # Vite + React entry, wraps App in BrowserRouter
├── App.jsx # Routes + theme state
├── styles.css # All global, dashboard, and chart styles
├── pages/
│ ├── LoginPage.jsx # Email login screen
│ └── DashboardPage.jsx # Shell layout + header + logout
└── components/
└── StockDashboard.jsx # Stock logic, subscriptions, table, trend chart
---

## Customization

- **Change supported tickers:**  
  Edit the `SUPPORTED_STOCKS` array in `StockDashboard.jsx`.

- **Change volatility / speed:**  
  Tweak `maxMovePercent` or the `setInterval` delay inside `tickPrice` / the update effect.

- **Reset data:**  
  Click **Logout** (clears `localStorage`) or manually clear site data from your browser.

---

## Notes

- All stock prices and trends are **simulated**, not real market data.
- The app is intentionally **frontend-only** for easy deployment on static hosts (Vercel, Netlify, GitHub Pages, etc.).


