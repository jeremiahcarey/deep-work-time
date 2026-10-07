# Deep Work Time — Product Requirements

**Status:** Working product specification  
**Approach:** Learning-first development; early personal use, early thin deployment, public release optional  
**Related:** `ROADMAP.md`, `ROADMAP_SIMPLE.md`, `docs/architecture.md`, `docs/decisions/`

> This document records **what the product should do**. The roadmaps record **when and how to build it**. A feature appearing here does not mean it must be implemented in the first milestone.

---

## 1. Product overview

**Deep Work Time** is a mobile-first productivity app for starting focused work sessions, recording what the user intended to do, reviewing time spent across projects, rating focus quality, and learning from work patterns.

The primary interaction is **Start Deep Work**. The app should feel useful as a timer before it becomes a sophisticated tracking or analytics product.

An eventual public release may offer a free tier and optional **Pro** subscription for richer history, insights, custom metrics, tags, and export. Monetization is **not** a dependency of the initial learning build. A web client is a possible later extension of the same API.

### Product principles

- **Fast to start:** starting a session should require as few actions as possible; goal and project can be optional.
- **Reliable timing:** an active session remains reconstructable after backgrounding, screen lock, or app restart.
- **Reflection without friction:** a concise completion flow; optional fields can be skipped.
- **Personal utility first:** use the app on a real phone from the first milestone.
- **Polished mobile experience:** clear visual hierarchy, touch targets, accessible controls, dark mode initially.
- **User trust:** avoid silent data loss; clearly communicate save failures and synchronization status where applicable.

## 2. Users and use cases

**Primary:** writers, students, developers, and other knowledge workers who want to initiate focused work and build awareness of how they spend their time.

**Secondary:** productivity-oriented users who want project breakdowns, focus trends, and progress toward goals.

Core jobs to be done:

1. Begin a focus session immediately.
2. Capture what I plan to work on without lengthy setup.
3. Stop or pause reliably, including after leaving the app.
4. Record how the session went and optionally record output.
5. Review recent work and observe trends over time.

## 3. Delivery stages and scope

These stages align to the engineering roadmap but are **product milestones**, not a strict implementation schedule.

| Stage | Outcome | Included | Not required yet |
|---|---|---|---|
| **A. Personal timer** | Usable on my phone | Start, pause/resume, stop, elapsed time, basic local history and recovery | Accounts, cloud, analytics, billing |
| **B. Connected app** | Mobile ↔ API ↔ database works | FastAPI, PostgreSQL, persisted sessions, API errors, basic logging/tests | Public signup, Pro, offline synchronization |
| **C. Early hosted build** | A thin deployed API and demonstrable app | Docker, migrations, AWS App Runner + RDS (or documented alternative), README/demo | Fully public production launch |
| **D. Account-backed core** | Secure personal data | Identity provider, API token validation, per-user authorization, projects, completion review, mobile polish | Monetization, elaborate insights |
| **E. Release candidate (optional)** | App-store-quality initial product | Onboarding, account deletion, privacy/support materials, app distribution, basic insights | Pro may follow later |
| **F. Monetization (optional)** | Free/Pro offering | RevenueCat, paywall, entitlements, restore purchases, advanced insights/export | Social and web apps |
| **Stretch** | Advanced mobile/distributed-systems learning | SQLite offline write queue, retries, conflict resolution and multi-device synchronization | Never blocks earlier stages |

**Early-deployment safety:** before authentication and user isolation exist, use synthetic data in the hosted environment and restrict access as appropriate. Do not put real personal session history behind publicly accessible unauthenticated endpoints.

---

## 4. Functional requirements

### 4.1 Home and session preparation

- Main CTA: **Start Deep Work**.
- Optional session goal/task description.
- Optional project/category selected from existing entries; creation can be offered inline once project support exists.
- Skipping optional fields must not block starting.
- Show current session state prominently.
- Only one active session per user/device initially. Define and enforce cross-device behavior if multi-device support is introduced.

### 4.2 Timer and session lifecycle

Supported user actions:

1. Start.
2. Pause.
3. Resume.
4. End.
5. Adjust final end time if the session ended while the user was away, where supported.
6. Discard with confirmation.

Timing behavior:

