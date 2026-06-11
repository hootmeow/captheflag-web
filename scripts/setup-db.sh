#!/usr/bin/env bash
# captheflag-web database setup
# Creates tables and seeds default data.
#
# Usage:
#   bash scripts/setup-db.sh
#
# Requires DATABASE_URL set in .env:
#   DATABASE_URL="postgresql://user:pass@host:5432/dbname"

set -euo pipefail

echo "==> captheflag-web database setup"

if [ ! -f .env ]; then
  echo "ERROR: .env not found. Copy .env.example and fill in your values."
  exit 1
fi

export $(grep -v '^#' .env | xargs)

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set in .env"
  exit 1
fi

echo "--> Creating tables..."
psql "$DATABASE_URL" -f scripts/create-tables.sql

echo "--> Generating Prisma client..."
npx prisma generate

echo "--> Seeding default data (admin user + pages)..."
npx tsx prisma/seed.ts

echo ""
echo "==> Done! Default credentials:"
echo "    Username: admin"
echo "    Password: changeme"
echo ""
echo "IMPORTANT: Change the admin password immediately at /admin/users"
