#!/usr/bin/env bash
#
# Deploy / update the captheflag.com portal on a server (existing or dev).
# Code-only deploy: pulls latest, installs deps, verifies the stats engines are
# reachable, builds, and restarts the systemd service.
#
# Usage:
#   ./scripts/deploy.sh                # full deploy (pull, install, build, restart)
#   ./scripts/deploy.sh --no-pull      # skip git pull (deploy working tree as-is)
#   ./scripts/deploy.sh --no-restart   # build but don't restart the service
#   SERVICE=my-unit ./scripts/deploy.sh   # override systemd unit name
#
# Env (optional overrides):
#   SERVICE          systemd unit to restart        (default: captheflag-web)
#   BF1942_STATS_URL bf1942 stats engine base URL   (default: http://127.0.0.1:8000)
#   BFV_STATS_URL    bfv stats engine base URL      (default: http://127.0.0.1:8001)

set -euo pipefail

SERVICE="${SERVICE:-captheflag-web}"
BF1942_STATS_URL="${BF1942_STATS_URL:-http://127.0.0.1:8000}"
BFV_STATS_URL="${BFV_STATS_URL:-http://127.0.0.1:8001}"

DO_PULL=1
DO_RESTART=1
for arg in "$@"; do
  case "$arg" in
    --no-pull) DO_PULL=0 ;;
    --no-restart) DO_RESTART=0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

# Run from the repo root regardless of where the script is invoked
cd "$(dirname "$0")/.."

say()  { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[!]\033[0m %s\n' "$*"; }
die()  { printf '\033[1;31m[x]\033[0m %s\n' "$*" >&2; exit 1; }

command -v node >/dev/null || die "node is not on PATH"
command -v npm  >/dev/null || die "npm is not on PATH"

# 1. Pull latest
if [ "$DO_PULL" -eq 1 ]; then
  say "Pulling latest from git…"
  git pull --ff-only
else
  warn "Skipping git pull (--no-pull)"
fi

# 2. Ensure the new env vars exist (don't overwrite if already set)
if [ -f .env ]; then
  grep -q '^BF1942_STATS_URL=' .env || { echo "BF1942_STATS_URL=\"$BF1942_STATS_URL\"" >> .env; say "Added BF1942_STATS_URL to .env"; }
  grep -q '^BFV_STATS_URL='    .env || { echo "BFV_STATS_URL=\"$BFV_STATS_URL\""       >> .env; say "Added BFV_STATS_URL to .env"; }
else
  warn ".env not found — copy .env.example to .env and fill it in before serving"
fi

# 3. Install dependencies
say "Installing dependencies…"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# 4. Health-check the stats engines (non-fatal — portal fails soft)
check_engine() {
  local name="$1" url="$2"
  if curl -fsS --max-time 4 "$url/api/v1/health" >/dev/null 2>&1; then
    say "$name stats engine OK   ($url)"
  else
    warn "$name stats engine NOT reachable ($url) — that game's sections will show empty until it's up"
  fi
}
say "Checking stats engines…"
check_engine "BF1942" "$BF1942_STATS_URL"
check_engine "BFV"    "$BFV_STATS_URL"

# 5. Build
say "Building (fetches Oswald font from Google Fonts — needs outbound internet)…"
npm run build

# 6. Restart service
if [ "$DO_RESTART" -eq 1 ]; then
  if command -v systemctl >/dev/null && systemctl list-unit-files | grep -q "^${SERVICE}.service"; then
    say "Restarting ${SERVICE}…"
    sudo systemctl restart "$SERVICE"
    sleep 1
    systemctl --no-pager --lines=0 status "$SERVICE" || true
  else
    warn "systemd unit '${SERVICE}' not found — start the portal manually with: npm start"
  fi
else
  warn "Skipping restart (--no-restart). Run: sudo systemctl restart ${SERVICE}"
fi

say "Done. Portal should be live on port 3001."
