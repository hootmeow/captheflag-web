# captheflag.com — Deploy & Migration Guide

This covers shipping the **portal redesign** to the existing server, and standing
up a **dev server** to test it first. The redesign is **code-only — no database
migration is required** (no Prisma schema changes), so the risky parts are just
env config and the build.

---

## 0. What changed (why this matters for deploy)

| Area | Before | After |
|---|---|---|
| Identity | Portal duplicated BF1942 content; BFV was a "Coming Soon" stub | Portal aggregates **live status + stats** for both games and links into the subdomains |
| Live data source | BF1942 admin panel `/api/public/status` | **Each game's stats engine** over localhost (`lib/stats.ts`) |
| New env vars | — | `BF1942_STATS_URL`, `BFV_STATS_URL` |
| New dependency | — | `server-only` (in `package.json`) |
| Fonts | Geist | Geist + **Oswald** (fetched from Google Fonts **at build time**) |
| DB schema | `Post`, `Page`, `AdminUser` | **unchanged** |

**Implication:** the portal now expects the two FastAPI stats engines to be
reachable from the box it runs on. They already run there (BF1942 `:8000`, BFV
`:8001`). If an engine is down, the portal still renders — those sections just
fall back to empty ("No servers reporting…"). It never crashes the page.

---

## 1. Architecture on the box

```
                          ┌─────────────────────────────────────────┐
  Browser ──── nginx ─────┤ captheflag.com        → :3001  (portal)  │
                          │ bf1942.captheflag.com → :8000  (BF1942)  │
                          │ bfv.captheflag.com    → :8001  (BFV)     │
                          └─────────────────────────────────────────┘
                                       │  portal fetches (server-side, localhost)
                                       ▼
                          http://127.0.0.1:8000/api/v1/...   (BF1942 stats)
                          http://127.0.0.1:8001/api/v1/...   (BFV stats)
```

The portal → stats calls are **server-to-server over localhost** and never touch
the public internet, so there's no new public API surface to secure.

---

## 2. Environment variables

Add these to the portal's `.env` (see `.env.example`). Only the two `*_STATS_URL`
lines are new:

```bash
# full public subdomains the portal links OUT to
BF1942_API_URL="https://bf1942.captheflag.com"
BFV_API_URL="https://bfv.captheflag.com"

# NEW — internal stats engines, localhost only
BF1942_STATS_URL="http://127.0.0.1:8000"
BFV_STATS_URL="http://127.0.0.1:8001"

NEXT_PUBLIC_DISCORD_URL="https://discord.gg/yourserver"
NEXT_PUBLIC_SITE_URL="https://captheflag.com"
# DATABASE_URL / JWT_SECRET unchanged
```

If you omit the `*_STATS_URL` vars, `lib/stats.ts` defaults to `127.0.0.1:8000`
and `:8001` anyway — but set them explicitly so it's obvious.

---

## 3. Deploy to the EXISTING server

A script is provided — `scripts/deploy.sh`. Manual steps if you prefer:

```bash
cd /opt/captheflag-web                 # wherever the portal lives
git pull                               # get the redesign

# Install deps (adds server-only). The build fetches the Oswald font from
# Google Fonts, so the box needs outbound internet during `npm run build`.
npm ci                                 # or: npm install

# Make sure the two new env vars are present
grep -q BF1942_STATS_URL .env || echo 'BF1942_STATS_URL="http://127.0.0.1:8000"' >> .env
grep -q BFV_STATS_URL    .env || echo 'BFV_STATS_URL="http://127.0.0.1:8001"'    >> .env

# Confirm the stats engines answer locally (should print JSON with "ok":true)
curl -s http://127.0.0.1:8000/api/v1/health
curl -s http://127.0.0.1:8001/api/v1/health

npm run build                          # production build
sudo systemctl restart captheflag-web  # restart the portal (see unit below)
```

**No `prisma db push` / `db:seed` needed** — schema is unchanged.

### systemd unit (if not already present)

`/etc/systemd/system/captheflag-web.service`:

```ini
[Unit]
Description=captheflag.com portal (Next.js)
After=network.target

[Service]
Type=simple
User=captheflag
WorkingDirectory=/opt/captheflag-web
EnvironmentFile=/opt/captheflag-web/.env
ExecStart=/usr/bin/npm start          # runs `next start --port 3001`
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now captheflag-web
```

### nginx (portal vhost — the subdomains already have their own)

```nginx
server {
    server_name captheflag.com www.captheflag.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # certbot manages the listen 443 / ssl_* lines
}
```

---

## 4. Stand up a DEV server to test first (recommended)

You don't need to duplicate the whole stats stack to test the UI. Three options,
easiest first:

### Option A — dev box, point at PROD stats over an SSH tunnel (fastest, real data)
On your dev machine:

```bash
# Tunnel prod's stats engines to your local ports 8000/8001 (read-only GETs)
ssh -N -L 8000:127.0.0.1:8000 -L 8001:127.0.0.1:8001 you@prod-box &

cp .env.example .env        # fill DATABASE_URL (a dev DB), JWT_SECRET
# stats URLs default to 127.0.0.1:8000/8001 → the tunnel
npm install
npm run dev                 # http://localhost:3001
```

You get live production stats in your local UI without copying any data. The
portal only issues `GET`s, so this is safe.

### Option B — full dev replica on a second VPS
Deploy the portal + both stats engines on a staging box (`dev.captheflag.com`),
each engine on the same `:8000/:8001` ports with their own dev databases. Then
follow §3 against that box. Use this if you also want to test ingest/aggregation.

### Option C — no stats engines at all
Just run `npm run dev` with no engines reachable. Every stats section fails soft
and shows empty states — fine for working on layout/theming, not for data.

### Smoke test checklist (dev or prod)
- [ ] Home shows two game panels; "in-game now" / "servers online" populate
- [ ] `/games/bf1942` and `/games/bfv` show live servers + weekly leaders
- [ ] `/servers` lists both games grouped
- [ ] Stop one engine → that game's sections show empty state, page still loads
- [ ] Nav game dropdowns link to `bf1942.captheflag.com` / `bfv.captheflag.com`
- [ ] `/news`, `/rules`, `/about`, `/admin` still work (unchanged)

---

## 5. Rollback

Code-only deploy, so rollback is just:

```bash
cd /opt/captheflag-web
git checkout <previous-commit>
npm ci && npm run build
sudo systemctl restart captheflag-web
```

No DB state to revert.

---

## 6. Adding a third game later

Everything is registry-driven. Add an entry to `lib/games.ts` (name, subdomain,
`statsBaseEnv`, theme classes), add the matching `*_STATS_URL` env var, create
`app/games/<id>/page.tsx` (copy an existing one), and the nav, footer, home board
and `/servers` page pick it up automatically.
