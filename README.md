Clipefy MVP

Overview
- Goal: Automate cutting long videos into short, subtitled clips, and prepare for cross-posting (Reels/Shorts/TikTok) with basic analytics.
- This repository contains a minimal, end-to-end skeleton to iterate quickly: a NestJS backend at the repo root with async job simulation and AI/processing stubs. A FastAPI prototype is also included for reference. Frontend and full infra can be added next.

What’s Included
- Backend API (NestJS preferred): upload/ingest by source URL, job tracking, clip list, and publish stub
- Alternative prototype (FastAPI) kept for reference
- AI/Processing stubs: placeholders for highlights, transcription, and formatting
- Docs: MVP scope, backlog, APIs

Backend (NestJS) – Quick Start
1) Node.js 18+
2) From repo root: `npm install`
3) Dev: `npm run start:dev` (http://localhost:3000)
4) Endpoints: see docs/api.md (paths idênticos: /health, /ingest, /jobs/:id, /jobs/:id/clips, /publish)

Queue (Redis) via Docker Compose
- Start Redis locally: `docker compose up -d redis`
- Export REDIS_URL so BullMQ is enabled: `REDIS_URL=redis://localhost:6379/0`
- Start the API as usual (`npm run start:dev`). When `REDIS_URL` is set, the background jobs are processed by BullMQ instead of the in-memory fallback.

Standardized Error Responses
- Errors are formatted as JSON: `{ statusCode, message, error, path, timestamp }`
- Validation errors from DTOs appear under `message` as a string or array.

PostgreSQL (TypeORM)
- Start Postgres locally: `docker compose up -d postgres`
- Configure DB connection only via `.env` (copie de `.env.example`). Ex.: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/clipefy`.
- As credenciais (usuário/senha/host/porta/db) são lidas do `.env`. Não há valores padrão no código.
- TypeORM está com `synchronize: true` em desenvolvimento; cria as tabelas ao subir.
- Serviços persistem e leem do banco:
  - Users stored in `users` (Auth/Register/Login/JWT)
  - Jobs stored in `jobs`; generated clips in `clips`

Frontend (Next.js)
- App em `frontend/` rodando em `http://localhost:3001` por padrão.
- Variável de ambiente: configure `frontend/.env.local` a partir de `.env.local.example` (ex.: `NEXT_PUBLIC_API_URL=http://localhost:3000`).
- Scripts:
  - `cd frontend && npm install`
  - `npm run dev` (abre em `http://localhost:3001`)
- Telas implementadas:
  - Landing page (`/`) com header fixo e seções: Home, Produto, Planos; botões navegam para as seções; botão Login vai para `/login`.
  - Login (`/login`) com link “Cadastre-se” para `/register`.
  - Registro (`/register`).
  - Área do usuário (`/dashboard`), protegida por JWT: cria job via URL, acompanha status, lista clips e publica (stub) em plataformas.

Alternative (FastAPI prototype)
1) Python 3.10+
2) `cd backend`; create venv and `pip install -r requirements.txt`
3) `uvicorn app.main:app --reload` (http://localhost:8000/docs)

Key Decisions
- NestJS for the main backend (structured modules, DI, easy growth)
- Background job simulation via setTimeout (swap to Bull/Redis later)
- In-memory store for MVP demo; migrate to Postgres + Redis for production

Next Steps
- Add BullMQ + Redis queue and Postgres persistence (Nest)
- Integrate Whisper for PT-BR transcription and auto-captions
- Add FFmpeg-based formatting for 9:16/1:1/16:9 and burned-in captions
- Add OAuth (Google/YouTube, Meta, TikTok) and real publish flows
- Scaffold Next.js dashboard (upload, preview, publish, metrics)
