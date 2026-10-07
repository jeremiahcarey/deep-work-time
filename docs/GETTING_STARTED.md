# Getting Started — Deep Work Time

Build a local timer you can use on your phone, then add FastAPI and PostgreSQL in the next milestone.

This guide follows the [simplified roadmap](ROADMAP_SIMPLE_FASTAPI_ORM.md), [engineering roadmap](ROADMAP_FASTAPI_ORM.md), and [product requirements](REQUIREMENTS_UPDATED.md). The requirements expect pause/resume and recovery earlier than the roadmaps do. The sequence below makes start/stop the first checkpoint and reliable recovery part of completing Milestone 1.

All commands below are for you to run manually. Setup commands download dependencies and create or modify files; development commands start services and may write caches. They have not been executed as part of writing this guide.

## 1. Establish the repository layout

Use the monorepo structure proposed in the requirements:

```text
deep-work-time/
  mobile/           Expo application
  backend/          Python API, added at the next milestone
  docs/
    decisions/      Short architecture decision records
  infra/            Infrastructure configuration, added later
  README.md
```

Create directories as they become useful. Separate mobile and backend dependency management is sufficient; no root workspace tooling is needed yet.

The first README should explain the project, current milestone, mobile startup command, and links to the existing documents. Use the actual document filenames above; some existing document references use older, generic names.

The existing root `.gitignore` primarily covers Python. When scaffolding mobile, verify that `node_modules/`, `.expo/`, generated build output, and local environment files are ignored. Keep dependency lockfiles tracked. Commit only placeholder values in any example environment files.

## 2. Scaffold Expo and run it on your phone

Install Node.js LTS and follow Expo’s environment setup for your device. Start with Expo Go for the initial learning checkpoint. A development build is the next distribution step for a more representative personal-use app.

