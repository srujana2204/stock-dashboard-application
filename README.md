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

