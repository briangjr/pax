# PAX

Rip packs. Pull legends. A play-money card pack opener with three sections, all sharing one wallet:

- **Taloki** — the Astral Beasts creature set
- **NFL** — PAX Football 2026 (real players, built-in card designs)
- **NBA** — PAX Basketball 2026-27 (real players, built-in card designs)

No real money is involved anywhere.

## Layout

PAX opens on the **Packs** screen:

- **Top left:** category menu to switch between Taloki, NFL and NBA (a short "Loading packs" moment plays when you switch).
- **Top right:** your balance and the green **+** to add play money. One wallet is shared by all three sections.
- **Center:** swipe through the seven packs. Under the pack: its name, **What's inside** (every card it can give, its value and its exact chance), Min Value, Max Pull and **Pack style**.
- **Pack style** opens a sheet: Normal, High, Max or 50/50, the estimated payout odds for that pack, Gold Boost (Normal and High only), then **Apply**.
- **Buy for $X** opens the pack. The header and tab bar disappear while a pack is opening.
- **Bottom tabs:** Packs, Showroom (your best cards across all sections), Collection (for the section you're in), History (last 100 pulls), Account (totals, add money, reset).

Saves from the Taloki-only version carry over automatically (balance, cards, history) when deployed to the same site.

### Nothing gives the pull away early

The pack looks the same whatever is inside. The mystery card always spins the same number of turns for the same length of time, and each turn shows a random color (any tier, in any order), so it only lands on the real color at the very end. Every card, graded or raw, hides under the same card-shaped cover until you peel it.

## NFL and NBA sets

Each sports set has 136 cards across seven versions, cheapest to rarest:

| Version | Cards | Notes |
|---|---|---|
| Base | 40 | |
| Silver | 25 | |
| Holo | 15 | numbered /199 |
| Gold | 10 | numbered /10 |
| Auto | 25 | autograph, numbered /99, most graded |
| Patch Auto | 11 | jersey patch + autograph, /25, graded |
| One of One | 10 | 1/1, graded PAX 10 Gem Mint |

The sports sets reuse Taloki's card values tier by tier, so every sports pack has exactly the same odds, Gold Boost and 92% average return as the Taloki pack at the same price. Pack names: Rookie ($1), Starter ($2), Veteran ($5), All-Star ($10), MVP ($25), Hall of Fame ($100), GOAT ($500).

Collection → **Players** shows every version of each player; collect them all to complete a player's run.

Rosters reflect the 2026 offseason (including 2026 draft rookies, marked RC). Players and teams are in `js/sports.js` (`NFL_PLAYERS`, `NBA_PLAYERS`), listed in order of chase value.

### Adding your art

- **Pack covers:** put the image in `images/nfl/packs/` or `images/nba/packs/`, then add `cover:'images/nfl/packs/rookie.webp'` to that pack in `SPORT_PACKS` in `js/sports.js`. A pack with a cover shows your art instead of the built-in design.
- **Player photos:** put the image in `images/nfl/players/` or `images/nba/players/` and add `'Patrick Mahomes': 'images/nfl/players/patrick-mahomes.webp'` to `NFL_ART` (or `NBA_ART`). Every card of that player uses the photo.
- **PAX logo:** `images/brand/pax-logo.webp` (home screen, top bar, mystery card) and the app icons `images/brand/pax-app-icon-*.png` are all made from the PAX logo.

No official league or team logos are used.

## Deploying (GitHub + Netlify)

This is a plain static site: no build step, no dependencies.

**First time**
1. Create a new GitHub repo (for example `taloki`).
2. Upload everything in this folder to the repo root, so `index.html` sits at the top level.
3. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
4. Leave **Build command** empty and set **Publish directory** to `.` (the `netlify.toml` already says this).
5. Deploy. Every push to the repo redeploys automatically.

**Updating**
Replace everything in the repo with the contents of the newest zip, then commit. Don't merge files by hand.

## Project layout

```
index.html              page shell
manifest.webmanifest    lets phones "Add to Home Screen" as an app
netlify.toml            Netlify settings and caching
css/styles.css          all styling
js/data.js              Taloki set: cards, values, tiers, packs, odds
js/sports.js            NFL and NBA sets: players, teams, versions, pack looks
js/app.js               pack screen, wallet, collections, pack-opening flow
images/brand/           Taloki card backs and eye, PAX app icons
images/cards/           Taloki card art, named <number>-<name>.webp
images/nfl/, images/nba/  your pack covers and player photos
```

## How packs work (all sections)

Five packs, one card each. Every card has one fixed value; the pack decides which card you get.

| Pack | Price | Ascended or better (Normal) |
|---|---|---|
| Starter | $1 | 1 in 48,780 |
| Base | $2 | 1 in 24,390 |
| Pro | $5 | 1 in 9,756 |
| Ultra | $10 | 1 in 2,449 |
| Legendary | $25 | 1 in 816 |
| Mythic | $100 | 1 in 37 |
| Sovereign | $500 | about 1 in 2 |

For the $1–$25 packs, the jackpot is a chance at an Ascended, Apex or Mythic Legend card and lives inside the Gold tier. The $100 and $500 packs cost enough that those cards sit in their regular tiers, so those two packs use their own dollar ranges (see `js/data.js`).

**Pack style** is picked from the Pack style sheet on the Packs screen and applies to every pack. Normal and High:

| Tier | Normal: value (× price) | Normal: chance | High: value (× price) | High: chance |
|---|---|---|---|---|
| Gray | 0.10–0.35× | 25–40% | 0.32–0.40× | 45.9% |
| Green | 0.35–0.95× | 30–45% | 0.40–1.00× | 34.1% |
| Blue | 1.12–1.35× | 14% | 1.04–1.20× | 1.4% |
| Purple | 1.35–1.80× | 8% | 1.20–1.40× | 1.7% |
| Red | 1.80–2.60× | 5% | 1.40–1.80× | 4.4% |
| Gold | 2.60×+ | 3% | 1.80×+ | 12.5% |

**Max:** 90% a low card (0.10–0.35× the price), 10% a card worth 4× the price or more.
**50/50:** 50% a low card, 50% a card worth about 1.5–2× the price.

Blue is always a small profit. Every pack averages 92% of its price in every style; the styles just change how wide the swings are. Selling a card back pays 90% of its value. All odds are in `js/data.js`.

**Gold Boost:** every pack has a Gold Boost button. It costs 2× the pack price and makes Gold 25% of pulls (the jackpot also doubles). The other tiers shrink to make room, and Gold leans toward its cheaper cards, so a boosted pack still averages 92% of what you paid. The Pack style sheet shows the boosted odds when Gold Boost is switched on.

**Opening flow:** pick one of six looping packs → swipe across the top to cut it open → a mystery card spins and changes color up to your tier (tap to speed up) → peel the cover off by dragging, or tap to open → result screen with a 3D card you can tilt and flip, then Sell or Keep.

## Evolution lines

Collection → Evolutions shows every creature line (Stage 1 → 2 → 3 → 4) and which stages you own. A line turns gold when you own all four.

## Profile tab

Shows balance, money added, spent on packs, earned from selling, collection value, packs opened, best pull, and a history of your last 100 pulls. Settings there can reset everything. The **+** button adds any amount of play money (up to $100,000 at a time).

## The Taloki set: 136 cards

| # | Tier | Status |
|---|---|---|
| 001–010 | Mythic Legend ($10k–$49k, graded) | done |
| 011–021 | Apex Rare, Stage 4 ($3.4k–$9.3k by grade) | done |
| 022–041 | Ascended Rare, Stage 3 ($466–$2,958 by grade) | done |
| 042–046 | Ascended Rare, Basic ($988–$1,468) | done |
| 047–056 | Epic, Stage 2 ($36.71–$199.67) | done |
| 057–071 | Rare (Stage 2 and Basic, $11.75–$32.40) | done |
| 072–081 | Uncommon, Stage 1 ($2.51–$7.73) | done |
| 082–096 | Uncommon ($2.46–$11.49) | 15 still needed |
| 097–136 | Common ($0.11–$2.42) | 40 still needed |

Cards without art yet show as placeholders in packs and as face-down card backs in the collection.

## Full screen on phones

- **iPhone:** open the site in Safari, tap Share, then Add to Home Screen. It then opens full screen like an app. The site shows a reminder banner until you do this or dismiss it.
- **Android:** Chrome offers an Install button in the banner; installed, it runs full screen.
- The home-screen icon is the PAX icon (`images/brand/pax-app-icon-*.png`). Phones cache icons, so if you added Taloki to your home screen before, delete it and add PAX again.

## Offline play

`sw.js` saves every file on the device the first time the site loads online (a short one-time download of about 15 MB). After that the game opens and plays with no internet, including from the home-screen icon. When online, it picks up new updates automatically. The file list and version inside `sw.js` are regenerated with each new zip.

## Notes

- Balance and collection are saved in the browser on each device (localStorage). Clearing site data resets them.
- Graded cards reveal from the cased card back; ungraded cards reveal from the plain back.
