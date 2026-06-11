#!/usr/bin/env bash
# Quick dev-server bootstrap for captheflag-web.
# Run from the project root: bash scripts/dev-server-setup.sh
# BFV stats engine must already be running on :8001.

set -e
cd "$(dirname "$0")/.."

# ── DB defaults (match bfv-stats dev setup) ───────────────────────────────────
CTF_DB="${CTF_DB:-captheflag}"
CTF_USER="${CTF_USER:-captheflag_user}"
CTF_PASS="${CTF_PASS:-devpassword}"

# ── 1. Create Postgres user + database (idempotent) ───────────────────────────
echo ""
echo "==> Creating PostgreSQL user '${CTF_USER}' and database '${CTF_DB}'"
sudo -u postgres psql <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${CTF_USER}') THEN
    CREATE USER ${CTF_USER} WITH PASSWORD '${CTF_PASS}';
  END IF;
END \$\$;
ALTER USER ${CTF_USER} WITH PASSWORD '${CTF_PASS}';
SELECT 'CREATE DATABASE ${CTF_DB} OWNER ${CTF_USER}'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${CTF_DB}')\gexec
GRANT ALL PRIVILEGES ON DATABASE ${CTF_DB} TO ${CTF_USER};
SQL
sudo -u postgres psql -d "${CTF_DB}" -c "GRANT ALL ON SCHEMA public TO ${CTF_USER};"
echo "    PostgreSQL ready."

# ── 2. Build .env if missing or still has placeholder DATABASE_URL ────────────
if [ ! -f .env ] || grep -q 'username:password' .env 2>/dev/null; then
  echo ""
  echo "==> Setting up .env"

  DB_URL="postgresql://${CTF_USER}:${CTF_PASS}@localhost:5432/${CTF_DB}"

  JWT=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))" 2>/dev/null \
        || openssl rand -hex 48)

  cat > .env <<EOF
DATABASE_URL="${DB_URL}"
JWT_SECRET="${JWT}"
PORT=3001
NODE_ENV=development

# Stats engines (server-side only, not exposed to browser)
BF1942_STATS_URL="http://127.0.0.1:8000"
BFV_STATS_URL="http://127.0.0.1:8001"

# Public subdomain links
BF1942_API_URL="https://bf1942.captheflag.com"
BFV_API_URL="https://bfv.captheflag.com"

NEXT_PUBLIC_DISCORD_URL="https://discord.gg/yourserver"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
EOF
  echo "    .env written."
else
  echo "==> .env already exists, leaving it alone."
  grep -q BFV_STATS_URL .env    || echo 'BFV_STATS_URL="http://127.0.0.1:8001"'    >> .env
  grep -q BF1942_STATS_URL .env || echo 'BF1942_STATS_URL="http://127.0.0.1:8000"' >> .env
fi

# ── 3. Install dependencies ───────────────────────────────────────────────────
echo ""
echo "==> npm install"
npm install

# ── 4. Database schema + seed ─────────────────────────────────────────────────
echo ""
echo "==> Generating Prisma client"
npm run db:generate

echo ""
echo "==> Creating tables (idempotent)"
export $(grep -E '^DATABASE_URL=' .env | head -1 | xargs)
psql "$DATABASE_URL" -f scripts/create-tables.sql

echo ""
echo "==> Seeding default admin user and pages"
npm run db:seed

# ── 5. Verify BFV stats engine is reachable ───────────────────────────────────
echo ""
echo "==> Checking BFV stats engine at :8001 ..."
if curl -sf http://127.0.0.1:8001/api/v1/health > /dev/null 2>&1; then
  echo "    OK — BFV engine is up."
else
  echo "    WARNING: BFV engine not responding on :8001 — stats sections will show empty state."
fi

# ── 6. Start dev server ───────────────────────────────────────────────────────
echo ""
echo "==> Starting dev server on http://localhost:3001"
echo "    (Ctrl-C to stop)"
npm run dev
