# Deep Work Time — Learning & Engineering Roadmap

> **Primary goal:** use Deep Work Time as a deliberate-practice project for becoming a stronger full-stack engineer, especially in backend engineering, mobile development, databases, cloud infrastructure, API design, system design, testing, security, and production operations.
>
> **Secondary goal:** end up with a real, polished, usable deep-work timer application.
>
> **Constraint:** optimize for learning and understanding, while making the project demonstrable and useful as early as possible.

---

# 1. Guiding Principles

## Dogfood absurdly early

Get the app onto your own phone as soon as the first vertical slice works. Do not wait for auth, cloud deployment, polished architecture, charts, or subscriptions.

Use it while it is ugly. Real use should generate the bugs, awkward flows, missing features, and architectural pressure that guide later work.

## Deploy early and thin

Do not treat deployment as a graduation step.

```text
local vertical slice
        ↓
basic quality + tests
        ↓
thin AWS deployment
        ↓
use it in a real environment
        ↓
improve infrastructure over time
```

The first deployment can be simple. Make the infrastructure progressively less embarrassing.

## Build deliberately, not primitively

Write the application-specific engineering yourself:

- API endpoints
- request/response models
- business logic
- ORM models and persistence queries
- database schema
- validation
- tests
- Docker configuration
- deployment configuration
- CI/CD
- authorization rules
- architecture decisions

Use normal professional abstractions for commodity infrastructure such as identity management, TLS, database engines, and cloud orchestration.

## Keep the frontend strong

Backend learning is a major goal, but the React Native app should not become a throwaway shell.

The portfolio signal should be:

> strong frontend engineer who can also design, build, deploy, and operate a real backend

After the first vertical slice, spend real time on:

- visual polish
- interaction design
- loading, error, and empty states
- accessibility
- navigation
- lifecycle behavior

## Add one major abstraction at a time

Preferred progression:

1. Python foundations
2. React Native timer
3. FastAPI
4. PostgreSQL
5. validation / errors / logging / basic security
6. tests
7. Alembic
8. Docker
9. early AWS deployment
10. README/demo polish
11. TanStack Query
12. lifecycle hardening
13. authentication
14. CI/CD
15. observability maturity
16. product expansion
17. SQLAlchemy query/ORM deep dive
18. optional offline-sync track

## Learn the layer below the abstraction

- Learn SQL basics through a separate tutorial; use SQLAlchemy ORM in the app from the start, and inspect generated SQL as you work.
- Run services manually before Dockerizing.
- Deploy manually before automating deployment.
- Understand tokens before delegating auth to an identity provider.
- Understand timestamps and lifecycle before relying on helpers.

## Use AI as tutor and reviewer

Default rule:

> I write the first implementation. AI may explain concepts, review code, identify bugs, suggest alternatives, help write tests after I understand the behavior, and help compare trade-offs.

Prefer:

> “Here is my implementation. What assumptions am I making? What would an interviewer ask me about this?”

over:

> “Build this feature for me.”

---

# 2. Default Stack

## Mobile

- React Native, Expo, TypeScript, Expo Router
- React state and `fetch` initially
- TanStack Query later; Zustand only if actually necessary
- Expo SecureStore for sensitive values
- Expo SQLite only in the optional offline track

## Backend

- Python (supported stable release), FastAPI, Pydantic v2
- `uv` for environment and dependency management (alternative: Poetry or standard `venv` + pip)
- Uvicorn as ASGI server
- Synchronous endpoint functions (`def`) with SQLAlchemy 2.x synchronous sessions and the PostgreSQL driver (psycopg 3); use a bounded connection pool when needed
- Python type hints throughout; Pyright in strict mode (alternative: mypy)
- Ruff for linting and formatting
- `pytest`, FastAPI `TestClient`/HTTPX, and dependency overrides for tests

## Data

- PostgreSQL + SQLAlchemy 2.x ORM from the first backend slice (psycopg 3 as the underlying driver)
- Alembic for versioned schema migrations, using SQLAlchemy model metadata and reviewing generated revisions
- SQL tutorial separately for SELECT/JOIN/GROUP BY, constraints, indexes and transactions; inspect SQLAlchemy-generated SQL in practice
- Keep API Pydantic models distinct from SQLAlchemy database models

## Infrastructure

