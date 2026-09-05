# BubblesCarWash — Landing handoff notes

File: `BubblesCarWash Landing.dc.html` · strings: `landing-i18n.js` · data: `pricing.json`, `coverage-config.json` · assets: `assets/bubblescarwash-logo*.svg`

## Creative idea
The hero is a schematic plan of the compound, not a city map: the compound boundary is drawn as the *service boundary*, the surrounding area is dotted "outside service area", and the team's route animates from the gate to the customer's parked car. The same boundary logic drives the coverage checker (point-in-polygon, not district name). Page rhythm: dark petrol for the two "operational" moments (hero, coverage), foam-light for explanation.

## System
- Colors: petrol `#0D1C1F` · petrol surface `#14282C` · block `#1E3A3F` · foam `#D9E9E7` · page `#F2F7F6` · aqua accent `#6CC9C4` (text-safe aqua `#1C6E6A`) · hairlines ink 12–16%.
- Type: IBM Plex Sans (EN) / IBM Plex Sans Arabic (AR), 400/500/600/700. Display `clamp(38px,5vw,72px)`, section `clamp(30px,3.4vw,48px)`, body 16–17, micro-labels 12px uppercase 0.08em.
- Spacing: section padding `clamp(56px,8vw,112px)`; gutters `clamp(16px,3vw,40px)`; max width 1320.
- Shape: pills for buttons/chips, 12–20px radii, no shadows, no gradients.
- Motion: route dash + travelling team marker (6s loop), shine sweep on the car, journey stage cycling (2.4s). All disabled under `prefers-reduced-motion`; nothing starts at opacity 0.

## Components used
Design system (Bubbles, retokened to petrol): Button (primary/secondary/dark/ghost), Input, BeatIcon. Page-level: sticky nav + mobile menu, language switch, compound-plan figure, journey rail, before/after comparator (2× image-slot + range), pricing table (loading/error/live), coverage form (suggestions, demo chips, 4 result states, slots available/none), coming list, footer.

## Language
`/ar`, `/en` in the path or the saved choice (`localStorage bcw-lang`) selects the language; `lang`/`dir`, title, description, OG and canonical update on switch. Default: Arabic.

## Available now vs planned
Now: phone login · saved cars/addresses · Google Places search · current location / map pin · service + car + address + date + slot · Gregorian calendar, Fridays off · morning/midday/evening slots by location & capacity · team (not driver) assignment · booking history · notifications · before/after photo/video · Moyasar payment · customer app.
Planned (shown under "Coming"): per-car monthly packages, multi-car checkout, per-car schedule/address, auto-renew + per-car cancel, web/app purchase with same account, next-wash card, live wash stages, faster return flow, App Store/Google Play, SMS provider.

## Needs a link or API before launch
1. **Subscribe CTA** — all "Subscribe" buttons scroll to the villa check; the post-check Subscribe button is disabled until the app/web subscription URL exists.
2. **Pricing** — `pricing.json` mirrors the expected API shape; point the fetch at the real endpoint. Do not add "incl. VAT" until confirmed (`taxIncluded: null`).
3. **Coverage** — check is by villa number. `coverage-config.json` villa registry is a PLACEHOLDER; load the real Sharbatly Village villa list (number → street/coordinates) from API settings. Eligibility = villa exists in the registry; coordinates feed team routing only.
4. **Footer links** — Support, Privacy, Terms, Delete Account are hidden (`legalLinksReady` = false) until routes exist.
5. **Logo** — recolored copy of the "Bubbles" lockup + "CarWash" text; replace with the final BubblesCarWash logo.
6. **Documentation photos** — the tracker frames show a labeled placeholder ("Photo of your car before/after the wash"); swap in real app photos when available.
7. **SEO** — domain `bubblescarwash.example` placeholder in canonical/hreflang/OG; OG images per language to be produced; remove `noindex` on production only.
8. **App stores** — "App coming soon" text stays until real store links exist.