- Persist a start timestamp and enough pause/resume information to calculate **active duration**, excluding paused time.
- Do not use `setInterval` ticks as authoritative elapsed time; derive displayed time from timestamps plus accumulated active duration.
- An interval may refresh the display but does not define recorded duration.
- Reconstruct the session after navigation, backgrounding, screen lock, and app restart.
- Avoid double-ending a session on rapid taps or retries.
- Explicitly distinguish **elapsed wall-clock time** from **active focus duration**.
- If a planned session length is later added, schedule a local completion notification when permissions allow. An open-ended stopwatch has no inherent completion time.
- On returning after a planned end time, show a completion prompt with options to log, adjust the end time, or discard. Notification delivery is best-effort and not a source of truth for recorded time.

**Decision still to document:** whether initial sessions are exclusively open-ended, or support an optional planned duration and completion notification at launch.

### 4.3 End-of-session reflection

After ending, show a short review screen/modal:

- Actual active duration.
- Goal/task (editable if useful).
- Project/category.
- Focus rating on a four-point scale:
  - `distracted`
  - `somewhat`
  - `mostly`
  - `laser`
- Optional numeric output metric, e.g. words written or emails sent.
- Save and discard actions; do not silently discard on modal dismissal.
- Support skip/no-rating, at least in the personal-use build, to keep logging friction low.

A session is not lost merely because the completion review was interrupted. Persist a recoverable draft or pending-completion state before relying on the network.

### 4.4 Projects and metrics

- Create, select, rename, and eventually archive projects/categories.
- Preserve historical sessions if a project is archived.
- Optional numeric metrics have a name, unit/label, and numeric value (e.g. `words`, `count`).
- The initial implementation may support one optional metric per session. Multiple metric definitions and tags are future/Pro candidates.
- Model metric values explicitly in relational tables or a documented JSON strategy; do not reproduce Firestore's map schema by default.

### 4.5 History

- Reverse-chronological list of completed sessions.
- Show date, active duration, goal, project, focus rating, and key metric when available.
- Detail view and editing/deletion may be introduced after the first connected slice.
- Handle empty, loading, error, and pagination states.
- Free-tier **viewable history** is provisionally the last **14 days**; Pro may show full history.
- **Important:** a history display limit is not necessarily a deletion policy. Do not delete older free-user sessions merely because they are hidden, unless separately specified and communicated.

### 4.6 Insights

**Basic/free candidate:**

- Weekly total active time.
- Average focus rating where ratings exist (or a clearly labeled distribution; do not invent a rating for unrated sessions).
- Minutes per day for the last 7–14 days.

**Advanced/Pro candidate:**

- Full history access.
- Focus trends.
- Time by project/category.
- Weekly/monthly summaries.
- CSV export.
- Multiple custom metrics and optional tags.

Use the user's timezone for day boundaries in charts while storing instants consistently on the server. Define how sessions crossing midnight are allocated before implementing aggregates.

### 4.7 Accounts and profile (later than initial dogfood build)

- Managed authentication using **AWS Cognito** as the current candidate; Auth0 or Clerk remain alternatives.
- Sign-in methods are a product/provider decision: Apple, Google, and/or email-based sign-in where supported and appropriate.
- API validates credentials and enforces user ownership; the client does not choose whose data to read by supplying an arbitrary `userId`.
- Profile displays name, email, subscription/entitlement status (when relevant), and theme preference.
- Dark theme initially; light theme later if desired.
- Support account deletion including associated user data according to the documented deletion policy.
- Consider guest-to-account migration only if local guest usage is retained for a public release; personal local development does not commit the product to public guest accounts.

### 4.8 Onboarding (public-release candidate)

- Brief introduction to the value of starting and reviewing focused work.
- Explain any free/Pro restrictions accurately; do not require a paywall to start using the core app.
- Explain relevant notification permission in context, rather than at first launch without reason.
- Sign-in/account creation at an appropriate point.
- Land on the Home screen with **Start Deep Work** prominent.
- Track first-run/onboarding completion so returning users do not repeat onboarding.

### 4.9 Monetization (optional, not critical path)

- **RevenueCat** for mobile billing, purchase state, restoration, and entitlements.
- Candidate split (subject to validation before launch):

