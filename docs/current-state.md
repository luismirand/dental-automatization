# Current Project State

Last reviewed: 2026-07-29.

This file is the concise operational snapshot of the repository. Detailed
design remains in the other files under `docs/`.

## Current Phase

The project is an advanced functional MVP. The main components exist and the
landing builds successfully, but the complete patient journey has not yet been
verified end to end in a production environment.

## Implemented

- Astro 7 static landing with React islands and Tailwind CSS.
- Responsive clinic sections, WhatsApp calls to action and location links.
- Embedded Cal.com scheduling.
- WebChat widget connected to an n8n webhook.
- Versioned n8n workflows for WebChat, WhatsApp, Telegram and Cal.com booking
  events.
- LLM provider routing through DeepSeek, Gemini and OpenRouter.
- PostgreSQL schema for leads, conversations, messages and appointments.
- Appointment classification migration.
- Docker Compose stack for PostgreSQL and n8n.
- Deployment guidance for Coolify and Meta webhook setup.

## Known Gaps

- Clinic identity, contact details, doctors, prices and some links still include
  demonstration values.
- Imported workflows may require credential reassignment in a new n8n instance.
- The anti-race strategy described for simultaneous messages needs end-to-end
  verification.
- Database migrations, backups and restore procedures need production
  validation.
- Documentation does not yet describe every implemented channel and fallback.
- Oracle, Coolify and Vercel deployment, monitoring and smoke tests are not
  complete.

## Target Low-Cost Architecture

```text
GitHub
  └── Coolify self-hosted on a free/low-cost VM
        ├── n8n
        ├── PostgreSQL (private network only)
        └── Astro landing

Cloudflare Free
  ├── DNS
  ├── CDN / proxy
  └── Universal SSL

External services
  ├── Cal.com Individual
  ├── WhatsApp Cloud API
  └── LLM providers with explicit usage limits
```

## Recommended Vertical Blocks

1. **WebChat**: landing → n8n → LLM → PostgreSQL → browser response.
2. **Scheduling**: conversation → Cal.com → PostgreSQL → confirmation.
3. **WhatsApp**: Meta webhook → n8n → LLM → reply → persisted history.
4. **Production**: configuration → deployment → DNS/SSL → backup → smoke test.

Each block must be aligned at the beginning and then implemented and validated
continuously against its acceptance criteria.

## Baseline Validation

```powershell
Set-Location apps/web-landing
npm ci
npm run build

Set-Location ../../infrastructure
docker compose config --quiet
docker compose ps
```

The Docker engine must be running before the infrastructure status check.
