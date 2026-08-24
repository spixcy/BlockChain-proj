# SIH26183 — Real-Time Crypto Fraud Attribution System

A blockchain intelligence platform that takes a victim-reported cryptocurrency wallet address, traces on-chain fund flow, clusters related addresses, and identifies the nearest known exchange/VASP with a confidence score and risk tier — built for cyber fraud investigators.

Built for Smart India Hackathon 2026, Problem Statement **SIH26183** (Ministry of Home Affairs / Indian Cyber Crime Coordination Centre, I4C).

---

## What it does

1. An investigator (or the mock NCRP intake form) submits a suspect wallet address + chain + fraud type.
2. The clustering engine applies chain-specific heuristics to group co-controlled addresses and traces fund flow 2-3 hops downstream.
3. The attribution engine matches the cluster against a seeded VASP/exchange registry (GraphSense TagPacks) and returns a confidence-scored, risk-tiered result with human-readable reasoning.
4. The result renders as a navigable fund-flow graph in the dashboard, and can be exported as a standardized investigation report.
5. Mock SAHYOG/NCRP adapters demonstrate how this would plug into the real government systems.

---

## Architecture

```
                        ┌─────────────────────┐
                        │   Next.js Frontend    │
                        │  (dashboard, graph,   │
                        │   report export)      │
                        └──────────┬───────────┘
                                   │ REST
                        ┌──────────▼───────────┐
                        │  Spring Boot API      │
                        │  (cases, complaints,  │
                        │   auth, audit log)    │
                        └──────┬────────┬───────┘
                               │        │
                 ┌─────────────▼──┐  ┌──▼─────────────────┐
                 │ FastAPI          │  │ Mock SAHYOG/NCRP   │
                 │ Clustering &     │  │ Adapters           │
                 │ Attribution svc  │  │ (documented REST)  │
                 └────────┬─────────┘  └────────────────────┘
                          │
              ┌───────────┴────────────┐
              │                        │
     ┌────────▼────────┐     ┌─────────▼─────────┐
     │  PostgreSQL       │     │  ClickHouse         │
     │  (VASP registry,  │     │  (transactions,      │
     │   cases, audit)   │     │   addresses, tags)    │
     └────────────────────┘     └──────────┬─────────┘
                                            │
                                 ┌──────────▼──────────┐
                                 │ Python ingestion     │
                                 │ scripts (scheduled)  │
                                 │ Blockstream/Blockchair│
                                 │ + TronGrid            │
                                 └───────────────────────┘
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Case-management API | Spring Boot (Java), JWT auth, JPA/Hibernate |
| Relational store | PostgreSQL |
| Transaction data store | ClickHouse |
| Ingestion | Python (APScheduler / interval jobs) |
| Clustering & attribution | Python, FastAPI, NetworkX/igraph |
| Frontend | Next.js, TypeScript |
| Graph visualization | Cytoscape.js / react-force-graph |
| Deployment | Docker Compose (local), AWS/Vercel (demo) |

---

## Getting started

```bash
git clone <this-repo>
cd sih26183
cp .env.example .env   # fill in Blockstream/Blockchair and TronGrid API keys (free tier)
docker compose up --build
```

This starts:
- `frontend` on `http://localhost:3000`
- `api` (Spring Boot) on `http://localhost:8080`
- `clustering-service` (FastAPI) on `http://localhost:8000` (Swagger docs at `/docs`)
- `postgres` on `5432`, `clickhouse` on `8123`

On first boot, run the seed script to load GraphSense TagPacks and 2-3 demo cases:

```bash
docker compose exec api ./scripts/seed-demo-data.sh
```

---

## Demo walkthrough (for judging)

1. Open the dashboard, go to **New Complaint**, and submit one of the pre-seeded demo wallet addresses (see `docs/demo-cases.md`).
2. Show the fund-flow graph rendering with hop annotations.
3. Open the case detail view — point out the confidence score, risk tier, and the plain-language reasoning string.
4. Click **Generate Report** to show the exported investigation report.
5. Open the Swagger docs for `/mock/sahyog/data-request` and `/mock/ncrp/complaint-sync` to show the integration-ready API contracts.
6. Close with the extensibility line: chain adapters are pluggable — BTC and Tron are demoed because they're the dominant rails in Indian investment-scam and task-fraud cases, but the clustering/attribution engine itself is chain-agnostic.

---

## Project status / production hardening notes

This is a hackathon MVP. Known simplifications, and what "real" would look like:

- **Ingestion** runs as scheduled Python jobs rather than a workflow orchestrator (e.g., Apache NiFi or Airflow). The jobs are written to be idempotent and re-runnable, so swapping in an orchestrator later doesn't require rewriting the ingestion logic — just wrapping it.
- **SAHYOG/NCRP adapters are mocked.** Real integration would require formal access as a registered LEA-affiliated system.
- **Risk tiering is rule-based** (hop count + mixer/bridge proximity + TagPack confidence). An ML layer is a natural next step but was deliberately kept secondary to preserve explainability for investigative/legal use.
- **Chain coverage is BTC + Tron/TRC20.** The adapter interface (`/clustering-service/adapters/`) is designed so additional chains are a new adapter class + config, not a core rewrite.
