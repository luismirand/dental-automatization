# Current Project State

Last reviewed: 2026-07-29.

## Current Phase

The project is a production-deployed functional MVP. The public landing,
WebChat, scheduling flow, n8n orchestration, and PostgreSQL persistence have
been validated with synthetic test data.

## Production Topology

```text
GitHub
|-- main -> Vercel production
`-- local-development -> Vercel preview

Vercel
`-- Astro static landing

Oracle Cloud Always Free VM
`-- Coolify
    `-- Docker Compose application
        |-- n8n
        `-- PostgreSQL

External services
|-- Cal.com
|-- DeepSeek
|-- Gemini
`-- OpenRouter
```

## Live and Verified

- Astro 7 landing deployed on Vercel.
- Responsive desktop and mobile interface.
- Mobile WebChat viewport handling for on-screen keyboards.
- Production WebChat webhook over HTTPS.
- Deterministic booking intake in the browser.
- LLM provider routing and controlled fallback in n8n.
- PostgreSQL conversation and message persistence.
- Cal.com embedded scheduling.
- Booking-created, rescheduled, and cancelled webhook processing.
- Cal.com custom-field normalization.
- Private PostgreSQL networking.
- n8n and PostgreSQL health checks.
- Coolify-managed persistent volumes.
- Oracle Cost Analysis reporting no costs for the reviewed period.
- Oracle monthly budget alerts for actual and forecast spending.

## Prepared but Not Activated

- WhatsApp Cloud API workflow and environment inventory.
- Telegram bot workflow and credential integration point.
- SMTP configuration for email notifications.

These channels are not part of the live acceptance criteria until their
provider accounts, production credentials, and end-to-end delivery have been
validated.

## Planned Extensions

- Automated inbound and outbound voice calls.
- Appointment reminders by WhatsApp, Telegram, email, SMS, or voice.
- Human handoff and reception queues.
- CRM synchronization.
- Payment links and payment-status processing.
- Analytics and conversion reporting.
- Multi-clinic configuration.
- Automated off-server backups and scheduled restore tests.

## Known Constraints

- Clinic identity, prices, contact information, and some content remain
  demonstration values.
- The public demo must use synthetic data only.
- LLM availability depends on external providers, quotas, and account limits.
- WhatsApp and Telegram require separate provider activation.
- A single Oracle VM is a shared failure domain for n8n and PostgreSQL.
- Backup restoration still requires a documented production exercise.

## Baseline Validation

```powershell
Set-Location apps/web-landing
npm ci
npm run build

Set-Location ../../infrastructure
docker compose --env-file .env.example config --quiet
docker compose ps
```

Production smoke tests must additionally cover WebChat response and
persistence, Cal.com booking lifecycle synchronization, HTTPS health checks,
and verification that PostgreSQL is not publicly exposed.