| Capability | Free | Pro |
|---|---|---|
| Start and complete sessions | Yes | Yes |
| View recent history | Last 14 days | Full history |
| Basic weekly summary and daily chart | Yes | Yes |
| Advanced charts | No | Yes |
| Custom numeric metrics | One | Multiple |
| Tags | No | Yes |
| CSV export | No | Yes |

- Show paywall when a user requests a gated feature, with clear pricing and purchase terms.
- Restore purchases and entitlement refresh work across reinstalls and supported devices.
- Centralize entitlement checks in the client; enforce server-side restrictions for server-backed premium capabilities.
- Subscription lifecycle and user identity must be considered together. A client-provided `isPro` flag is not authoritative.
- Decide whether entitlements are checked via RevenueCat SDK, synchronized through webhooks to the API, or both; make webhook processing idempotent if introduced.

**Not decided:** actual prices, trial period, annual/monthly offerings, final 14-day policy, or whether premium features launch with the initial public release.

### 4.10 Settings

- Edit display name.
- Theme preference (dark by default; light optional).
- Notification/sound/haptics preferences where available.
- Restore purchases once billing exists.
- Sign out once auth exists.
- Delete account once public accounts exist.

### 4.11 Deferred/optional features

- Focus rooms/social presence/chat.
- PDF export and third-party integrations.
- Web dashboard built against the same HTTP API.
- Expanded themes.
- Advanced SQLite offline-first synchronization.
- Home-screen widgets or shortcuts.
- Multi-device active-session coordination.

---

## 5. User flows

### 5.1 First personal-use launch (Stage A)

1. Install/run development build on phone.
2. Open Home screen.
3. Tap **Start Deep Work**; optionally describe goal.
4. Run/pause/resume/stop a session.
5. Save review and see history.

No cloud account or payment is required at this stage.

### 5.2 First public-release launch (future)

1. Install and open app.
2. See concise onboarding.
3. Create/sign into account, or use an explicitly supported guest flow.
4. Request notification permission when relevant.
5. Land on Home and tap **Start Deep Work**.

### 5.3 Deep work session

1. Tap **Start Deep Work**.
2. Optionally enter goal and project/category.
3. Timer starts immediately.
4. Pause/resume if needed.
5. End or return after a planned end time.
6. Review active duration, rate focus, optionally log output.
7. Save; persist locally as needed and send to API when using connected mode.
8. Display saved session in History; report save/sync failure rather than silently losing it.

### 5.4 Review progress

1. Open History.
2. Select a recent session for detail/editing when available.
3. Open Insights.
4. See basic summaries and chart.
5. If monetization exists, advanced views display a clearly indicated upgrade path.

### 5.5 Upgrade (future)

1. Tap gated capability.
2. See paywall and terms.
3. Complete store purchase through RevenueCat.
4. Refresh/verify entitlement.
5. Unlock appropriate features, including server checks where necessary.
6. Restore purchases when changing/reinstalling devices.

---

## 6. Technical architecture

### 6.1 Current planned stack

| Layer | Default | Notes / alternatives |
|---|---|---|
| Mobile | Expo React Native + TypeScript | Expo Router; iOS first, Android possible |
| UI | React Native components; copy-in UI library optional | React Native Reusables may be evaluated, not required |
| Data fetching | Built-in `fetch` first, TanStack Query later | Keep server/client state separate |
| Charts | Select when insights are implemented | Victory Native or another maintained RN chart library; verify compatibility with current Expo version |
| API | **Python + FastAPI** | Pydantic request/response schemas; explicit route/service/persistence boundaries |
| Static analysis | Type annotations + Pyright; Ruff | Runtime validation via Pydantic is distinct from static analysis |
| Python tooling | `uv` (candidate), pytest | Separate backend environment in monorepo |
| ORM | **SQLAlchemy 2.x ORM from the first connected slice** | No raw-SQL-first requirement; separate SQL tutorial covers fundamentals |
| Migrations | Alembic | Distinct from development seed data and test fixtures |
| Database | PostgreSQL | Local first, AWS RDS later |
| Authentication | Managed IdP (Cognito candidate) + API token validation | No homemade production password system |
| Billing | RevenueCat, if monetized | Not part of initial engineering milestones |
| Local persistence | Minimal recoverable active-session state first | Expo SQLite/offline sync is optional advanced track |
| Hosting | Docker; AWS App Runner + RDS early | ECS/Fargate optional later |
| CI/CD | GitHub Actions | Mobile and backend workflows can be independent |
| Monitoring | Request IDs and structured logs early; CloudWatch/metrics later | Sentry optional |
| Distribution | Development build/TestFlight first; App Store if released | Android later if desired |

