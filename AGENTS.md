# Repository Guidelines & AI Agent Rules

## Project Scope
Sistema de automatización para una clínica dental ("Agency-as-a-Service").
Permite agendamiento de citas desde Web Landing o Bot de WhatsApp con atención mediante LLM, centralizando datos en PostgreSQL y agenda en Cal.com.

## Monorepo Layout
```text
/
├── apps/
│   └── web-landing/        # Astro + Tailwind CSS Frontend
├── infrastructure/         # Docker Compose, PostgreSQL & n8n stack
├── docs/                   # System architecture and database specifications
└── scripts/                # Utility & deployment scripts
```

## Work Rules
1. **Block-by-block Execution**: Do not implement code without user alignment on the block specification.
2. **Security & Secrets**: Never put credentials in source files. All secrets live in `.env` files within `infrastructure/`.
3. **Commit Messages**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
