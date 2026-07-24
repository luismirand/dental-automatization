# System Architecture Specification

## Overview

System Architecture for Dental Clinic Automation System ("Agency-as-a-Service").

```
                              ┌─────────────────────────┐
                              │    Astro Web Landing    │
                              │  (Widget Embed Cal.com) │
                              └────────────┬────────────┘
                                           │
                                           ▼
┌──────────────────┐           ┌─────────────────────────┐           ┌──────────────────┐
│  WhatsApp Cloud  │ ────────> │      n8n Orchestration  │ <───────> │  Cal.com API     │
│       API        │ Webhook   │    (Workflows + LLM)    │           │ (Availability &  │
└──────────────────┘           └────────────┬────────────┘           │  Appointments)   │
                                            │                        └──────────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │   PostgreSQL Database   │
                               │  (Leads + Session State)│
                               └─────────────────────────┘
```

## Core Components

### 1. Web Landing (`/apps/web-landing`)
- **Technology**: Astro + Tailwind CSS.
- **Responsibility**: High-converting presentation hero section, dental services overview, direct scheduling widget embed powered by Cal.com.

### 2. Orchestrator (`/infrastructure` - n8n)
- **Technology**: n8n containerized service.
- **Responsibility**:
  - Webhook listener for WhatsApp incoming messages.
  - State check & history retrieval from PostgreSQL.
  - LLM invocation with compressed prompt context.
  - Booking & availability queries to Cal.com API.
  - Human handoff routing when requested by the patient.

### 3. State & Leads Storage (`/infrastructure` - PostgreSQL)
- **Technology**: PostgreSQL 16 Alpine.
- **Responsibility**:
  - Lead contact persistence.
  - Conversation session state tracking (active stage, intent, human handoff status).
  - Short-term chat history storage to maintain natural LLM memory while capping context window usage.

### 4. Calendar Provider (External API - Cal.com)
- **Technology**: Cal.com REST API v1/v2 & Web Embed.
- **Responsibility**: Source of truth for dentist availability, slot reservation, and appointment confirmation notifications.

## Key Communication Protocols
- **WhatsApp Webhook -> n8n**: HTTP POST via HTTPS tunnel (Ngrok / reverse proxy).
- **n8n -> PostgreSQL**: TCP via internal Docker bridge network (`n8n-network:5432`).
- **n8n -> Cal.com API**: HTTPS REST API (`https://api.cal.com/v1`).
- **n8n -> LLM API**: HTTPS REST calls to LLM provider (OpenAI / Anthropic).
