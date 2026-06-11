-- captheflag-web: PostgreSQL table creation script
--
-- Run this against your shared Postgres database.
-- These tables sit alongside bf1942-admin-web's tables (User, Server, Ban, etc.)
-- with no naming conflicts.
--
-- Usage:
--   psql $DATABASE_URL -f scripts/create-tables.sql
-- or via psql prompt:
--   \i scripts/create-tables.sql

-- Admin users for the captheflag.com CMS
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id"           SERIAL      PRIMARY KEY,
  "username"     TEXT        NOT NULL UNIQUE,
  "passwordHash" TEXT        NOT NULL
);

-- News posts
CREATE TABLE IF NOT EXISTS "Post" (
  "id"        SERIAL      PRIMARY KEY,
  "slug"      TEXT        NOT NULL UNIQUE,
  "title"     TEXT        NOT NULL,
  "content"   TEXT        NOT NULL,
  "game"      TEXT,                             -- 'bf1942' | 'bfv' | NULL (site-wide)
  "published" BOOLEAN     NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Static pages (rules, about — managed via admin CMS)
CREATE TABLE IF NOT EXISTS "Page" (
  "id"      SERIAL PRIMARY KEY,
  "slug"    TEXT   NOT NULL UNIQUE,             -- 'rules' | 'about'
  "title"   TEXT   NOT NULL,
  "content" TEXT   NOT NULL
);

-- Auto-update updatedAt on Post changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS post_updated_at ON "Post";
CREATE TRIGGER post_updated_at
  BEFORE UPDATE ON "Post"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
