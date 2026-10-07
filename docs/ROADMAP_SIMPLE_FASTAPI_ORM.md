# Deep Work Time — Simplified Roadmap

> Goal: build a polished React Native app while deliberately learning Python backend development, PostgreSQL, cloud deployment, API design, security, testing, and production engineering.

---

# Stack

## Mobile
- React Native, Expo, TypeScript, Expo Router
- TanStack Query later; SQLite only for optional offline track

## Backend
- Python + FastAPI + Pydantic v2
- uv for packages/environments; Uvicorn ASGI server
- SQLAlchemy 2.x ORM from the beginning; psycopg 3 as PostgreSQL driver
- pytest, Ruff, Pyright strict
- start with synchronous endpoints/database access; async is a later learning choice

## Data
- PostgreSQL
- Alembic migrations using SQLAlchemy model metadata
- Separate online SQL tutorial; inspect ORM-generated SQL when useful

## Infrastructure
- Docker, AWS App Runner initially, RDS PostgreSQL, GitHub Actions, CloudWatch

## Auth
- AWS Cognito by default; Auth0 or Clerk alternatives
- FastAPI JWT validation/auth dependencies and resource-level authorization

---

# Phase 1 — Learn Just Enough Python

Focus on:
- functions, modules, classes/dataclasses, collections, comprehensions
- exceptions, context managers, datetime/UUID
- type hints vs runtime validation (Pydantic), strict Pyright
- uv, Ruff, pytest; Python dict/set for interview problems

Keep this phase short. Build the first FastAPI route quickly.

---

# Phase 2 — Dogfoodable React Native Timer

Build:

- Start session
- Stop session
- Elapsed time
- Session history
- Basic navigation

Get it onto your phone immediately.

Use it yourself even if it is ugly and local-only.

---

# Phase 3 — Basic Python Backend

Create:

```text
React Native
     ↓
FastAPI
     ↓
PostgreSQL
```

Initial endpoints:

```http
POST /sessions
GET /sessions
GET /sessions/{id}
```

Use SQLAlchemy ORM from the first endpoint. Separate FastAPI routes, Pydantic schemas, SQLAlchemy models, services, and repositories. Manage DB sessions with a FastAPI dependency.

---

# Phase 4 — Basic Engineering Quality

Add early:

- Pydantic request/response schemas
- validation
- consistent errors
- structured logs
- request IDs
- safe ORM queries / bound parameters; no SQL-string interpolation
- secrets hygiene
- basic tests
- Ruff and Pyright checks

Start ADRs and interview notes now.

---

# Phase 5 — Database Migrations + Seed Data

Add:

- Alembic
- schema migrations
- development seed data
- test fixtures

Keep migrations, seeds, and fixtures separate. Autogenerate migrations from SQLAlchemy metadata, review them, and do not rely on `create_all()` in production.

---

# Phase 6 — Docker

First:

```text
FastAPI locally
Postgres in Docker
```

Then:

```text
FastAPI container
Postgres container
```

Use Docker Compose.

---

# Phase 7 — Deploy Early

Deploy a **restricted, synthetic-data demo** before the application is polished. Until auth is added, never expose personal session data or unauthenticated public CRUD endpoints.

Start with:

```text
App Runner
    ↓
RDS PostgreSQL
```

Add:

- HTTPS
- environment config
- secrets
- health check

Improve the infrastructure later.

---

# Phase 8 — Make the Demo Strong

Do not let backend learning produce a mediocre frontend.

Improve:

- visual polish
- interaction quality
- loading states
- error states
- empty states
- accessibility
- mobile lifecycle behavior

Update README with:

- screenshot or short recording
- architecture diagram
- current status
- setup instructions

---

# Phase 9 — Better Mobile Data Handling

Add TanStack Query for:

- fetching
- mutations
- caching
- retries
- invalidation
- loading/error state

Keep React state for local UI state.

Use Zustand only if needed.

---

# Phase 10 — Reliable Timer Behavior

Handle:

- backgrounding
- screen changes
- suspension
- process restart

Persist timestamps rather than relying on interval counters.

---

