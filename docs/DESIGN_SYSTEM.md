# Bubbly Design System

Instructions for building out `@bubbly/design-tokens`, `@bubbly/ui-native`, and
`@bubbly/ui-web`. Grounded in pattern research on Mobbin (links inline). This is
the spec every UI session should read before touching a screen.

## 1. The point of view

Bubbly is water brought to your driveway. The design world is already decided in
`libs/design-tokens/src/color.ts` and every choice must live inside it:

- **One world:** deep petrol ink (`#142b30`, green-leaning on purpose), foam
  surfaces (`#eef3f2`), and a single aqua accent (`#0d7e8f`) used sparingly.
  Semantic colors (success/warning/danger) are separate from the accent and
  never decorate.
- **The signature motif is the waterline.** One bespoke silhouette, used
  consistently and nowhere else: a shallow meniscus curve (a wide, almost-flat
  arc, like the surface of water in a glass). It appears in exactly three
  places: the top edge of bottom sheets in the mobile apps, the fill edge of the
  wash-progress indicator, and the landing hero's section transition. It is an
  SVG path, drawn once, shared. No other curve decoration anywhere.
- **Progress = filling with water.** Anything that expresses "how far along" (a
  booking stepper, the live wash status, an upload) fills with aqua along its
  full track, with stable end caps (animate width/clip, never scaleY on a
  rounded shape). This is the house metaphor; do not invent a second one.
- Calm, terse, typographic. Prices and statuses carry the hierarchy; chrome
  does not.

### What we are NOT doing (hard rules)

- No gradients as decoration. No glows, no blurred drop shadows, no hover lifts
  on buttons. Depth comes from tonal steps (`surface` → `surfaceSunken`, `night`
  → `nightRaised`) and self-colored 1px borders at low opacity.
- No icon-in-a-tinted-tile, no pill badges on every noun, no filled+outlined
  button pair. One primary action per screen region.
- Status chips exist (booking status is genuinely contained data) but only via
  `StatusBadge` mapped through `statusColor` - never ad-hoc tinted pills.
- Dark mode is the existing warm-teal night set, not a blue slate.

## 2. What the Mobbin research settled

Each pattern below was chosen from real screens; take the *behavior*, restyle
it entirely into Bubbly's world.

### Booking flow (client-app)

Model: Urban Company's booking is the strongest reference for a service that is
configured, scheduled, then paid.

