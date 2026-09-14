# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OpenKintai is a minimal clock-in/clock-out (attendance) tracker built on Nuxt 4 + NuxtHub + Vuetify, with Postgres/Drizzle for storage and OIDC for auth.

**Design principle: stay minimal.** This app deliberately has no internal user management and no internal auth system — identity and authentication are fully delegated to the OIDC provider. `isManager` is a group check performed at login, not a role system — it only grants the ability to view other users' shifts. Don't add user CRUD, invite/signup flows, password auth, permission management UI, or similar — if it's not already here, it's out of scope unless the user asks for it.

## Commands

- `npm run dev` — start the dev server at `http://localhost:3000`
- `npm run build` — production build
- `npm run generate` — static generation
- `npm run preview` — preview a production build
- `npx nuxt db generate` — generate a new migration after editing `server/db/schema.ts` (NuxtHub's own CLI command; it runs `nuxt prepare`, rebuilds the schema, then calls `drizzle-kit generate` under the hood). Generated migrations go in `server/db/migrations/postgresql/`. NuxtHub auto-applies pending migrations on `npm run dev` start, but `hub.db.applyMigrationsDuringBuild` is explicitly set to `false` in `nuxt.config.ts` (the Dockerfile build has no `DATABASE_URL`, so leaving this on the default `true` would silently apply migrations to a throwaway `pglite` instance instead of the real database) — apply migrations in production with `npx nuxt db migrate` as its own deploy step.

There is no lint or test setup in this repo currently.

## Architecture

- **Nuxt 4 app directory layout**: pages/components/middleware/plugins live under `app/`, not the repo root.
- **NuxtHub (`@nuxthub/core`) owns the database wiring.** `hub.db` in `nuxt.config.ts`, combined with `server/db/schema.ts`, causes NuxtHub to generate the `@nuxthub/db` module. This exposes two server-side auto-imported globals used throughout `server/api/**` and `server/utils/**`: `db` (a Drizzle client) and `schema` (the Drizzle schema from `server/db/schema.ts`). Neither is imported explicitly in route handlers — they're ambient globals, resolved via `.nuxt/types/nitro-imports.d.ts`. Do not add manual imports for them.
- **Two-table schema** (`server/db/schema.ts`): `users` (keyed by `(issuer, sub)` from OIDC, plus `isManager`) and `shifts` (`user_id`, `clockIn`, nullable `clockOut`). An open shift is one where `clockOut` is null.
- **Auth flow**:
  - `server/routes/auth/oidc.get.ts` handles the OIDC callback (`nuxt-auth-utils`'s `defineOAuthOidcEventHandler`), decodes the ID token to get the issuer, and calls `upsertUser` (`server/utils/users.ts`) to create/update the local user row and set the session.
  - The OIDC redirect URI defaults to being inferred from the request (trusting `X-Forwarded-Proto`), which breaks behind proxies/tunnels that don't set that header correctly (observed with Cloudflare Tunnel — the app told Authentik its callback was `http://` while actually served over `https://`). `runtimeConfig.oauth.oidc.redirectURL` (`NUXT_OAUTH_OIDC_REDIRECT_URL`) overrides it explicitly; leave unset unless a deployment needs it.
  - `isManager` is derived purely from OIDC `groups` matching `runtimeConfig.managerGroup` (`NUXT_MANAGER_GROUP` env var) at login/upsert time — it is not editable elsewhere.
  - `server/middleware/auth.ts` requires a session for every `/api/*` request (`requireUserSession`).
  - `app/middleware/auth.global.ts` is a Nuxt global route middleware that redirects unauthenticated users to `/login` for every page except `/login` and `/auth/*`.
  - Session `User` shape is declared in `shared/types/auth.d.ts` (augments `#auth-utils`).
- **API routes** (`server/api/**`) are thin: read the session user, run one Drizzle query/mutation against `db`/`schema`, return the result. `shifts` endpoints scope to `user.id` from the session; `users/[id]/shifts` and `users` (used by the "view another user's shifts" pages) do not check `isManager` server-side — the `Users` nav link (`app/app.vue`) is only hidden client-side via `user?.isManager`. This is consistent with the minimal-auth design above (any authenticated OIDC user can reach these routes); don't "fix" it by adding a role/permission layer unless asked.
- **Frontend**: Vuetify (`app/plugins/vuetify.ts`, dark theme by default) for all UI. `/` is the clock-in/out + own-history page (`app/pages/index.vue`); `/users` and `/users/[id]/shifts` are the manager-only views, mirroring the `users`/`users/[id]/shifts` API routes. `app/utils/dateUtils.ts` has shared formatting helpers (`formatTimestamp`, `timeBetweenTimeStamps`) used by the shift tables.
- **Config**: `nuxt.config.ts` declares `runtimeConfig.managerGroup`, `runtimeConfig.oauth.oidc.{clientId,clientSecret,openidConfig}`, and `runtimeConfig.public.{locale,userManagementUrl}` (`locale` used by `formatTimestamp` in `app/utils/dateUtils.ts`; `userManagementUrl` is an optional external link — e.g. to the OIDC provider's user admin screen — shown as a button on `/users` when set), populated via env vars in `.env` (`NUXT_MANAGER_GROUP`, `NUXT_OAUTH_OIDC_*`, `NUXT_PUBLIC_LOCALE`, `NUXT_PUBLIC_USER_MANAGEMENT_URL`, plus `DATABASE_URL` and `NUXT_SESSION_PASSWORD`).
- **Timezone**: `shifts.clockIn`/`clockOut` are plain `timestamp` columns (no timezone), and month-boundary queries (`server/api/shifts/index.get.ts` and friends) build `Date`s from `(year, month, 1)`, which JS interprets in the server process's local timezone. This only produces correct month attribution if the deployment's `TZ` env var matches the business's real timezone — set `TZ` (e.g. `TZ=Asia/Tokyo`) wherever the app is deployed. This is a deliberate operational fix rather than a code-level one (storing `timestamptz` + an explicit configured zone), consistent with this app's one-deployment-per-business assumption.
