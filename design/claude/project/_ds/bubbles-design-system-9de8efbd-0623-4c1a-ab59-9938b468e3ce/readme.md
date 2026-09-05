# Bubbles Design System

**Bubbles** is an on-demand mobile carwash service ("Shine, right on time." / لمعة في وقتها) operating in a Gulf market — the brand is fully bilingual English/Arabic. Technicians in violet overshirts arrive in liveried vans and wash cars at the customer's home; customers book time slots, track wash status, and join a membership program (Bubbles Club).

**Sources provided** (in `uploads/`):
- `image (3).webp` — the approved brand board (bilingual lockups, logo system, three-beat icon, status graphics, color & typography, graphic language, applications: booking card, overshirts, trolley, van livery, club card, photography).
- `colors.md` / `colors.json` — extracted palette with roles.
- `bubbles-logo.svg`, `bubbles-mark.svg`, `bubbles-icon.svg`, `bubbles-icon-ios.svg`, `bubbles-illustration.svg`, `bubbles-logo-white.png` — vector assets (copied to `assets/`).
- Direction: use **IBM Plex Sans** (Google Fonts) as the UI typeface.

No codebase or Figma was provided; components are authored from the brand board (see "Intentional additions").

## CONTENT FUNDAMENTALS

- **Voice**: short, warm, punctual. The promise is always about time: "Shine, right on time." Copy speaks to "you", first person plural for the brand ("We're on our way").
- **Bilingual by default**: brand-level lockups pair English with Arabic (لمعة في وقتها). Product UI may be single-language, but status vocabulary always has both: ARRIVED وصل · WASHED الغسيل · VERIFIED تأكد. Arabic uses IBM Plex Sans Arabic, RTL (`.ar` / `lang="ar"`).
- **Status vocabulary**: one-word past-tense verbs, uppercase, mapped 1:1 to the three beats. Never invent a fourth status word.
- **Micro-labels**: tiny uppercase labels with wide tracking ("BOOKING CARD", "THREE-BEAT STATUS") introduce sections and cards.
- **Time is content**: slots rendered big and tabular — "10:30–11:00" with an en dash. Numbers use tabular figures.
- **Casing**: sentence case for body/UI copy; UPPERCASE only for statuses and micro-labels; Title Case never.
- **No emoji** — the three-beat dots do the expressive work.
- Examples: "Book a wash", "Your technician is 5 min away", "Washed. Drying now.", "Members get 10:00 slots first."

## VISUAL FOUNDATIONS

- **Color**: Warm Cloud `#FAFAF5` pages, white cards, Electric Violet `#5A42FF` as the single action color. Guava `#FF5E7E` and Solar Yellow `#FFD84D` are status/accent only — never actions. Ice Blue `#BDEEFF` is the booking surface (tickets, slots). Deep Ink `#17162E` for text and premium dark surfaces (Quality Seal, Club card). Max two background colors per view.
- **Three-beat motif**: three dots in sequence = the service pipeline (Arrived violet → Washed guava → Verified yellow). Used as status graphics, loading frames, logo mark (with a white highlight bubble), and livery. It is the brand's only illustration language besides real bubbles.
- **Type**: IBM Plex Sans, 400/500/600/700. Display is bold, tight (-0.02em). Wordmark itself is a rounded-geometric outline (SVG asset — never retype it). Arabic: IBM Plex Sans Arabic.
- **Shape**: everything rounded. Pills for buttons/chips, 14–28px radii for inputs/cards, 22.5% squircle for app icons, perfect circles for status seals. Booking cards are **tickets**: rounded rect with punched side notches + dashed perforation before the stub.
- **Shadows**: soft ambient card shadow (`--shadow-card`); floating sheets `--shadow-float`; the graphic language also uses **hard offset stacks** (`--shadow-stack-ice`, `--shadow-stack-guava`) — flat 8px offset layers, no blur — for promo/hero moments only.
- **Backgrounds**: flat color fields. No gradients anywhere. Livery/hero moments use diagonal color-block collages of the palette.
- **Motion**: quick and springy-but-subtle — 120–200ms, `cubic-bezier(.2,.8,.2,1)`. The loading animation pulses the three beats in sequence (`bb-beat`). Fades + small translateY; no bounces beyond the beat pulse.
- **Hover**: darken one step (violet → `--violet-600`) or tint fill (`--violet-100` for ghost). **Press**: darken another step + `translateY(1px)`. Focus: 3px violet ring at 35%.
- **Borders**: 1.5px, ink at 10–16% alpha. Dark surfaces use white at 12%.
- **Imagery**: warm, sunlit, residential driveways and porte-cochères; real customers and technicians; no filters, no B&W. Violet uniforms visible.
- **Transparency/blur**: ink at 40% for dialog scrims (with 4px backdrop blur); otherwise avoid translucency.
- **Contrast note**: the board shows white text on Solar Yellow seals; this system uses Deep Ink on yellow for legibility (flagged deviation).