- Docker and Docker Compose
- AWS App Runner early, RDS PostgreSQL, ECR, GitHub Actions, CloudWatch
- ECS/Fargate as optional deeper AWS exercise
- Explicit environment settings (`pydantic-settings` is an option)

## Authentication

- Cognito initially; Auth0 or Clerk as alternatives
- OIDC/OAuth authorization-code flow with PKCE for mobile; validate JWT issuer, audience, expiry, signature and keys on the API
- Managed authentication does not replace per-user authorization checks

## Observability

- Early: structured logs and correlation/request IDs (Python `logging` or `structlog`)
- Later: CloudWatch, metrics, health/readiness endpoint, optional Sentry

---

# 3. Repository Structure

```text
deep-work-time/
├── mobile/
├── backend/
├── docs/
│   ├── architecture.md
│   ├── interview-notes.md
│   ├── system-design.md
│   └── decisions/
├── docker-compose.yml
├── README.md
├── ROADMAP.md
└── ROADMAP_SIMPLE.md
```

Suggested ADRs:

```text
docs/decisions/
├── 001-python-and-fastapi.md
├── 002-postgresql.md
├── 003-uuid-vs-integer.md
├── 004-sqlalchemy-orm-from-start.md
└── ...
```

Use this template from the beginning:

```md
# ADR XXX: Decision title

## Context

What problem are we solving?

## Options Considered

### Option A
Pros:
- ...

Cons:
- ...

### Option B
Pros:
- ...

Cons:
- ...

## Decision

What did we choose?

## Why

Why is this appropriate here?

## Consequences

What gets easier?
What gets harder?
What might cause us to revisit this?
```

---

# 4. Phase 0 — Tight Python Foundations

## Goal

Learn just enough Python to build a typed API. Time-box this phase; do not complete a long language course before shipping a timer.

## Focus

- environment/packaging with `uv`, modules, imports, virtual environments
- functions, default arguments, `None`, exceptions, context managers
- lists, dictionaries, sets, comprehensions, iteration, sorting
- dataclasses vs Pydantic models; `datetime`, `timedelta`, timezone-aware timestamps, `UUID`
- type annotations, `Optional`/unions, `TypedDict`, generics and static checking
- mutability, identity vs equality, shared mutable defaults
- sync vs async basics; what Python's GIL does and does not imply
- Ruff, Pyright strict, pytest

## Tiny Exercises

- a typed duration-calculation function and validation of timestamps
- grouping sessions by date and total duration
- map a row/dictionary to a response model
- write `pytest` tests for normal and boundary cases
- solve a couple of interview problems with `dict`, `set`, and `enumerate`

## Interview Focus

- Python `dict`/`set` expected lookup complexity; list vs tuple
- generators vs lists; mutability and object references
- Python dynamic typing vs static type checking; Pydantic runtime validation vs annotations
- exceptions, context managers, concurrency (I/O-bound vs CPU-bound)

## Done When

You can independently write and test a small typed Python module. Move immediately into the app.

---

# 5. Phase 1 — Dogfoodable Mobile Timer

## Goal

Get something onto your phone immediately.

Build:

- Start session
- Stop session
- elapsed-time display
- session history
- basic navigation

Initially, history can be local-only if necessary.

## Timer Model

Persist or track:

```text
startedAt
```

and derive:

```text
elapsed = now - startedAt
```

rather than treating interval ticks as authoritative state.

## Learn

- React Native component model
- Expo structure
- Expo Router
- device testing
- app state
- mobile lifecycle basics

## Frontend Quality

Pay attention to:

- touch targets
- loading and empty states
- visual hierarchy
- readable typography
- start/stop affordances
- accidental taps
- accessibility

## Interview Focus

Be able to explain:

- React vs React Native
- state vs derived state
- lifecycle
- why timestamps beat naïve interval counting
- client state vs server state

---

# 6. Phase 2 — Smallest End-to-End Backend Slice

## Goal

Connect the already-usable mobile app to a Python/FastAPI backend and real PostgreSQL. Keep `mobile/` and `backend/` independent applications in the monorepo.

```text
React Native / Expo
      ↓ HTTP / JSON
FastAPI (ASGI / Uvicorn)
      ↓ SQLAlchemy ORM (psycopg driver)
PostgreSQL
```

Initial layout (avoid excessive abstractions):

