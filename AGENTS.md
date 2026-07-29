# Repository Guidelines & AI Agent Rules

## Project Scope

Sistema de automatización para una clínica dental ("Agency-as-a-Service").
Permite captar y atender pacientes desde la landing web, WebChat, WhatsApp y
Telegram, centralizando datos en PostgreSQL y la agenda en Cal.com mediante n8n.

## Monorepo Layout

```text
/
├── apps/
│   └── web-landing/        # Astro + Tailwind CSS frontend
├── infrastructure/         # Docker Compose, PostgreSQL and n8n
├── docs/                   # Architecture, database and operating docs
└── scripts/                # Maintenance and workflow utilities
```

## Collaboration Workflow

1. **Align first**: Before implementing a requested functional block, agree
   with the user on objective, scope, material decisions, constraints and
   acceptance criteria. Ask all discoverable blocking questions together at
   the beginning.
2. **Execute continuously**: Once aligned, inspect, implement, validate and
   report the smallest complete solution without pausing for routine
   implementation choices.
3. **Pause only when necessary**: Ask again only if new information would
   materially change the agreed result, credentials or external authorization
   are required, production would be mutated, or an action is destructive.
4. **One block at a time**: Complete and validate one vertical functional block
   before starting another. Do not expand into unrelated improvements.
5. **Finish with evidence**: Report changed files, validations run, results and
   any remaining risk. Do not claim completion when the end-to-end acceptance
   criteria were not verified.

## Security & Secrets

1. Never put credentials, tokens or patient data in source files, prompts,
   logs, commits or documentation.
2. Runtime secrets live in untracked `.env` files within `infrastructure/` or
   in the production platform's secret store.
3. Keep PostgreSQL private; do not expose port 5432 publicly.
4. Use least-privilege credentials and read-only access for diagnostics where
   possible.
5. Never use real patient data in development, fixtures, screenshots or tests.

## Canonical Commands

Run commands from the repository root unless a working directory is shown.

```powershell
# Install frontend dependencies reproducibly
Set-Location apps/web-landing
npm ci

# Start frontend development server
npm run dev

# Validate the production frontend build
npm run build

# Validate Docker Compose configuration
Set-Location ../../infrastructure
docker compose config --quiet

# Start and inspect local infrastructure
docker compose up -d
docker compose ps
docker compose logs --tail 200
```

## Version Control

1. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`,
   `refactor:`, `test:`).
2. Preserve unrelated user changes in a dirty worktree.
3. Do not commit or push unless the user requests it.
