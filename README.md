# iotlas

Interactive 3D globe for exploring live IOTA validators.

## Project goal

The goal of this task is to build a responsive web application inspired by modern network explorers, using live validator data from the IOTA and presenting it in an interactive way.

## Planned architecture

The project is organized as a lightweight monorepo:

- `client/` – React + Vite + TypeScript frontend
- `server/` – Express + TypeScript backend acting as a data layer / proxy for IOTA JSON-RPC
