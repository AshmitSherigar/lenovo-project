# Lenovo Project Frontend

React dashboard for metrics and alerts.

## Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

Server is proxied to `http://localhost:5000` in `vite.config.js`.

## Features

- Line chart: CPU, memory, power (realtime + history)
- Pie chart: alert severity distribution
- Alert table with latest 50 entries
- Socket.IO live updates from `power-data`

## API routes used

- `GET /api/metrics/history`
- `GET /api/alerts`
- `Socket.IO` event `power-data`
