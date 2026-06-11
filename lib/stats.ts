// Server-side client for the per-game stats engines (FastAPI).
//
// Both engines run on the SAME box as this portal, so we talk to them over
// localhost — there is no public stats API to harden. Configure the base URLs
// with BF1942_STATS_URL / BFV_STATS_URL (default to the local ports the engines
// listen on: BF1942 :8000, BFV :8001).
//
// Every call fails soft: on any error we return null/[] so the page still
// renders. Keep all fetches `server-only` — these URLs must never reach a
// client bundle.

import 'server-only'
import { GameConfig } from './games'

const DEFAULT_BASE: Record<string, string> = {
  BF1942_STATS_URL: 'http://127.0.0.1:8000',
  BFV_STATS_URL: 'http://127.0.0.1:8001',
}

function baseUrl(game: GameConfig): string {
  return process.env[game.statsBaseEnv] || DEFAULT_BASE[game.statsBaseEnv]
}

async function getJson<T>(url: string, revalidate = 30): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export interface LiveServer {
  id: number
  name: string
  map: string
  players: number
  maxPlayers: number
  state: string
  online: boolean
}

export interface LeaderPlayer {
  rank: number
  playerId: number
  name: string
  rp: number
  rankLabel: string
  kills: number
  kdr: number
  rounds: number
}

export interface GameMetrics {
  totalRounds: number
  totalPlayers: number
  activePlayers24h: number
  currentPlayers: number
  topMap: string | null
}

export interface GameSnapshot {
  servers: LiveServer[]
  leaders: LeaderPlayer[]
  metrics: GameMetrics | null
  /** true if the engine answered at all */
  reachable: boolean
}

/** Live servers the engine is currently polling for this game. */
export async function getLiveServers(game: GameConfig): Promise<LiveServer[] | null> {
  const data = await getJson<{ ok: boolean; servers?: RawServer[] }>(
    `${baseUrl(game)}/api/v1/servers`,
    30,
  )
  if (!data?.ok || !data.servers) return null
  return data.servers.map(normalizeServer)
}

/** Top players over the last 7 days. */
export async function getWeeklyLeaders(
  game: GameConfig,
  limit = 5,
): Promise<LeaderPlayer[] | null> {
  const data = await getJson<{ ok: boolean; leaderboard?: RawLeader[] }>(
    `${baseUrl(game)}/api/v1/leaderboard/weekly?limit=${limit}`,
    300,
  )
  if (!data?.ok || !data.leaderboard) return null
  return data.leaderboard.map(normalizeLeader)
}

/** High-level network totals for this game. */
export async function getGameMetrics(game: GameConfig): Promise<GameMetrics | null> {
  const data = await getJson<RawMetrics>(`${baseUrl(game)}/api/v1/metrics/global`, 120)
  if (!data?.ok) return null
  return {
    totalRounds: data.total_rounds_processed ?? 0,
    totalPlayers: data.total_players_seen ?? 0,
    activePlayers24h: data.active_players_24h ?? 0,
    currentPlayers: data.current_active_players ?? 0,
    topMap: data.popular_maps_7_days?.[0]?.map_name ?? null,
  }
}

/** One round-trip-friendly bundle for a game's portal area. */
export async function getGameSnapshot(
  game: GameConfig,
  leaderLimit = 5,
): Promise<GameSnapshot> {
  const [servers, leaders, metrics] = await Promise.all([
    getLiveServers(game),
    getWeeklyLeaders(game, leaderLimit),
    getGameMetrics(game),
  ])
  return {
    servers: servers ?? [],
    leaders: leaders ?? [],
    metrics,
    reachable: servers !== null || leaders !== null || metrics !== null,
  }
}

// --- raw shapes from the engine + normalizers ---

interface RawServer {
  server_id: number
  current_server_name: string | null
  current_map: string | null
  current_player_count: number | null
  current_max_players: number | null
  current_state: string | null
}

interface RawLeader {
  rank: number
  player_id: number
  name: string
  total_score: number
  rank_label: string
  kills: number
  kdr: number
  rounds: number
}

interface RawMetrics {
  ok: boolean
  total_rounds_processed?: number
  total_players_seen?: number
  active_players_24h?: number
  current_active_players?: number
  popular_maps_7_days?: { map_name: string; rounds_played: number }[]
}

function normalizeServer(s: RawServer): LiveServer {
  return {
    id: s.server_id,
    name: s.current_server_name?.trim() || 'Unnamed server',
    map: s.current_map?.trim() || '—',
    players: s.current_player_count ?? 0,
    maxPlayers: s.current_max_players ?? 0,
    state: s.current_state ?? 'UNKNOWN',
    online: (s.current_state ?? '').toUpperCase() !== 'OFFLINE',
  }
}

function normalizeLeader(l: RawLeader): LeaderPlayer {
  return {
    rank: l.rank,
    playerId: l.player_id,
    name: l.name,
    rp: l.total_score ?? 0,
    rankLabel: l.rank_label ?? '',
    kills: l.kills ?? 0,
    kdr: l.kdr ?? 0,
    rounds: l.rounds ?? 0,
  }
}