- [Expo project creation](https://docs.expo.dev/get-started/create-a-project/)
- [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/)

From the repository root, run:

```sh
npx create-expo-app@latest mobile
```

**Effect:** downloads tooling, creates `mobile/`, and installs dependencies. Use the default template and inspect its generated structure before changing it.

Then start development:

```sh
cd mobile
npx expo start
```

**Effect:** starts a local development server and can write development caches.

Open the project on your phone using the QR code, with your phone and computer on the same Wi-Fi. Expo’s startup documentation, checked September 29, 2026, requires matching Expo CLI and Expo Go accounts for physical iOS devices. Follow the current [startup guide](https://docs.expo.dev/get-started/start-developing/) if connection or sign-in fails.

Before implementing features, change one visible line of text and confirm it updates on your phone. That verifies the development loop.

## 3. Build one small checkpoint at a time

| Checkpoint | What you implement | What you learn |
|---|---|---|
| Navigation | Timer and History screens | Routes, layouts, shared state |
| Basic timer | Start, elapsed display, Stop | State transitions and derived values |
| History | Show completed sessions, newest first | Lists, stable IDs, empty states |
| Pause/resume | Exclude paused time | Explicit state and timing invariants |
| Persistence | Restore timer and history | Async storage, initialization, failures |
| Completion | Optional rating and recoverable review | Draft state and reliable saving |

Keep route files focused on screens. Put timer calculations, storage functions, and reusable components outside the route directory. Read [Expo Router’s core concepts](https://docs.expo.dev/router/basics/core-concepts/) as you build navigation.

Start with React state. Lift shared session state above the screens that consume it; introduce a reducer if transitions become difficult to follow. [React’s managing-state guide](https://react.dev/learn/managing-state) explains these choices.

## 4. Decide the timer model before styling it

Use an open-ended stopwatch initially, and document that choice. Planned durations and notifications can follow later.

The important distinction is **recorded time versus display refreshes**. An interval refreshes the screen; timestamps determine duration.

A small model can track:

- Session ID and original start time.
- Status: running, paused, or pending review.
- Accumulated active milliseconds.
- Start time of the current running segment.
- Optional goal, end time, and rating.

While running:

```text
active duration = accumulated active time + (now − current segment start)
```

On pause, add the segment duration to the accumulated total. On resume, begin a new segment. On stop, freeze the duration and preserve a pending review. Stopping while paused must not add the paused interval.

Reason through this example before coding:

```text
work 10 seconds → pause 20 seconds → work 5 seconds
expected active duration: 15 seconds
```

Use a consistent timestamp representation, such as epoch milliseconds, and convert only for display. Document that device wall-clock changes are a limitation of this initial approach; timestamp-based recovery alone does not solve clock adjustments.

## 5. Set up basic styling and theming

Use React Native Reusables for basic components and adopt its theme conventions. Start with a small theme: one accent color, neutral surfaces, consistent spacing and corner radii, and a few text roles. Use the platform font initially.

### Install and verify the styling setup

Follow the [Reusables installation guide](https://reactnativereusables.com/docs/installation) for your existing Expo project in `mobile/`. Choose one supported styling library, NativeWind or Uniwind, and follow that path consistently. Match the documentation to the installed major version; NativeWind versions have different configuration approaches.

Installation and component-generation commands modify project files and dependencies. Run them manually, and add only the components you need initially, such as Button, Text, and Input. Verify one styled component on your phone before customizing the theme.

### Define colors by purpose

Keep the semantic token names from [Reusables’ manual setup](https://reactnativereusables.com/docs/installation/manual), with light and dark values for each:

| Token | Purpose |
|---|---|
| `background` / `foreground` | Screen background and normal text |
| `card` / `card-foreground` | Session cards and their text |
| `primary` / `primary-foreground` | Primary action and its text |
| `muted` / `muted-foreground` | Subtle surfaces and secondary text |
| `border` | Separators and outlines |
| `destructive` | Destructive actions such as discarding a session |

Screens should use semantic classes such as `bg-background` and `text-foreground`, rather than hardcoded colors or separate light/dark checks in every component. Choose foreground colors to contrast with their paired backgrounds.

Use your styling library’s theme mechanism instead of building a custom theme engine. For NativeWind, see its [themes guide](https://www.nativewind.dev/docs/guides/themes) for variable-based colors. Keep layout in utility classes; use React Native styles when they make dynamic values clearer.

### Plan for light, dark, and system preferences

Distinguish the saved preference from the appearance currently displayed:

```text
Saved preference: system | light | dark
Resolved appearance: light | dark
```

Resolve `system` from the device’s current appearance; otherwise use the explicit choice. When adding persistence, save the preference so that System continues following device changes. Load it before displaying the main UI to avoid a flash of the wrong theme.

Dark can remain the initial default, consistent with the product requirements. Define and check both palettes early; the user-facing settings control can come later.

Apply the resolved appearance centrally, keeping component colors, navigation headers, tabs, and status-bar content consistent. Follow [Expo’s color-theme guide](https://docs.expo.dev/develop/user-interface/color-themes/) for `userInterfaceStyle` configuration and Android’s `expo-system-ui` requirement. Connect navigation colors to the same semantic palette rather than maintaining an unrelated set of colors.

### Implement in small steps

1. Verify Reusables with its initial palette on your phone.
2. Customize semantic colors and corner radius.
3. Style Timer, then reuse the conventions in History.
4. Check both appearances, including pressed/disabled controls, secondary text, dialogs, and larger system text sizes.
5. Add a persisted System/Light/Dark setting when building Settings.

Success criterion: switching appearance restyles the Timer screen without changing screen-specific color logic. A full settings screen is not required for Milestone 1.

## 6. Add minimal local persistence

For this milestone, use AsyncStorage for a small amount of non-sensitive session data. It provides persistent, unencrypted key-value storage and is available in Expo Go. See [Expo’s AsyncStorage documentation](https://docs.expo.dev/versions/latest/sdk/async-storage/).

Run inside `mobile/` when you reach this checkpoint:

```sh
npx expo install @react-native-async-storage/async-storage
```

**Effect:** installs a dependency and changes dependency files.

Persist changes when users start, pause, resume, stop, or save—not every display tick. Load saved state before allowing actions or writing defaults, so startup does not overwrite an existing session.

Keep storage writes ordered, show failures, and preserve pending completion until saving succeeds. Use the same session ID when retrying to avoid duplicate history entries. If history and pending review are stored separately, account for an interruption between those writes; a single small snapshot can simplify the initial design.

Use [React Native AppState](https://reactnative.dev/docs/appstate) to refresh the display when returning to the foreground. Recovery should work from persisted timestamps even when no background callback runs.

Local persistence is not cloud synchronization. Accounts, network retry queues, and multi-device coordination remain later work.

## 7. Milestone 1 checklist

- [ ] Expo app runs on my physical phone.
- [ ] Timer and History navigation works.
- [ ] Start creates exactly one active session.
- [ ] Pause/resume excludes paused time.
- [ ] Stop freezes the duration, including when already paused.
- [ ] Goal and focus rating are optional.
- [ ] Saving adds exactly one history entry.
- [ ] History survives reopening the app.
- [ ] Navigation, screen lock, and backgrounding preserve timing.
- [ ] Restart restores running, paused, or pending-review state.
- [ ] Storage failures are visible and do not silently discard the session.
- [ ] Empty history and primary controls are clear and accessible.
- [ ] Timer and History use shared semantic colors, with both palettes checked during development.
- [ ] I have used it for several real work sessions.
- [ ] README includes startup instructions and a screenshot.
- [ ] Short ADRs explain stopwatch scope and the timing/storage model.

Verify recovery by actually closing and reopening the app, including while paused and during completion review. Rapidly tap Stop and Save to check for duplicates. Fast Refresh alone does not demonstrate restart recovery.

For duration calculations, verify at least: no pauses, one pause, multiple pauses, stopping while paused, and reconstruction from saved state. Keep calculations independent of the UI so these cases can be tested with fixed timestamps.

Expo Go is enough for the first development checkpoint. Use the [development-build guide](https://docs.expo.dev/develop/development-builds/introduction/) when moving toward regular personal use; running through Expo Go is different from distributing your own app build.

For each ADR, briefly record the context, options, decision, consequences, and what would cause you to revisit it. The engineering roadmap contains a fuller template.

## 8. Begin backend learning after the phone checkpoint

Keep Python preparation short: functions, collections, modules, exceptions, type hints, and datetime handling. You can practice these alongside mobile development without making a long language course a prerequisite.

- [uv installation](https://docs.astral.sh/uv/getting-started/installation/): prepare Python environment and dependency management.
- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/): focus first on routes, request bodies, response models, and validation.

The next milestone should progress through:

1. A local FastAPI health endpoint.
2. PostgreSQL with SQLAlchemy ORM and Alembic migrations.
3. Completed-session creation and listing, with validation and basic tests.
4. Mobile integration and visible network-error handling.

The active timer can remain on the phone while the API stores completed sessions. Start with synchronous FastAPI endpoints and database access, as the roadmap recommends.

Defer AWS setup, authentication, billing, analytics, and offline synchronization until their milestones. Before authentication and user isolation exist, any hosted demonstration must use synthetic data and appropriate access restrictions, as required by the product specification.

## First work session

Aim only to scaffold Expo, open it on your phone, change visible text, and identify how its routes are organized. Begin the Timer and History screens once that loop works.
