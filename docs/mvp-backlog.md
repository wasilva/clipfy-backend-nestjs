Clipefy MVP Backlog (MoSCoW)

Must-Have
- Ingest by URL (YouTube/VOD) and create job
- Auto highlights detection (baseline heuristic)
- Auto captions (PT-BR, stub -> Whisper)
- Clip formatting target (9:16) and metadata
- Publish stub to platforms (replace with APIs)
- Dashboard endpoints: job status, clips list

Should-Have
- Auth (JWT) and multi-tenant accounts
- Plans: Starter/Pro/Agency (limits, quotas)
- Basic metrics per clip (views/likes placeholders)

Could-Have
- Manual fine-tuning of clip windows
- Brand templates (lower-third, frame, fonts)
- Scheduling and multi-post

Won’t (MVP)
- Advanced analytics (cohorts, retention)
- Full marketplace for clipadores

Epics
- EP1 Ingest & Storage
- EP2 AI Pipeline (highlights + captions)
- EP3 Clip Formatting & Export
- EP4 Publishing Integrations
- EP5 Dashboard API & Auth
- EP6 Billing & Plans

Milestones
- M0 Prototype API (current): ingest, jobs, clips, publish stub
- M1 Real AI (Whisper), FFmpeg formatting, Redis queue
- M2 OAuth + platform posting + quotas
- M3 Basic analytics + dashboard UI