**Monorepo:** `mobile/`, `backend/`, `docs/`, `infra/`, with separate build tools and deployments. Shared repository does not imply that mobile and API versions update simultaneously.

### 6.2 Backend structure (illustrative)

```text
backend/
  app/
    api/
    schemas/        # Pydantic API contracts
    models/         # SQLAlchemy persistence models
    services/       # session and other business rules
    repositories/   # database queries (if useful; avoid pointless layers)
    db/
    core/           # config, logging, security helpers
  alembic/
  tests/
  pyproject.toml
```

Prefer a straightforward synchronous FastAPI + SQLAlchemy setup initially. Async is a later learning/measurement decision, not a default requirement.

### 6.3 Conceptual relational model

This is a **starting model, not a finalized migration**.

```text
users
  id (internal ID or stable identity mapping)
  identity_provider_subject (unique)
  display_name
  email
  theme
  created_at

projects
  id
  user_id -> users.id
  name
  archived_at (nullable)
  created_at

sessions
  id (UUID)
  user_id -> users.id
  project_id -> projects.id (nullable)
  goal (nullable)
  status (e.g. active / paused / pending_review / completed / discarded)
  started_at
  ended_at (nullable)
  active_duration_seconds (nullable until completion)
  focus_rating (nullable)
  created_at
  updated_at

session_pause_intervals (or an equivalent documented accumulation strategy)
  id
  session_id -> sessions.id
  paused_at
  resumed_at (nullable)

metric_definitions (when custom metrics are added)
  id
  user_id -> users.id
  name
  unit

session_metric_values (when custom metrics are added)
  session_id -> sessions.id
  metric_definition_id -> metric_definitions.id
  numeric_value
```

For Stage A, a much simpler local model is enough; do not add `users`, `projects`, or metric tables before their features exist. When connected personal-history data eventually becomes multi-user, plan an explicit migration rather than treating unauthenticated rows as public user records.

Key constraints/invariants to decide:

- `ended_at` cannot precede `started_at` for completed sessions.
- Paused time does not count toward active duration.
- Project IDs must belong to the authenticated user.
- Users must not view or mutate one another's sessions.
- An interrupted completion review is recoverable.
- Repeated end/save requests must not create duplicate completed sessions.
- Aggregate date boundaries follow a documented timezone policy.

### 6.4 API resources (illustrative, not final contract)

```http
POST   /sessions
GET    /sessions
GET    /sessions/{id}
PATCH  /sessions/{id}
DELETE /sessions/{id}

GET    /projects
POST   /projects
PATCH  /projects/{id}

GET    /insights/weekly
GET    /me
PATCH  /me
```

Early development may submit only **completed** sessions through `POST /sessions` while the mobile app maintains the active timer locally. If server-side active-session state or cross-device support becomes a requirement, explicitly design start/pause/resume/end commands and their concurrency semantics rather than pretending a completed-session CRUD endpoint covers them.

Use Pydantic response/request models; validate inputs at the API boundary; use ORM-bound parameters rather than SQL string interpolation. Include sensible error responses, pagination when required, and generated OpenAPI documentation.

### 6.5 Security and entitlement boundaries

- Validate all external input and enforce domain invariants server-side.
- Use SQLAlchemy query construction/parameters safely; do not interpolate untrusted values into SQL strings.
- Do not commit credentials, log tokens, or return tracebacks to clients.
- Validate tokens from the chosen IdP before accepting an authenticated user identity.
- Filter and authorize data by authenticated ownership, not a client-selected user ID.
- Enforce premium access server-side wherever the API returns or changes premium data; UI locks alone do not protect it.
- Keep publicly hosted pre-auth demonstrations synthetic and access-limited.

### 6.6 Migrations and test data

- **Alembic:** application schema evolution.
- **Development seeds:** realistic sample sessions/projects for local and synthetic demo environments.
- **pytest fixtures:** isolated, repeatable test data.
- Study SQL separately and understand the SQL generated by the ORM when debugging performance; rewriting the application in raw SQL first is unnecessary.

