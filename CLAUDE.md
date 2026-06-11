# CLAUDE.md

captheflag.com — **portal / community hub** for classic Battlefield. It does NOT
host a game's full experience; each game has its own site + stats engine at a
subdomain (bf1942.captheflag.com, bfv.captheflag.com). The portal aggregates live
status + stats highlights from both and funnels users into the subdomains.

## Core model

- `lib/games.ts` — the single source of truth for both games (BF1942, BFV): name,
  subdomain URL, stats-engine env var, and a per-game **theme** of full literal
  Tailwind class strings (amber = BF1942, emerald = BFV). Never interpolate these
  classes (`bg-${x}`) — the JIT won't emit them. Add a game here and nav/footer/
  home pick it up automatically.
- `lib/stats.ts` — **server-side** client for the per-game stats engines (FastAPI).
  Both engines run on the same box, so it talks to them over localhost
  (BF1942_STATS_URL :8000, BFV_STATS_URL :8001). There is no public stats API.
  Endpoints used: `/api/v1/servers`, `/api/v1/leaderboard/weekly`,
  `/api/v1/metrics/global`. Every call fails soft (returns null/[]).
- Per-game UI: `GameTheaterCard` (home board), `GameLanding` (game page template),
  `LiveServersList`, `WeeklyLeaders`, `StatTile`. Game pages (`app/games/*`) are
  thin — they pass content into `GameLanding`.

**Port:** 3001 (bf1942-admin-web and bf1942-site use separate ports — do not modify those projects)

## Commands

```bash
# First time setup
cp .env.example .env          # fill in DATABASE_URL, JWT_SECRET, etc.
npm install
bash scripts/setup-db.sh     # creates tables + seeds default admin + pages

# Development
npm run dev                   # http://localhost:3001

# Production
npm run build && npm start
```

## Database Setup (manual alternative to setup-db.sh)

```bash
psql $DATABASE_URL -f scripts/create-tables.sql   # create tables
npm run db:generate                                # generate Prisma client
npm run db:seed                                    # seed admin user + pages
```

## Architecture

Standard Next.js 15 App Router with no custom HTTP server (no Socket.io needed here).

- Public pages: `/`, `/servers`, `/games/bf1942`, `/games/bfv`, `/news`, `/news/[slug]`, `/rules`, `/about`
- Admin CMS: `/admin/**` — protected by middleware, JWT cookie
- Admin login: `/login`

## Auth

Same JWT + httpOnly cookie pattern as bf1942-admin-web. `middleware.ts` only protects `/admin/**`. All other routes are fully public.

## Database

Shared PostgreSQL instance with bf1942-admin-web. Three models: `Post`, `Page`, `AdminUser`.
No table name conflicts — bf1942-admin-web uses `User`, `Server`, `Ban`, `MapRotation`, `AuditLog`.

- `Post` — news articles. `game` field: "bf1942" | "bfv" | null (site-wide).
- `Page` — static pages with slugs "rules" and "about". Seeded by `npm run db:seed`.
- `AdminUser` — CMS login users. Managed via `/admin/users`.

## Server Status

Home, servers and game pages fetch live status + stats from each game's stats
engine over localhost (see `lib/stats.ts`), revalidating every 30s (servers) /
120–300s (metrics, leaderboards). This replaced the old admin-panel
`/api/public/status` fetch so both games use one uniform source.

## Environment

```
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="..."
PORT=3001
BF1942_API_URL="https://bf1942.captheflag.com"
BFV_API_URL="https://bfv.captheflag.com"
NEXT_PUBLIC_DISCORD_URL="https://discord.gg/yourserver"
NEXT_PUBLIC_SITE_URL="https://captheflag.com"
```