- **Package config as a numbered sheet.** Urban Company's "Select requirements"
  sheet (1. duration → 2. purpose → 3. plan) is the model for configuring a
  wash: 1. vehicle → 2. package → 3. add-ons, each row expanding in place
  ([flow](https://mobbin.com/flows/fa74c21d-380a-4e0d-9ca1-7790fd70b630)).
- **Payment summary as a typographic ledger.** Item / fee / total as plain
  text rows separated by spacing, right-aligned amounts, no boxes
  ([flow](https://mobbin.com/flows/4b4e697b-006e-41ce-a636-469323750f2e)).
- **Scheduling in a bottom sheet:** "ASAP" option pinned first (disabled state
  with a reason when no washer is free), then day chips in a horizontal row,
  then start-time chips. Careem's slot grid shows the good density
  ([flow](https://mobbin.com/flows/bd65af36-8e8c-4a36-8deb-306cd0dc7a4c)).
- **Sticky total bar:** total on the left (tappable to expand the ledger), one
  full-width primary button on the right. This bar is the only fixed chrome in
  the flow, present on every booking step, and its label always names the next
  step ("Choose a time", "Confirm & pay") - never a bare "Next".
- **Step context, not a wizard header.** A thin aqua fill line under the screen
  title showing booking progress (the water metaphor), plus "Next: …" caption.
  Careem does this well with its green underline.

### Package selection

Model: Lugg's tier list - each tier is a full-width row with an illustration,
name, and a price formula, radio-selected
([screen](https://mobbin.com/screens/6cdd0652-da20-43c2-a68b-8a4e4010be7f)).

- Wash packages (e.g. Rinse / Shine / Detail) are **rows, not three columns** -
  parallel-column pricing on a phone always goes ragged. Each row: package name
  (display face), one-line contents summary, duration estimate, price for the
  selected vehicle size right-aligned. Selection is a border + tonal fill
  change, no glow.
- Per-vehicle pricing follows Walmart's auto-service pattern: the selected
  vehicle sits as a persistent single line above the list, editable, and prices
  in the list re-render for it
  ([screen](https://mobbin.com/screens/658fbc2d-814d-40e5-a621-b091cb3bbe9e)).
- Every price row that has variable-length copy reserves its space; amounts
  share a right edge, names share a left edge, always.

### Live tracking (the hero screen of the product)

Models: Wonder's calm typographic tracker
([screen](https://mobbin.com/screens/9b6abe84-81c2-468f-ba02-dfa25489f557)),
DoorDash's status headline + node timeline
([screen](https://mobbin.com/screens/b2543cf1-7f95-4718-92d6-74af14de04d5)),
Shake Shack's ETA-first layout
([screen](https://mobbin.com/screens/639822b0-313a-4f99-9da1-0aebadd28aea)).

Bubbly's tracker, composed from those behaviors:

- Map on the top ~45% (only while status is `assigned`/`en_route`; once
  `washing`, the map collapses and the status area owns the screen - the washer
  is already here, the map is dead weight).
- Below, a sheet whose top edge is the waterline curve. Inside, in order:
  1. Status headline in the display face ("Sam is on the way", "Washing now"),
     with the ETA window as the sub-line. Big, calm, no card around it.
  2. The **wash track**: one horizontal track that fills with aqua through the
     stations pending → assigned → en route → washing → done, node dots sitting
     on the track, filled as passed. Colors come from `statusColor` only. Fill
     animates its width smoothly; caps never change shape.
  3. Washer identity row: photo, name, rating, call/message actions as bare
     icons (no circles behind them).
  4. Collapsed "Booking details" disclosure (vehicle, package, address, ledger).
- `washing` state gets the one authored motion moment of the app: the track's
  fill edge carries the meniscus curve and drifts gently. Gate it behind
  reduced-motion; static fill otherwise.

### Driver app (washer side)

Model: Grab Driver's map-first home with an explicit online/offline state and
bottom job sheet
([screen](https://mobbin.com/screens/bde9cd75-e090-4056-a7f4-266cd1a28c59)),
Airtasker's offer rows with amount + accept
([screen](https://mobbin.com/screens/f24acf30-6b61-4da1-84a9-4c8e838ac22b)).

- Home = today's queue as a list, not a map (jobs are scheduled, not streamed).
  Each job card: time range first (emphasis size), address, vehicle + package,
  payout right-aligned in the display face. Tap to expand; no accept/decline
  pair of equal-weight buttons - one primary "Accept", decline as a quiet text
  action.
- On-job screen mirrors the client tracker's wash track so both sides share one
  mental model; the washer advances status with a single full-width button per
  stage ("Start washing", "Finish & photo").
- Online/offline is a labeled switch in the header, not a floating map orb and
  not a sun/moon-style toggle.

### Dashboard (ui-web)

- Ops table screens: `Stat` tiles (number in display face, caption under, no
  border boxes - tonal `surfaceSunken` slabs), bookings table with
  `StatusBadge`, filters as quiet text controls. Follow `dataviz` skill for any
  charts; chart colors come from the token palette.

## 3. Token work (`libs/design-tokens`) - do this first

1. **Type tokens.** Add `src/type.ts`:
   - `fontFamily.display` - the signature face. Self-hosted, characterful,
     with good numerals (prices, ETAs, payouts are the brand's loudest type).
     Candidates to render and *look at* before choosing (do not pick from
     memory, and do not use Inter/Space Grotesk/Clash/General Sans - see the
     anti-slop law): Fontshare **Pally**, **Sentient**, **Gambarino**. Pick ONE.
     Load via `expo-font` in both apps and `next/font/local` on the landing;
     woff2 files live in `libs/design-tokens/assets/fonts/`.
   - `fontFamily.body` - system stack (SF Pro / Roboto / system-ui). Genuinely
     neutral is correct for body; the display face carries the identity.
   - Line heights per `fontSize` step (caption 1.4, body 1.5, emphasis 1.4,
     title 1.25, display 1.1) and `letterSpacing.display: -0.5`.
   - Usage rule: display face for status headlines, prices/payouts, screen
     titles, and stat numbers. Everything else is body. Never two display faces.
2. **Border + elevation tokens.** `borderSubtle` = ink at 8% on light, foam at
   10% on dark (self-colored, not grey). One shadow token only:
   `shadow.raised = 0 1px 2px rgba(13,28,31,0.10)` (tight, directional,
   ink-tinted) - used by floating sheets/menus, nothing else.
3. **Motion tokens.** `duration.fast: 140`, `duration.base: 220`,
   `duration.fill: 600` (track fills), easing `cubic-bezier(0.2, 0, 0, 1)`.
   All motion respects reduced-motion.
4. **The waterline path.** Export `waterlinePath(width, depth)` returning the
   SVG path string, so native (react-native-svg), web CSS `clip-path`, and the
   landing all draw the identical curve.
5. **Fix `cssVariables()`:** it currently emits no dark tokens and misses
   `aquaOnNight`. Emit the night set under a `[data-theme="dark"]` /
   `prefers-color-scheme` block (light values on bare `:root`), and add
   `statusColor` variables so web badges don't re-derive them.

## 4. Component build order

Build in this order; each layer only uses the layer below.

**`ui-native` (shared by client-app and driver-app):**

1. Extend `Button` (single primary style + quiet text style; pressed state is a
   tonal darken via `aquaDeep`, no scale/translate), `Screen`, `Heading` (wire
   the display face), `Card` (tonal, `borderSubtle`, no shadow), `StatusBadge`
   (already mapped to `statusColor`).
2. `Sheet` - bottom sheet with the waterline top edge. All pickers live in it.
3. `LedgerRow` / `LedgerTotal` - the typographic payment summary.
4. `StickyBar` - total + primary action, safe-area aware.
5. `SlotPicker` - day chips + time chips (44pt min targets, selected = aqua
   border + `surfaceSunken` fill).
6. `PackageRow` + `VehicleLine` - the Lugg/Walmart patterns above.
7. `WashTrack` - the shared status track with water fill. Props: `status`,
   `animated`. This is the flagship component; verify caps, full-track fill,
   and that every station node is optically centered on the track line.
8. `JobCard` (driver) - time, address, payout composition.
9. `StepHeader` - title + aqua progress underline + "Next:" caption.

**`ui-web`:** extend the existing `Button`/`Card`/`Stat`/`StatusBadge` with the
same tokens; add `LedgerRow` and a web `WashTrack` (SVG) for the dashboard's
booking detail view. Landing gets the waterline as its single section
transition and the display face in the hero - design the page from this system,
not from a SaaS template.

## 5. Definition of done, per component

- Uses tokens only - zero hard-coded colors, sizes, radii, or durations.
- Works on light and night palettes; text clears its background decisively.
- Centered content is verified centered (zoom in), aligned rows share real
  edges, nothing is clipped by a sheet edge or fixed height ("clear the cut").
- Interactive states: pressed (tonal), disabled (reduced ink, never grey-out to
  the slop grey), loading. No hover lift, no underline-grow, no glow anywhere.
- Every control actually responds; anything static must not look tappable.
- Content is visible with animations disabled; motion only ever moves things
  that are already on screen.