---

## 7. Non-functional requirements

### 7.1 Performance and usability

- Start/pause/resume feedback should feel immediate.
- The displayed timer should be stable under UI re-renders.
- Session logging should clearly indicate pending, success, or failure.
- History and insights should have appropriate loading, empty, and error states.

### 7.2 Reliability and lifecycle

- Backgrounding/locking must not corrupt active-session duration.
- Recover active session or pending completion after restart.
- A failed API request must not appear as a successful cloud save.
- Notification delivery, if enabled, is best effort; timing remains timestamp-based.

### 7.3 Offline scope

**Required early:** local, recoverable timer state and sensible network-error handling.  
**Optional advanced work:** complete sessions offline, queue writes, retry, reconcile, and coordinate across devices using Expo SQLite.

Do not promise automatic offline cloud synchronization in an MVP that has not implemented it.

### 7.4 Security and privacy

- Per-user API isolation once accounts are introduced.
- Secure storage for sensitive mobile tokens.
- Least-privilege access and managed secrets in AWS.
- Account deletion and clear data-retention behavior before a public launch.
- Minimal collection of personal data.

### 7.5 Maintainability and operations

- Separate mobile and backend builds/deployments inside one monorepo.
- Basic tests, request IDs, structured logs, and error handling before early deployment.
- Dockerized reproducible backend development.
- Migrations are versioned; no casual manual edits to hosted database schemas.
- CI/CD and mature monitoring are incremental later stages.

### 7.6 Accessibility and platform behavior

- Adequate touch targets, readable contrast, screen-reader labels, and useful non-color status cues.
- Haptics by default if available; sounds optional and controllable.
- Respect platform notification permissions and lifecycle limitations.

---

## 8. Open product decisions

Record final choices in ADRs or product decision notes rather than silently changing requirements.

1. **Timer mode:** open-ended stopwatch only at launch, or optional target duration with completion notification?
2. **Pause semantics:** preserve each pause interval or store accumulated duration plus current state?
3. **Completion UX:** which fields are truly optional, and when does a session count as saved?
4. **Projects:** required selection or optional throughout? (Current preference: optional.)
5. **Metric model:** one ad hoc metric first versus user-defined reusable metric definitions?
6. **Timezone:** attribution of sessions spanning local midnight and handling user travel.
7. **Authentication:** provider and supported login methods; whether public guest mode exists.
8. **Pricing:** whether 14-day free history, multiple metrics, and tags remain the final differentiation.
9. **Distribution:** iOS-only first or simultaneous Android support.
10. **Data retention:** distinguish hidden free-tier history from deleted data.
11. **Multi-device behavior:** can a user run or modify the same active session from two devices?
12. **Offline:** whether actual user demand justifies the advanced synchronization track.

---

## 9. Acceptance criteria for the first useful version

A first personal-use build is successful when:

- [ ] I can install/run it on my phone.
- [ ] I can start, pause, resume, and stop a session.
- [ ] Duration excludes pauses and is calculated from timestamps, not interval counts.
- [ ] I can provide a goal and optionally record a focus rating.
- [ ] I can find the completed session in recent history.
- [ ] Backgrounding and re-opening do not reset a session.
- [ ] Interrupted completion does not silently lose the session.
- [ ] The main screen is pleasant enough that I actually want to use it.
- [ ] README has a screenshot or short demo.

The subsequent **connected milestone** is successful when the app can send and retrieve sessions through FastAPI/PostgreSQL, the API has basic validation/tests/logging, and a synthetic-data deployment is demonstrable without exposing private history.

---

## 10. Out of scope unless promoted deliberately

- Social focus rooms, chat, and public leaderboards.
- Full offline multi-device sync on the critical path.
- Complex subscription architecture before actual monetization.
- Microservices, Kafka, Redis, Kubernetes, or other infrastructure without a demonstrated need.
- Web parity in the initial mobile build.

**Success criterion:** a dependable tool that I personally use, with a polished mobile interface and an understandable, tested, deployed Python/FastAPI/PostgreSQL backend. Public release and monetization remain options rather than prerequisites for the project's educational value.