```text
backend/
├── pyproject.toml
├── app/
│   ├── main.py
│   ├── api/routes/sessions.py
│   ├── schemas/session.py       # Pydantic request/response contracts
│   ├── services/sessions.py     # domain rules
│   ├── db/session.py           # engine and request-scoped DB session
│   ├── models/session.py       # SQLAlchemy mapped model
│   ├── repositories/sessions.py # ORM queries
│   └── core/config.py
└── tests/
```

Endpoints:

```http
POST /sessions
GET /sessions
GET /sessions/{id}
```

Later: `PATCH /sessions/{id}` and `DELETE /sessions/{id}`.

Example request:

```json
{
  "startedAt": "2026-09-14T14:00:00Z",
  "endedAt": "2026-09-14T14:45:00Z"
}
```

Example response:

```json
{
  "id": "uuid",
  "startedAt": "2026-09-14T14:00:00Z",
  "endedAt": "2026-09-14T14:45:00Z",
  "durationSeconds": 2700
}
```

Choose and consistently configure API aliases: Python `snake_case` internally vs JSON `camelCase` externally. Pydantic performs runtime parsing/validation; annotations alone do not.

Start with ordinary synchronous `def` endpoints, SQLAlchemy 2.x `Session` and a synchronous PostgreSQL driver. Use a FastAPI yield dependency for a request-scoped DB session; make commit/rollback ownership explicit. Avoid calling blocking ORM operations inside `async def` handlers. Explore async SQLAlchemy only if there is a meaningful reason later.

## API Decisions to Document

- client-generated or server-generated UUID, especially considering optional future offline work?
- client sends duration or server derives it? (Prefer server-derived.)
- invalid timestamps, timezones and zero/negative duration?
- `201 Created`, response body, and optional `Location` header?
- `404` for missing resource vs `422` for malformed request?
- stable error shape and pagination plan?
- endpoint function (`def`/`async def`), ORM session lifecycle, transaction ownership and pool sizing?
- OpenAPI contract and manual TypeScript client now vs optional generated client later?

Use FastAPI's `/docs` and generated OpenAPI schema to inspect the API contract, not as a substitute for designing it.

---

# 7. Phase 3 — PostgreSQL Foundations

Initial schema:

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Learn

- primary keys
- foreign keys
- constraints
- indexes
- joins
- aggregation
- transactions
- normalization
- pagination
- timestamps
- timezone handling
- `NULL`

## SQL Learning Track (Separate from Implementation)

Complete an online SQL tutorial covering `SELECT`, filtering, joins, grouping, aggregation, inserts/updates/deletes, keys, constraints, indexes and transactions. You do **not** need to implement the app once in raw SQL. In the project, inspect generated SQL for important ORM queries, and use `EXPLAIN` when query performance becomes interesting. Understand how ORM relationships map to foreign keys and joins.

## Interview Focus

Be able to discuss:

- SQL vs NoSQL
- indexes
- primary and foreign keys
- normalization
- ACID
- transactions
- N+1 queries
- connection pooling
- OFFSET vs cursor pagination

---

# 8. Phase 4 — Basic Quality, Security, and Logging

Do this before cloud deployment.

## Add

- Pydantic request/response schemas
- service/repository separation
- request validation
- consistent error responses
- exception handling
- environment configuration
- structured logging
- request/correlation IDs
- basic tests
- secrets hygiene

## Security Fundamentals

From day one:

- validate server-side
- use SQLAlchemy bound values for user-supplied data
- never concatenate user input into SQL, especially in raw `text()` or dynamic queries
- do not commit secrets
- do not log secrets
- do not expose stack traces to clients
- enforce important invariants in the database too
- distinguish client validation from server validation

Unsafe:

```text
"SELECT * FROM sessions WHERE id = '" + input + "'"
```

Prefer ORM queries or SQLAlchemy bound parameters when raw SQL is necessary. The ORM is not a substitute for server-side validation or resource authorization.

## Structured Logging

Useful fields:

```text
timestamp
level
requestId
method
path
status
durationMs
```

## Interview Focus

Be ready to explain:

- input validation as a trust boundary
- parameterized SQL
- server vs client validation
- secrets management
- correlation IDs
- router/service/repository layering
- Pydantic request/response schemas
- FastAPI dependencies

---

# 9. Phase 5 — Testing

Add:

### Unit tests

Examples:

- duration calculation
- timestamp validation
- domain rules

### Repository integration tests

Verify:

- SQLAlchemy model mappings and repository queries
- session lifecycle, transaction commit/rollback and database constraints
- relationship loading and query counts where relevant

