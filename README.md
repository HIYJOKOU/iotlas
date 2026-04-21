# iotlas

Interactive 3D globe for exploring live IOTA validators.

## Project goal

The goal of this task is to build a responsive web application inspired by modern network explorers, using live validator data from the IOTA and presenting it in an interactive way.

## Planned architecture

The project is organized as a lightweight monorepo:

- `client/` – React + Vite + TypeScript frontend
- `server/` – Express + TypeScript backend acting as a data layer / proxy for @iota/sdk

## Requirements

- Node.js 22+

## Tech stack

Frontend:

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Jotai
- Ky
- react-globe.gl
- Three.js

Backend:

- Node.js
- Express
- TypeScript

## Environment

Client env file:

- `client/.env.example`

Variable:

```bash
VITE_API_URL=http://localhost:3001
```

Backend env file:

- `server/.env.example`

Variables:

```bash
PORT=3001
IOTA_MAINNET_RPC_URL=https://api.mainnet.iota.cafe:443
IOTA_TESTNET_RPC_URL=https://api.testnet.iota.cafe:443
IOTA_DEVNET_RPC_URL=https://api.devnet.iota.cafe:443
```

## Data flow

- frontend calls `/api/:network/home` via a Ky client
- network is selected in the UI and stored in a Jotai atom
- data fetching and caching is handled by TanStack Query
- backend aggregates and enriches IOTA validator data

## Realtime home feed

The home view uses a WebSocket stream for live network updates.

Client env:

- `VITE_API_URL` - HTTP API base URL
- `VITE_WS_URL` - optional WebSocket base URL override

WebSocket endpoint:

- `/ws/:network/home`

The stream delivers:

- snapshot updates
- checkpoint activity batches
- heartbeat messages
- error events

## Run locally

Install dependencies:

```bash
npm install
npm --prefix client install
npm --prefix server install
```

Start frontend:

```bash
npm run dev:client
# alias:
npm run client:dev
```

Start backend:

```bash
npm run dev:server
# alias:
npm run server:dev
```
