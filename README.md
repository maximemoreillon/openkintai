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
| `NUXT_MANAGER_GROUP`            | Name of the OIDC group whose members are granted manager access (view other users' shifts)    |
| `NUXT_PUBLIC_LOCALE`            | Locale used to format displayed timestamps (e.g. `ja-JP`, `en-US`). Defaults to `ja-JP`.      |
| `NUXT_PUBLIC_USER_MANAGEMENT_URL` | Optional link to your OIDC provider's user management screen (e.g. an Authentik users page), shown as a "Manage users" button on the Users page. Omit to hide the button. |
| `TZ`                            | Timezone the server process runs in. **Must match the business's real timezone** — see below. |

## Timezone

Shift timestamps are stored without a timezone, and month boundaries (used for the shift history view) are computed in the server process's local time. For shifts to be attributed to the correct month, the deployment's `TZ` environment variable must match the business's actual timezone (e.g. `TZ=Asia/Tokyo`) — otherwise shifts near midnight can be misfiled into the wrong month.

## Database migrations

Schema is defined in `server/db/schema.ts`. After changing it, generate a migration:

```bash
npx nuxt db generate
```

(NuxtHub writes that config file at dev/build time — run `npm run dev` at least once first if `.nuxt/hub` doesn't exist yet.) Generated migrations are written to `server/db/migrations/postgresql/` and applied automatically by NuxtHub on startup.

## Production

```bash
npm run build
npm run preview   # to preview the production build locally
```

Deploy the result behind Node with the environment variables above set, and a reachable PostgreSQL database.
