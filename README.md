# OpenKintai

A minimal clock-in/clock-out (attendance) tracker for small businesses — cafes, bars, and similar. Staff clock in and out, and can review their own shift history month by month; managers can review anyone's.

By design, OpenKintai has no internal user management or password auth. Identity and authentication are fully delegated to an external OpenID Connect (OIDC) provider — users are created automatically on first login, and manager access is granted via OIDC group membership rather than an in-app role system.

## Features

- Clock in / clock out, with a server-side guard against double clock-ins or closing an already-closed shift
- Month-scoped shift history with a prev/next month picker
- CSV export of a month's shifts
- Manager view of any user's shift history (read-only), gated by OIDC group membership, with an optional shortcut link out to the OIDC provider's user management screen
- Login via any standards-compliant OIDC provider

## Tech stack

- [Nuxt 4](https://nuxt.com/) with the `app/` directory layout
- [NuxtHub](https://hub.nuxt.com/) for the Postgres/Drizzle wiring
- [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL)
- [Vuetify](https://vuetifyjs.com/) for the UI
- [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) for session-based OIDC auth

## Setup

Requires Node.js, a PostgreSQL database, and an OIDC provider (e.g. Authentik, Keycloak, Auth0) with a confidential client configured for this app.

```bash
npm install
```

Copy `.env.example` to `.env` (or create `.env` directly) and fill in the variables below, then:

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

## Environment variables

| Variable                        | Description                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                  | PostgreSQL connection string                                                                  |
| `NUXT_SESSION_PASSWORD`         | Random 32+ character secret used to encrypt session cookies                                   |
| `NUXT_OAUTH_OIDC_CLIENT_ID`     | OIDC client ID                                                                                |
| `NUXT_OAUTH_OIDC_CLIENT_SECRET` | OIDC client secret                                                                            |
| `NUXT_OAUTH_OIDC_OPENID_CONFIG` | URL of the provider's OpenID Connect discovery document (`/.well-known/openid-configuration`) |
| `NUXT_OAUTH_OIDC_REDIRECT_URL`  | Optional explicit OIDC callback URL (e.g. `https://openkintai.example.com/auth/oidc`). Only needed behind a proxy/tunnel that doesn't set `X-Forwarded-Proto` correctly — see below. |
| `NUXT_MANAGER_GROUP`            | Name of the OIDC group whose members are granted manager access (view other users' shifts)    |
| `NUXT_PUBLIC_LOCALE`            | Locale used to format displayed timestamps (e.g. `ja-JP`, `en-US`). Defaults to `ja-JP`.      |
| `NUXT_PUBLIC_USER_MANAGEMENT_URL` | Optional link to your OIDC provider's user management screen (e.g. an Authentik users page), shown as a "Manage users" button on the Users page. Omit to hide the button. |
| `TZ`                            | Timezone the server process runs in. **Must match the business's real timezone** — see below. |

## Timezone

Shift timestamps are stored without a timezone, and month boundaries (used for the shift history view) are computed in the server process's local time. For shifts to be attributed to the correct month, the deployment's `TZ` environment variable must match the business's actual timezone (e.g. `TZ=Asia/Tokyo`) — otherwise shifts near midnight can be misfiled into the wrong month.

## Reverse proxies / tunnels

By default, the OIDC callback URL sent to your provider is inferred from the incoming request (scheme + host), trusting the `X-Forwarded-Proto` header. Behind Cloudflare Tunnel specifically, that header isn't always set the way this expects, so the app can end up telling your OIDC provider its callback is `http://...` even though it's actually served over `https://`, which the provider will reject as a redirect URI mismatch.

If you hit that, set `NUXT_OAUTH_OIDC_REDIRECT_URL` to the exact public callback URL (e.g. `https://openkintai.example.com/auth/oidc`) — this bypasses the header-based inference entirely and must match what's registered with your OIDC provider.

## Database migrations

Schema is defined in `server/db/schema.ts`. After changing it, generate a migration:

```bash
npx nuxt db generate
```

Generated migrations are written to `server/db/migrations/postgresql/`. NuxtHub auto-applies pending migrations on `npm run dev` start, but **not** in production (see below) — apply them explicitly with:

```bash
npx nuxt db migrate
```

## Production

```bash
npm run build
npm run preview   # to preview the production build locally
```

`DATABASE_URL` is a runtime-only concern — the build itself never needs or touches it. `hub.db.driver` is explicitly set to `postgres-js` in `nuxt.config.ts` so NuxtHub doesn't need `DATABASE_URL` at build time to pick the right driver (without that, it would silently fall back to an embedded `pglite` database when the var is absent during a build, a decision that can't be undone at runtime afterwards). `hub.db.applyMigrationsDuringBuild` is also set to `false`, since a build environment shouldn't need database access at all. Apply migrations as their own deploy step, with `DATABASE_URL` set in that environment:

```bash
npx nuxt db migrate
```

## Docker

A two-stage `Dockerfile` is included: it builds the app in a full `node:22-alpine` image, then copies only the built `.output/` into a lean final image that runs as the non-root `node` user. Listens on `PORT` (default `3000`) and `HOST` (default `0.0.0.0`).

The build needs no database access or secrets at all — `DATABASE_URL` only needs to be set when running the container:

```bash
docker build -t openkintai .
docker run -p 3000:3000 --env-file .env openkintai
```

The image never applies database migrations itself — run `npx nuxt db migrate` from an environment with `DATABASE_URL` set, separately from `docker run`.