### API tests

Verify:

- status codes
- validation
- errors
- Pydantic validation and serialization
- unauthorized access after auth is introduced

Libraries:

- pytest
- FastAPI `TestClient` (HTTPX) and dependency overrides
- `unittest.mock` where useful
- disposable PostgreSQL test database (Testcontainers Python optional)

## Interview Focus

Be able to discuss:

- unit vs integration tests
- mocks vs stubs
- flaky tests
- database tests
- test isolation
- coverage vs quality

---

# 10. Phase 6 — Alembic and Dev Seed Data

Use Alembic revision scripts with SQLAlchemy model metadata. Autogenerate candidate revisions, then review their operations before applying:

```text
alembic/versions/
  001_create_sessions.py
  002_add_notes.py
  003_add_categories.py
```

Keep migrations separate from application runtime schema creation. Do not use `Base.metadata.create_all()` as a production migration strategy. Understand that autogeneration requires human review, especially for renames, destructive changes and data backfills.

Keep these concepts separate:

```text
migrations → required structure
seeds      → convenient development data
fixtures   → controlled test data
```

Useful dev seeds:

- yesterday's session
- today's session
- long session
- short session
- empty day

## Interview Exercise

Explain how you would add a new non-null column to a populated production table safely.

---

# 11. Phase 7 — Docker

Step 1:

```text
FastAPI locally
Postgres in Docker
```

Step 2:

```text
FastAPI container
Postgres container
```

Use Docker Compose.

Learn:

- images
- containers
- ports
- volumes
- networks
- environment variables
- health checks
- multi-stage builds

## Interview Focus

Explain:

- container vs VM
- image vs container
- persistence
- container networking
- why `localhost` behaves differently inside containers

---

# 12. Phase 8 — Early AWS Deployment

Deploy a restricted synthetic-data environment before the application is polished.

Suggested first version:

```text
React Native app
       ↓
AWS App Runner
       ↓
RDS PostgreSQL
```

Do not wait for full production auth **to practice a restricted/synthetic-data deployment**. Do not expose personal data or unauthenticated CRUD endpoints on the public internet.

Do not wait for:

- full production auth
- offline sync
- perfect CI/CD
- advanced observability

Add:

- RDS
- App Runner
- environment variables
- secrets
- HTTPS
- health endpoint
- minimal logging
- deployment documentation

Later, if useful:

```text
ECR
 ↓
ECS / Fargate
 ↓
RDS
```

## Interview Value

Be able to describe:

- what broke moving from localhost to AWS
- how configuration works
- how the backend reaches the DB
- where secrets live
- what is publicly reachable
- how health is checked

---

# 13. Phase 9 — README and Demonstrability

Do this while you are still actively interviewing.

README opening:

```text
# Deep Work Time

[SCREENSHOT OR SHORT GIF]

A React Native deep-work timer backed by
Python/FastAPI and PostgreSQL.
```

Include:

- screenshot or short recording
- one-paragraph description
- architecture diagram
- current status
- stack
- setup instructions
- major engineering decisions
- link to ADRs
- roadmap

A reviewer should understand the project in about ten seconds.

---

# 14. Phase 10 — Better Mobile Data Architecture

Introduce TanStack Query for:

- fetching
- mutations
- caching
- retries
- invalidation
- loading states
- stale data

Keep React state for local UI state.

Use Zustand only if genuinely needed.

## Interview Focus

Be able to explain:

- server state vs client state
- cache invalidation
- optimistic updates
- query keys
- stale data
- retry policy

---

# 15. Phase 11 — Mobile Lifecycle Hardening

Make the timer reliable across:

- backgrounding
- screen changes
- app suspension
- process restart
- persisted active-session state

Ask:

- what happens if the app backgrounds for 30 minutes?
- what happens if the process dies?
- what happens if the phone restarts?
- what if the system clock changes?

---

# 16. Phase 12 — Authentication and Authorization

Default: AWS Cognito. Alternatives: Auth0 and Clerk. Use a managed identity provider rather than implementing passwords, resets, and MFA yourself.

```text
Mobile → identity provider (OIDC authorization code + PKCE)
       → access token → FastAPI auth dependency
       → verify JWT via provider JWKS, issuer, audience, signature, expiry
       → derive authenticated user ID
       → repository queries scoped by user ID
```

