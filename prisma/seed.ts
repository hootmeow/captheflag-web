import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // Admin user
  const admin = await db.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await hash('changeme', 12),
    },
  })
  console.log(`Admin user: ${admin.username} (password: changeme — CHANGE THIS IMMEDIATELY)`)

  // Rules page
  await db.page.upsert({
    where: { slug: 'rules' },
    update: {},
    create: {
      slug: 'rules',
      title: 'Server Rules',
      content: `## Server Rules

These rules apply to all captheflag.com servers. Violations may result in a kick or permanent ban.

## General Conduct

- **Respect all players** — no harassment, hate speech, or discrimination of any kind.
- **No cheating** — hacks, aimbots, wallhacks, or any third-party software that provides an unfair advantage are prohibited.
- **No glitching** — exploiting map glitches or bugs to gain an advantage is not allowed.
- **English in global chat** — to keep communication manageable for admins.

## Gameplay

- Play the objective. This is a team game.
- No deliberate team-killing. Accidental TKs happen — just apologize.
- Do not idle on a team to farm points while AFK.
- Admins have the final say on disputed situations.

## Server Access

- These are community servers run for fun. Be a good sport.
- If you have a complaint about admin decisions, bring it up in our Discord — not in-game chat.

## Bans

Bans are issued at admin discretion for serious or repeated rule violations. To appeal a ban, join our Discord and open a ticket in the appropriate channel.`,
    },
  })

  // About page
  await db.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'About captheflag.com',
      content: `## About captheflag.com

captheflag.com is a community-run server network dedicated to keeping classic Battlefield games alive and playable.

## What We Run

We currently host **Battlefield 1942** servers and are working to bring **Battlefield Vietnam** online.

Our focus is on classic, vanilla gameplay — no excessive mods, no pay-to-win, no nonsense. Just the games as they were meant to be played.

## Who We Are

A small group of longtime Battlefield players who wanted a reliable place to play. We handle everything ourselves: server hardware, administration, and this website.

## Getting Involved

The best way to get involved is to join our Discord. That's where we organise events, take feedback, and coordinate with the community.

If you're interested in helping with server administration, reach out there too.

## Technical

This site and its admin panel are open-source. If you're interested in how it's built or want to run something similar, feel free to get in touch.`,
    },
  })

  console.log('Seeded default pages.')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
