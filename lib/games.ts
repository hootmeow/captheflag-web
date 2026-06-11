// Central game registry — single source of truth for the two theaters the portal
// covers. Drives the nav pillars, per-game theming, server cards, and stats wiring.
//
// IMPORTANT: every Tailwind class here is a COMPLETE literal string. The JIT
// compiler only emits classes it can see as full literals in source, so never
// build these by interpolation (`bg-${x}-500`) or they silently render nothing.

export type GameId = 'bf1942' | 'bfv'

export interface GameTheme {
  /** Primary accent text, e.g. game name on hover */
  text: string
  textHover: string
  /** Small status/era chip */
  chip: string
  /** Card border in its resting + hover state */
  border: string
  borderHover: string
  /** Surface tint behind a themed panel */
  panel: string
  /** Live indicator dot (with glow) */
  dot: string
  /** Capacity / progress bar fill */
  bar: string
  /** Hero radial wash (top-down gradient) */
  heroWash: string
  /** Active nav item treatment */
  navActive: string
  /** Solid call-to-action button */
  btn: string
  /** Ghost / outline button accent on hover */
  ghostHover: string
  /** Section heading rule + label color */
  rule: string
  /** Tactical grid line tint utility (defined in globals.css) */
  grid: string
}

export interface GameConfig {
  id: GameId
  name: string
  shortName: string
  /** Portal landing route */
  slug: string
  /** Full experience: stats, leaderboards, profiles live here */
  site: string
  /** Env var holding the internal (localhost) stats-engine base URL */
  statsBaseEnv: 'BF1942_STATS_URL' | 'BFV_STATS_URL'
  era: string
  years: string
  tagline: string
  blurb: string
  status: 'active' | 'soon'
  theme: GameTheme
}

export const GAMES: Record<GameId, GameConfig> = {
  bf1942: {
    id: 'bf1942',
    name: 'Battlefield 1942',
    shortName: 'BF1942',
    slug: '/games/bf1942',
    site: 'https://bf1942.captheflag.com',
    statsBaseEnv: 'BF1942_STATS_URL',
    era: 'WWII · 1942',
    years: '2002',
    tagline: 'The one that started it all.',
    blurb:
      'Sprawling WWII combined-arms warfare — tanks, planes, ships and infantry across Normandy, the Pacific and North Africa.',
    status: 'active',
    theme: {
      text: 'text-amber-400',
      textHover: 'group-hover:text-amber-400',
      chip: 'bg-amber-950/50 text-amber-400 border-amber-900/50',
      border: 'border-amber-900/40',
      borderHover: 'hover:border-amber-700/60',
      panel: 'bg-amber-950/10',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]',
      bar: 'bg-amber-500',
      heroWash: 'from-amber-950/40 via-amber-950/5 to-transparent',
      navActive: 'text-amber-400 bg-amber-950/40',
      btn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
      ghostHover: 'hover:border-amber-700/60 hover:text-amber-300',
      rule: 'text-amber-500 border-amber-900/40',
      grid: 'tactical-grid-amber',
    },
  },
  bfv: {
    id: 'bfv',
    name: 'Battlefield Vietnam',
    shortName: 'BFV',
    slug: '/games/bfv',
    site: 'https://bfv.captheflag.com',
    statsBaseEnv: 'BFV_STATS_URL',
    era: 'Vietnam · 1965',
    years: '2004',
    tagline: 'Rock the jungle.',
    blurb:
      'Helicopters, riverboats and a 60s rock soundtrack. Asymmetric US-vs-NVA warfare across dense jungle and rice paddies.',
    status: 'active',
    theme: {
      text: 'text-emerald-400',
      textHover: 'group-hover:text-emerald-400',
      chip: 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50',
      border: 'border-emerald-900/40',
      borderHover: 'hover:border-emerald-700/60',
      panel: 'bg-emerald-950/10',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]',
      bar: 'bg-emerald-500',
      heroWash: 'from-emerald-950/40 via-emerald-950/5 to-transparent',
      navActive: 'text-emerald-400 bg-emerald-950/40',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
      ghostHover: 'hover:border-emerald-700/60 hover:text-emerald-300',
      rule: 'text-emerald-500 border-emerald-900/40',
      grid: 'tactical-grid-emerald',
    },
  },
}

export const GAME_LIST: GameConfig[] = [GAMES.bf1942, GAMES.bfv]

export function getGame(id: string): GameConfig | null {
  return (GAMES as Record<string, GameConfig | undefined>)[id] ?? null
}
