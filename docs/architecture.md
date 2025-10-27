Architecture Overview (MVP)

Components
- API: FastAPI service handling ingest, jobs, clips, publish
- Processing: Background task (to be replaced by worker service + Redis)
- Storage: In-memory (MVP) → Postgres (jobs/clips), S3 (videos)
- AI: Whisper for PT-BR transcription + highlight heuristics
- Formatting: FFmpeg to cut, scale, pad to 9:16, burn captions
- Publishing: TikTok, Instagram (Meta Graph), YouTube Data APIs

Flow
1) Client calls POST /ingest with source_url
2) API enqueues job and returns job_id
3) Worker downloads source, transcribes (Whisper), detects highlights
4) Worker generates clips and captions; stores artifacts/metadata
5) Client fetches /jobs/{id}/clips and calls /publish
6) Publisher posts to platforms and stores returned IDs

Infra (next)
- Dockerize services; add docker-compose for local
- Add Redis for queue; Grafana/Prometheus for metrics
- CI: Lint, tests, image build, deploy to ECS/GKE

