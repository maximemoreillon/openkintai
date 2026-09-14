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
- `npx drizzle-kit generate --config .nuxt/hub/db/drizzle.config.ts` — generate a new migration after editing `server/db/schema.ts` (NuxtHub writes this drizzle config at dev/build time; run `npm run dev` at least once if `.nuxt/hub` doesn't exist yet). Generated migrations go in `server/db/migrations/postgresql/`.

There is no lint or test setup in this repo currently.

## Architecture

- **Nuxt 4 app directory layout**: pages/components/middleware/plugins live under `app/`, not the repo root.
- **NuxtHub (`@nuxthub/core`) owns the database wiring.** `hub: { db: "postgresql" }` in `nuxt.config.ts`, combined with `server/db/schema.ts`, causes NuxtHub to generate the `@nuxthub/db` module. This exposes two server-side auto-imported globals used throughout `server/api/**` and `server/utils/**`: `db` (a Drizzle client) and `schema` (the Drizzle schema from `server/db/schema.ts`). Neither is imported explicitly in route handlers — they're ambient globals, resolved via `.nuxt/types/nitro-imports.d.ts`. Do not add manual imports for them.
- **Two-table schema** (`server/db/schema.ts`): `users` (keyed by `(issuer, sub)` from OIDC, plus `isManager`) and `shifts` (`user_id`, `clockIn`, nullable `clockOut`). An open shift is one where `clockOut` is null.
- **Auth flow**:
  - `server/routes/auth/oidc.get.ts` handles the OIDC callback (`nuxt-auth-utils`'s `defineOAuthOidcEventHandler`), decodes the ID token to get the issuer, and calls `upsertUser` (`server/utils/users.ts`) to create/update the local user row and set the session.
  - `isManager` is derived purely from OIDC `groups` matching `runtimeConfig.managerGroup` (`NUXT_MANAGER_GROUP` env var) at login/upsert time — it is not editable elsewhere.
  - `server/middleware/auth.ts` requires a session for every `/api/*` request (`requireUserSession`).
  - `app/middleware/auth.global.ts` is a Nuxt global route middleware that redirects unauthenticated users to `/login` for every page except `/login` and `/auth/*`.
  - Session `User` shape is declared in `shared/types/auth.d.ts` (augments `#auth-utils`).
- **API routes** (`server/api/**`) are thin: read the session user, run one Drizzle query/mutation against `db`/`schema`, return the result. `shifts` endpoints scope to `user.id` from the session; `users/[id]/shifts` and `users` (used by the "view another user's shifts" pages) do not check `isManager` server-side — the `Users` nav link (`app/app.vue`) is only hidden client-side via `user?.isManager`. This is consistent with the minimal-auth design above (any authenticated OIDC user can reach these routes); don't "fix" it by adding a role/permission layer unless asked.
- **Frontend**: Vuetify (`app/plugins/vuetify.ts`, dark theme by default) for all UI. Pages under `app/pages/` mirror the API routes (`/shifts`, `/users`, `/users/[id]/shifts`). `app/utils/dateUtils.ts` has shared formatting helpers (`formatTimestamp`, `timeBetweenTimeStamps`) used by the shift tables.
- **Config**: `nuxt.config.ts` declares `runtimeConfig.managerGroup` and `runtimeConfig.oauth.oidc.{clientId,clientSecret,openidConfig}`, populated via env vars in `.env` (`NUXT_MANAGER_GROUP`, `NUXT_OAUTH_OIDC_*`, plus `DATABASE_URL` and `NUXT_SESSION_PASSWORD`).
