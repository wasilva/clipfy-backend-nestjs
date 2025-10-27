Clipefy API (MVP)

Health
- GET `/health` → `{ status }`

Ingest
- POST `/ingest`
  - body: `{ source_url: "https://..." }`
  - 200: `{ job_id, status }`

Jobs
- GET `/jobs/{job_id}` → `{ job_id, status, error? }`
- GET `/jobs/{job_id}/clips` → `[ { id, start_sec, end_sec, caption, aspect } ]`

Publish (stub)
- POST `/publish`
  - body: `{ job_id, platforms: ["youtube_shorts"|"tiktok"|"instagram_reels", ...] }`
  - 200: `{ job_id, published: { platform: mock_url } }`

Notes
- Replace BackgroundTask with queue (Redis/RQ) for production
- Add auth (JWT), rate limits, and tenant scoping