Learn OAuth 2.0 vs OIDC; bearer access tokens vs refresh tokens; token lifecycle; JWKS/key rotation; authentication vs authorization; least privilege; Expo SecureStore. Do not use an ID token as an API access token. Derive identity from verified claims, never trust client-provided `userId`.

Add `users` (or documented provider-subject mapping) and `sessions.user_id`. Test that user A cannot read, modify, or delete user B's sessions. Document ownership of pre-auth test data and how it is migrated or reset.

**Important early-deployment boundary:** Until authentication/authorization exists, keep the cloud API a restricted demo/test environment containing synthetic data, with controlled access or disabled public write/read endpoints. Never expose personal session history via an unauthenticated public endpoint. App Runner HTTPS alone is not authentication.

---

# 17. Phase 13 — CI/CD

Use GitHub Actions:

```text
push
 ↓
Ruff + Pyright
 ↓
pytest
 ↓
build Docker image
 ↓
push image
 ↓
deploy
```

Learn:

- CI
- CD
- build artifacts
- reproducibility
- secrets
- deployment environments
- rollback
- branch protection

---

# 18. Phase 14 — Observability Maturity

Basic structured logging already exists.

Now add:

- FastAPI health/readiness checks
- CloudWatch log aggregation
- metrics
- health endpoints
- error-rate monitoring
- latency monitoring
- Sentry if useful

Interview exercise:

> A user says the app is slow. How would you investigate?

---

# 19. Phase 15 — Product Depth and Frontend Polish

Possible features:

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

Use each as an engineering exercise.

| Feature | Learning |
|---|---|
| Daily stats | SQL aggregation |
| Tags | many-to-many relationships |
| Streaks | date/time logic |
| Charts | data shaping |
| Editing | PATCH semantics |
| Notifications | mobile APIs |
| Export | files/streaming |
| Account deletion | privacy/data lifecycle |

---

# 20. Phase 16 — SQLAlchemy Deep Dive (Optional)

You already use the ORM. After the app has some real data access patterns, deepen your understanding rather than rebuilding a second persistence layer:

1. Inspect emitted SQL and compare a simple ORM query with the SQL taught in your separate tutorial.
2. Explore relationships, eager vs lazy loading, N+1 queries and query counts.
3. Practice transaction boundaries, rollback and session lifecycle.
4. Compare one complex query in SQLAlchemy ORM and SQLAlchemy Core (optional); use explicit parameterized SQL only when it genuinely helps.
5. Try `EXPLAIN` and assess indexes with realistic development data.

Interview question: when choose ORM, Core/query builder, or parameterized raw SQL, and what are the trade-offs?

---

# 21. Optional Advanced Track — Offline-First Sync

This is not on the critical path.

Only do it after the app is already:

- useful
- deployed
- polished
- authenticated
- demonstrable

Add Expo SQLite.

Potential local fields:

```text
id
started_at
ended_at
duration_seconds
sync_status
last_modified_at
```

Potential states:

```text
pending
syncing
synced
failed
```

Learn:

- offline-first design
- retries
- idempotency
- eventual consistency
- duplicate prevention
- conflict resolution

Important scenario:

A POST times out after the server commits. The client does not know whether creation succeeded.

Possible solution:

- client-generated UUID
- retry with same ID
- primary key prevents duplicate creation

This is excellent distributed-systems practice, but it should not be allowed to stall the core project.

---

# 22. System Design Practice

Maintain:

```text
docs/system-design.md
```

Periodically answer:

> Design Deep Work Time for 10 users.
>
> Now 10,000.
>
> Now 10 million.

Discuss:

- mobile clients
- API instances
- load balancing
- Postgres
- connection pooling
- indexing
- caching
- reliability
- consistency
- authentication
- observability

Do not automatically add Redis, Kafka, microservices, or Kubernetes.

First ask:

> What is the actual bottleneck?

---

# 23. Interview Notes Habit

Start immediately.

For every meaningful feature or decision, add:

```md
## Feature / Decision

### What I built

### Why I chose this

### Alternatives considered

### Trade-offs

### Failure modes

### Security concerns

### Scaling concerns

### What I would change at larger scale

### Interview questions this relates to
```

Practice explaining these aloud.

---

# 24. Revised Milestones

## Milestone 1 — Dogfoodable Timer

- [ ] Expo app
- [ ] start/stop
- [ ] history
- [ ] usable on your phone
- [ ] first screenshot
- [ ] first ADRs

