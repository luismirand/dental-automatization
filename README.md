# Dental Clinic Automation System

> **Agency-as-a-Service Architecture**

A production-oriented monorepo that demonstrates an end-to-end automation platform for dental clinics. The system centralizes patient acquisition from a web landing page and WhatsApp, automates appointment scheduling through Cal.com, and stores patient information in PostgreSQL using a scalable, low-code architecture powered by n8n.

---

## Overview

This project is designed to streamline the patient acquisition and appointment booking process while reducing the operational workload of front-desk staff.

The architecture combines a modern frontend, workflow automation, AI-assisted conversations, and centralized data management into a single platform that can be easily extended or customized for different clinics.

### Core Features

- **Omnichannel Patient Acquisition**
  - Interactive web landing page
  - WhatsApp conversational assistant
  - Unified patient onboarding experience

- **AI-Powered Automation**
  - LLM-assisted conversations
  - Automated lead qualification
  - Intelligent appointment scheduling

- **Workflow Orchestration**
  - Built with **n8n**
  - No-code/low-code automation
  - Easy integration with external services

- **Appointment Management**
  - Automated scheduling through **Cal.com**
  - Calendar synchronization
  - Booking confirmation workflows

- **Centralized Data Storage**
  - PostgreSQL database
  - Patient records
  - Appointment history
  - Interaction logs

---

# Architecture

The platform is composed of four main layers:

1. **Frontend**
   - Astro
   - Tailwind CSS v4
   - React Islands

2. **Automation Layer**
   - n8n workflows
   - AI integrations
   - Business logic orchestration

3. **Scheduling**
   - Cal.com API
   - Automated appointment creation

4. **Persistence**
   - PostgreSQL
   - Relational data model
   - Audit and interaction history

---

# Repository Structure

```text
.
├── apps/
│   └── web-landing/
│       ├── src/
│       ├── public/
│       └── ...
│
├── infrastructure/
│   ├── docker-compose.yml
│   ├── postgres/
│   ├── n8n_workflows/
│   └── ...
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   └── calcom.md
│
├── scripts/
│
└── README.md
```

## Directory Description

### `apps/web-landing`

Frontend application developed with:

- Astro
- Tailwind CSS v4
- React

Includes:

- Responsive landing page
- Interactive UI components
- Appointment selection interface
- Service presentation
- Lead generation forms

---

### `infrastructure`

Infrastructure configuration for local development.

Includes:

- Docker Compose
- PostgreSQL
- n8n
- Database initialization scripts
- Environment configuration

---

### `infrastructure/n8n_workflows`

Contains the workflow definitions responsible for:

- WhatsApp message processing
- AI conversation flows
- Patient registration
- Appointment scheduling
- Database synchronization
- External integrations

---

### `docs`

Technical documentation covering:

- System architecture
- Database schema
- API integrations
- Deployment guides
- Development notes

---

### `scripts`

Utility scripts for:

- Deployment
- Maintenance
- Environment setup
- Development automation

---

# Technology Stack

## Frontend

- Astro
- React
- Tailwind CSS v4
- TypeScript

## Backend & Automation

- n8n
- AI / LLM Integration
- Cal.com API

## Database

- PostgreSQL

## Infrastructure

- Docker
- Docker Compose

---

# Prerequisites

Before running the project, make sure the following software is installed:

- Node.js 18+
- npm
- Docker
- Docker Compose
- Git

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

---

## 2. Run the Frontend

Navigate to the frontend application:

```bash
cd apps/web-landing
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 3. Start the Infrastructure

Navigate to the infrastructure directory:

```bash
cd infrastructure
```

Copy the environment variables:

```bash
cp .env.example .env
```

Start all services:

```bash
docker compose up -d
```

---

## 4. Import n8n Workflows

Open your local n8n instance and import the workflow JSON files located in:

```text
infrastructure/n8n_workflows/
```

These workflows enable:

- WhatsApp automation
- AI processing
- Cal.com integration
- PostgreSQL persistence

---

# Development Workflow

1. Start PostgreSQL and n8n using Docker.
2. Launch the Astro frontend.
3. Import or update n8n workflows.
4. Configure API credentials.
5. Test the complete patient journey.

---

# Project Goals

- Automate patient acquisition.
- Reduce manual administrative tasks.
- Improve appointment conversion rates.
- Centralize patient information.
- Provide a scalable automation platform for dental clinics.

---

# Future Improvements

- Multi-clinic support
- CRM integration
- Payment gateway integration
- Automated reminders
- Analytics dashboard
- Multi-language support
- Voice AI integration
- Role-based access control

---

# License

This project is provided as a demonstration of an Agency-as-a-Service architecture for workflow automation in dental clinics. Customize and extend it according to your project's requirements.
