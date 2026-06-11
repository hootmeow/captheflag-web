import type { Metadata } from 'next'
import GameLanding from '@/components/GameLanding'
import { GAMES } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Battlefield Vietnam',
  description: 'Live servers, stats and how to join the captheflag.com Battlefield Vietnam community.',
}

export default function BFVPage() {
  return (
    <GameLanding
      game={GAMES.bfv}
      intro="Vietnam-era warfare with helicopters, riverboats and a 60s rock soundtrack. Asymmetric US-vs-NVA combat across dense jungle."
      joinSteps={[
        {
          step: '01',
          title: 'Install the game',
          body: 'Install Battlefield Vietnam and patch to v1.21. Disc and digital copies both work.',
        },
        {
          step: '02',
          title: 'Open multiplayer',
          body: 'Launch the game and open the multiplayer server browser to see active internet servers.',
        },
        {
          step: '03',
          title: 'Find a server',
          body: 'Browse the live servers above, or connect by IP listed on the stats site.',
        },
      ]}
      details={[
        { label: 'Game', value: 'Battlefield Vietnam (v1.21)' },
        { label: 'Modes', value: 'Conquest, Co-op' },
        { label: 'Teams', value: 'US / NVA' },
        { label: 'Released', value: '2004 — DICE' },
      ]}
      resources={[
        {
          title: 'BFV stats & leaderboards',
          desc: 'Profiles, rankings and round history',
          href: 'https://bfv.captheflag.com',
        },
        {
          title: 'Community Discord',
          desc: 'Find players and game nights',
          href: process.env.NEXT_PUBLIC_DISCORD_URL ?? 'https://bfv.captheflag.com',
        },
      ]}
    />
  )
}