## ICONOGRAPHY

- The brand ships **no UI icon set** — only the logo family in `assets/` (never redraw these):
  - `bubbles-logo.svg` — primary horizontal lockup (mark + BUBBLES wordmark, violet).
  - `bubbles-logo-white.png` — raster lockup on a white production background (print/cutting use).
  - `bubbles-mark.svg` — the three-beat dot mark alone.
  - `bubbles-icon.svg` / `bubbles-icon-ios.svg` — app icons (violet squircle/square, white + yellow dots).
  - `bubbles-illustration.svg` — app icon with floating bubbles (empty states, onboarding).
- **UI icons: [Lucide](https://unpkg.com/lucide@latest) from CDN** — substitution, flagged: rounded caps/joins match the rounded-geometric brand. Use 1.75–2px stroke, `currentColor`. Common glyphs: `car`, `clock`, `map-pin`, `calendar`, `sparkles`, `check`, `chevron-right`, `star`, `droplets`.
- Status is communicated with **colored dots/seals, not icons**. No emoji, no unicode-as-icon.

## Tokens & fonts

- Entry: `styles.css` → `tokens/{fonts,colors,typography,spacing,effects,base}.css` + `components/components.css`.
- Fonts load from Google Fonts (`IBM Plex Sans`, `IBM Plex Sans Arabic`) via `@import` — no binaries in repo. The brand board's display face is a rounded geometric sans; per the client's direction IBM Plex Sans stands in for all UI/display type (wordmark stays SVG).

## Components (`components/`)

No component inventory was provided, so this is a standard set styled from the brand board — plus brand-specific pieces. All use `bb-*` classes from `components/components.css` and design tokens only.

- `actions/` — Button (primary/secondary/ghost/dark; sm/md/lg), IconButton
- `forms/` — Input, Select, Checkbox, Radio, Switch
- `display/` — Card (default/booking/dark/stack), Badge, Tag, StatusBadge (ARRIVED/WASHED/VERIFIED seals), BeatIcon (three-beat dots, animatable), BookingTicket
- `feedback/` — Dialog, Toast (sm pill → bottom · lg card → top), ToastStack (placement slot), Tooltip
- `navigation/` — Tabs (segmented)

**Intentional additions** (not on the board, needed for product UI): Input/Select/Checkbox/Radio/Switch/Tabs/Dialog/Toast/Tooltip/Badge/Tag — standard app furniture styled to brand. **Direct from board**: Button shapes, Card, StatusBadge, BeatIcon, BookingTicket, Club card treatment.

## Index

- `readme.md` — this guide · `SKILL.md` — agent skill entry
- `styles.css`, `tokens/` — global CSS + tokens
- `assets/` — logos, marks, icons, illustration
- `guidelines/` — foundation specimen cards (Design System tab)
- `components/<group>/` — JSX + `.d.ts` + `.prompt.md` + card per group
- `ui_kits/app/` — Bubbles customer app (booking, tracking, club) — interactive kit
- `ui_kits/app-ar/` — Sama customer app — Arabic RTL interactive kit
- `ui_kits/tech-ar/` — Sama technician app (today's jobs, in-app navigation, before/after photo proof, day summary, ops chat) — Arabic RTL interactive kit
