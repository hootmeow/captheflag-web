import type { Metadata } from 'next'
import GameLanding from '@/components/GameLanding'
import { GAMES } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Battlefield 1942',
  description: 'Live servers, stats and how to join the captheflag.com Battlefield 1942 community.',
}

export default function BF1942Page() {
  return (
    <GameLanding
      game={GAMES.bf1942}
      intro="Classic WWII combined-arms multiplayer — Conquest, CTF and Co-op across iconic maps from Normandy to the Pacific."
      joinSteps={[
        {
          step: '01',
          title: 'Install the game',
          body: 'Install Battlefield 1942 and apply the 1.61b patch. Origin/EA App and disc copies both work.',
        },
        {
          step: '02',
          title: 'Open multiplayer',
          body: 'Launch the game, go to Multiplayer → Join Internet. The in-game browser lists active servers.',
        },
        {
          step: '03',
          title: 'Find a server',
          body: 'Browse the live servers above, search the in-game list, or connect by IP from the stats site.',
        },
      ]}
      details={[
        { label: 'Game', value: 'Battlefield 1942 (v1.61b)' },
        { label: 'Modes', value: 'Conquest, Capture the Flag, Co-op' },
        { label: 'Teams', value: 'Allied / Axis' },
        { label: 'Mods', value: 'Vanilla (no mods required)' },
      ]}
      resources={[
        {
          title: '1.61b Patch',
          desc: 'Required to connect to most servers',
          href: 'https://www.moddb.com/games/battlefield-1942/downloads/battlefield-1942-161b-patch',
        },
        {
          title: 'BF1942 stats & leaderboards',
          desc: 'Profiles, rankings and round history',
          href: 'https://bf1942.captheflag.com',
        },
      ]}
    />
  )
}