## Milestone 2 — Local Full Stack

- [ ] FastAPI
- [ ] PostgreSQL
- [ ] `POST /sessions`
- [ ] `GET /sessions`
- [ ] mobile connected to API
- [ ] validation
- [ ] SQLAlchemy ORM model and query

## Milestone 3 — Basic Engineering Quality

- [ ] Pydantic request/response schemas
- [ ] service layer
- [ ] repository layer
- [ ] structured logs
- [ ] request IDs
- [ ] consistent errors
- [ ] tests
- [ ] secrets hygiene
- [ ] seed data

## Milestone 4 — Docker + Migrations

- [ ] Alembic
- [ ] Postgres container
- [ ] backend container
- [ ] Docker Compose

## Milestone 5 — Early Cloud Deployment

- [ ] App Runner
- [ ] RDS
- [ ] HTTPS
- [ ] secrets/config
- [ ] health endpoint
- [ ] deployment notes

## Milestone 6 — Strong Demo Surface

- [ ] polished timer UI
- [ ] polished history
- [ ] README screenshot/video
- [ ] architecture diagram
- [ ] clean setup instructions

## Milestone 7 — Better Mobile Architecture

- [ ] TanStack Query
- [ ] robust loading/error states
- [ ] lifecycle-safe timer

## Milestone 8 — Users

- [ ] identity provider
- [ ] FastAPI JWT validation/auth dependencies
- [ ] secure token storage
- [ ] user-owned sessions
- [ ] authorization tests

## Milestone 9 — CI/CD

- [ ] automated tests
- [ ] automated build
- [ ] automated deploy
- [ ] rollback strategy

## Milestone 10 — Observability

- [ ] CloudWatch
- [ ] health/readiness checks
- [ ] metrics
- [ ] error monitoring

## Milestone 11 — Product Depth

- [ ] categories/projects
- [ ] statistics
- [ ] charts
- [ ] goals
- [ ] notifications
- [ ] export

## Milestone 12 — ORM Deep Dive (Optional)

- [ ] inspect generated SQL and query behavior
- [ ] explore loading strategies and transaction boundaries
- [ ] written trade-off analysis

## Optional Milestone — Offline Sync

- [ ] SQLite
- [ ] sync states
- [ ] retries
- [ ] idempotency
- [ ] conflict strategy

---

# 25. Definition of Done for Each Feature

## Behavior

- Does it work?
- What are the edge cases?

## UX

- Is it pleasant to use?
- Are loading, error, empty, and success states handled?
- Is the mobile interaction polished enough to demonstrate?

## API

- Is the contract clear?
- Are status codes appropriate?
- Are errors consistent?

## Data

- Is the schema appropriate?
- Are important invariants enforced?

## Security

- Is input validated?
- Is SQL parameterized?
- Are secrets protected?
- Is sensitive data excluded from logs?
- Is authorization correct?

## Reliability

- What happens if the network fails?
- What happens if the request is retried?
- What happens if the database is unavailable?

## Testing

- What should be unit tested?
- What should be integration tested?

## Observability

- Would I know if this failed in production?

## Scale

- What happens at 10x usage?
- 1000x?

## Trade-offs

- What alternatives did I consider?
- Why did I choose this approach?

## Interview

- Could I explain this decision clearly in five minutes?

---

# 26. Recommended Learning Loop

```text
Encounter problem
      ↓
Attempt solution
      ↓
Read docs
      ↓
Implement
      ↓
Use it yourself
      ↓
Observe real problems
      ↓
Test
      ↓
Deploy
      ↓
Document decision
      ↓
Explain aloud
```

Avoid:

```text
consume tutorials for weeks
      ↓
build nothing demonstrable
```

---

# 27. Final Success Criteria

The project succeeds even if it never becomes a commercial product.

Success means you can confidently say:

> I designed, built, deployed, and operated a React Native application backed by a Python/FastAPI API and PostgreSQL. I designed the API and schema, wrote the persistence layer, validated and secured inputs, containerized the system, deployed it to AWS, implemented authentication, built CI/CD, added production logging and monitoring, and made deliberate architectural trade-offs that I can explain.

And equally importantly:

> The mobile experience is polished enough that the project demonstrates my existing frontend strength rather than hiding it.

The finished application is evidence.

The deeper goal is becoming the engineer who understands why it works.
