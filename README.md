# ERP-Veritas
Enterprise resource planning system


A modular ERP system designed for manufacturing units producing buttons & apparel accessories.

ERP-Veritas is a fully custom ERP being developed with a modular architecture.
It begins with a local/LAN deployment and later extends towards cloud readiness.

This repository contains:

Django backend (modular, API-first)

React frontend (planned)

Documentation & architecture

Future infrastructure templates

🚀 Project Goals

Build an ERP that fits real manufacturing workflows.

Keep every module independent and extensible.

Start locally → usable over LAN/WiFi → cloud migration later.

Clean API architecture to support future mobile apps.

Maintain transparent documentation and structure.

📦 Repository Structure
ERP-Veritas/
│
├── backend/                ← Django backend (11 modules planned)
├── frontend/               ← React frontend (planned)
├── docs/                   ← Documentation, schemas, diagrams
├── infra/                  ← Deployment templates (later)
├── sample-data/            ← Sample CSV/JSON for testing (later)
├── scripts/                ← Utility scripts (optional later)
│
├── .env.example            ← Environment variables (no secrets)
└── README.md               ← You are here

🧩 Modules Overview

ERP-Veritas consists of 11 modules:

Product Master

Customer & Sales

Production

Packing

Finished Goods Stock

Dispatch

Invoice & Payments

Purchase & Raw Materials

Users & Access Control

Reporting

Backup System

Each module will be implemented inside the backend as a separate Django app.

🔧 Technology Stack

Backend: Django + Django REST Framework
Database: PostgreSQL
Frontend: React (later)
Authentication: JWT / Django Auth
Storage: Local media folder → S3-ready design
Deployment: Docker (local), future cloud templates in /infra

🛠️ Development Workflow

Initial scaffold pushed directly to main

All future work uses feature branches

Pull request required for merging into main

Branch naming:

feature/<name>/<task>
fix/<name>/<issue>


Commit message guideline:

type(scope): short description

📄 Documentation

All project documentation lives in /docs, including:

Final ERP Schema

API contract plans

ER diagrams

Architecture overview

Developer onboarding guide

Naming conventions

🧪 Local Setup (High-Level Only)

A detailed onboarding guide will be added later.
For now, local setup includes:

Clone the repo

Create a Python virtual environment

Install dependencies (later)

Configure environment variables using .env.example

Run backend and frontend in development mode

(Actual code/commands will be added when backend initialization begins.)

🧭 Roadmap (Phase 0 → Phase 1)

Phase 0: Create structure, README, docs folder, environment plan

Phase 1: Backend initialization + User module + Product Master

Phase 2: Customer & Sales Order pipeline

Phase 3: Production → Packing → Stock

Phase 4: Dispatch → Invoicing → Payments

Phase 5: Purchases & Raw Materials

Phase 6: Reporting

Phase 7: LAN-ready deployment

🤝 Contributing

This is a private/internal project.
Contributors must follow:

Feature-branch workflow

Code review guidelines

Documentation updates per change

📝 License

No license added yet (private/internal use).