# Phase 11 — Authentication

Add users with:

- Cognito
- Auth0
- or Clerk

Use FastAPI JWT validation/auth dependencies and verify issuer, audience, signature, expiry and JWKS. Scope queries to the authenticated user; never trust a client-supplied user ID.

Associate sessions with authenticated users.

---

# Phase 12 — CI/CD

Use GitHub Actions:

```text
Push
 ↓
Ruff + Pyright + pytest
 ↓
Build
 ↓
Docker image
 ↓
Deploy
```

---

# Phase 13 — Observability

Basic logs already exist.

Now add:

- FastAPI health/readiness checks
- CloudWatch
- metrics
- error monitoring
- optional Sentry

---

# Phase 14 — Product Features

Add as useful:

- categories/projects
- tags
- notes
- editing
- daily totals
- weekly totals
- streaks
- charts
- goals
- notifications
- export
- account deletion

Keep the frontend polished.

---

# Phase 15 — SQLAlchemy Deep Dive (Optional)

The application already uses SQLAlchemy ORM. Explore:

- generated SQL, joins, eager/lazy loading and N+1 queries
- session lifecycle, transactions, rollback and query performance
- SQLAlchemy Core vs ORM for a complex query, if useful

Use a separate SQL tutorial for fundamentals; no mandatory raw-SQL implementation phase.

---

# Optional Advanced Track — Offline Sync

Do this only after the core app is already:

- useful
- deployed
- polished
- authenticated

Add:

- Expo SQLite
- local persistence
- sync states
- retries
- idempotency
- conflict handling

This is a learning bonus, not a critical-path requirement.

---

# Major Milestones

## Milestone 1 — Usable Timer

- [ ] Expo app
- [ ] start/stop
- [ ] history
- [ ] running on your phone
- [ ] first ADRs

## Milestone 2 — Local Full Stack

- [ ] FastAPI
- [ ] PostgreSQL + SQLAlchemy ORM
- [ ] API
- [ ] mobile connected to backend

## Milestone 3 — Basic Quality

- [ ] validation
- [ ] logs
- [ ] request IDs
- [ ] tests
- [ ] security basics
- [ ] seed data

## Milestone 4 — Docker + Alembic

- [ ] migrations
- [ ] Docker
- [ ] Docker Compose

## Milestone 5 — Early AWS Deployment

- [ ] App Runner
- [ ] RDS
- [ ] HTTPS
- [ ] secrets
- [ ] health check

## Milestone 6 — Strong Demo Surface

- [ ] polished UI
- [ ] README screenshot/video
- [ ] architecture diagram
- [ ] clean repo

## Milestone 7 — Better Mobile Architecture

- [ ] TanStack Query
- [ ] reliable timer lifecycle

## Milestone 8 — Authentication

- [ ] identity provider
- [ ] FastAPI JWT validation/auth dependencies
- [ ] user-owned data

## Milestone 9 — CI/CD

- [ ] automated test/build/deploy

## Milestone 10 — Observability

- [ ] health/readiness checks
- [ ] CloudWatch
- [ ] metrics

## Milestone 11 — Product Depth

- [ ] stats
- [ ] charts
- [ ] categories
- [ ] goals
- [ ] notifications

## Optional Milestone — Offline Sync

- [ ] SQLite
- [ ] retries
- [ ] idempotency
- [ ] conflict strategy

---

# Core Sequence

```text
Learn enough Python
      ↓
Build timer
      ↓
Use it yourself
      ↓
Add FastAPI + Postgres
      ↓
Add validation, tests, logs, security basics
      ↓
Dockerize
      ↓
Deploy early
      ↓
Polish frontend + README
      ↓
Improve mobile architecture
      ↓
Add auth
      ↓
Automate deployment
      ↓
Add monitoring
      ↓
Expand product
      ↓
Optional offline-sync work
```

---

# Working Rule

For every meaningful decision:

```text
Build it
  ↓
Use it
  ↓
Deploy it
  ↓
Document the trade-off
  ↓
Practice explaining it
```

The goal is not just to finish an app.

The goal is to become able to explain, defend, and operate the system you built.
