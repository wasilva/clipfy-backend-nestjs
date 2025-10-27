Clipefy MVP Specification

Goal
- Automate generation of short, subtitled clips from long-form videos and publish across TikTok/Instagram Reels/YouTube Shorts, starting with PT-BR focus.

Personas
- Creator: solo creator seeking growth without manual editing
- Agency: manages multiple creators/channels at scale
- Clipador: power user producing clips for clients (phase 2)

Core User Stories (MVP)
- As a user, I submit a video URL to create a processing job
- As a user, I see job status and resulting clips with start/end and captions
- As a user, I select targets (TikTok/Reels/Shorts) and publish
- As an admin, I view basic metrics (placeholder) for each clip

Acceptance Criteria
- Ingest accepts a valid URL and returns a job id
- Processing creates ≥3 candidate clips with PT-BR captions
- Clips carry aspect=9:16 metadata and are ready to export
- Publish endpoint returns per-platform IDs/URLs (stub in MVP)

Out of Scope (MVP)
- Full auth and billing, advanced analytics, marketplace

Architecture (MVP)
- FastAPI backend exposing HTTP endpoints and background task processing
- Processing pipeline with stubs for highlights and captions (replace by Whisper/FFmpeg)
- In-memory storage for demo; swap to Postgres + Redis in M1

Data Model (initial)
- Job { id, status: queued|processing|completed|failed, source_url, error? }
- Clip { id, job_id, start_sec, end_sec, caption, aspect }

Risks & Mitigations
- Platform API changes → use official SDKs and isolate adapters
- Cost of AI transcription → batch, caching, selective processing
- PT-BR quality → Whisper large-v3/finetuning and prompt engineering

Next Milestones
- M1: Redis queue, FFmpeg formatting, Whisper captions (PT-BR)
- M2: OAuth + publish to TikTok/Meta/YouTube, quotas
- M3: Basic analytics and Next.js dashboard

