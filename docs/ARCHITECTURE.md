# Bubbles Car Wash — client app architecture

Four layers, each depending only on the one below it. Nothing skips a layer:
a screen never reads a raw hex value, and the design system never knows what a
booking is.

```
┌─ apps/client-app/app/ ─────────── routes (expo-router, file = URL)
│  screens, navigation, flow order
├─ apps/client-app/src/ ─────────── app logic
│  session state · content model · flow chrome
├─ libs/ui-native/ ──────────────── design system
│  22 components · Unistyles theme
└─ libs/design-tokens/ ──────────── tokens
   palette · scale · effects · motion   (platform-neutral: also feeds web)
```

## Layer 1 — tokens (`@bubbles/design-tokens`)

Pure values, no React. Ported verbatim from the handoff's `tokens/*.css`.

| Module | Exports |
| --- | --- |
| `color.ts` | `palette` (violet/guava/yellow/ice/ink/cloud), `beat`, `onBeat`, `BeatKey` |
| `scale.ts` | `space` 1-12, `radius`, `fontSize`, `lineHeight`, `tracking`, `layout` |
| `effects.ts` | `shadow` (card/float/stack), `border`, `focusRing` |
| `motion.ts` | `duration`, `easingPoints`, `spring` |
| `type.ts` | `fontFamily`, `nativeFont` (one family name per weight) |

`beat` is the whole status model: **exactly three** — arrived, washed, verified.

## Layer 2 — design system (`@bubbles/ui-native`)

```
theme/theme.ts        builds the Unistyles theme from tokens; owns the module
                      augmentation and configureDesignSystem()
primitives/  Text · Num · Screen · Reveal
actions/     Button · IconButton
display/     Card · Badge · Tag · StatusBadge · BeatIcon · BookingTicket
forms/       Input · Select · Checkbox · Radio · Switch
feedback/    Dialog · Toast (+ToastProvider/useToast) · Tooltip
navigation/  Tabs
```

Two exports paths, and the split is load-bearing:

- `@bubbles/ui-native` — the barrel, for components.
- `@bubbles/ui-native/theme` — the theme alone. The app entry imports
  `configureDesignSystem()` from **here**, because importing it from the barrel
  would evaluate every component (and every `StyleSheet.create`) before a theme
  exists.

Three primitives carry rules the rest of the app inherits:

- **`Text`** — the only way text enters the app. No screen can invent a font
  size. Positive letter-spacing is never applied: it breaks Arabic joining.
- **`Num`** — LTR + tabular figures. Every time, price, plate and invoice ID.
- **`Reveal`** — the only entrance animation. Animates **position only**, never
  opacity, so no failure of the animation engine can leave content invisible.

## Layer 3 — app logic (`apps/client-app/src/`)

| File | Responsibility |
| --- | --- |
| `content.ts` | Every string and price, in one place. Services, packages, plans, slots, pipeline copy, fixtures. Swap this file when the API lands. |
| `session.tsx` | `SessionProvider` + `useSession()`. Holds wallet, club, booking, stage, rated. Pure pricing helpers (`quote`, `quoteWithCredit`) live beside it. |
| `unistyles.ts` | Side-effect module: calls `configureDesignSystem()`. |
| `components/` | Flow chrome: `FlowHeader` (animated step rail), `Bits` (SectionLabel/LedgerRow/TickRow/Stagger), `PayMethods`, `Processing`, `SuccessScreen`, `BottomTabBar`. |

### Session state shape

```
State                         Derived
  onboarded                     hasCredits    wallet.credits > 0
  wallet {credits,total,expiry} isLive        booking && stage > 0
  club   {plan,credits,renews}
  booking{id,slot,day,service,addOns,total,usedCredit}
  stage  0 upcoming → 1 arrived → 2 washed → 3 verified
  rated
```

Business rules live here, not in screens: a credit is spent at confirmation and
returned if you cancel before the wash starts; a package credit covers the wash
but never the add-ons.

## Layer 4 — routes (`apps/client-app/app/`)

File-based, so the file tree *is* the navigation graph. Every step is a real
route with a real native transition and an interactive back-swipe.

```
index.tsx              /            declarative <Redirect> — onboarded ? home : onboarding
_layout.tsx            root Stack + providers (Gesture → SafeArea → Session → Toast)

onboarding/            slide-from-start stack, 6 steps
  index · phone · otp · permission · map · address

(tabs)/                3 tabs, custom animated bar
  home · bookings · profile

book/ packages/ club/  modal stacks over the tabs
```

The three purchase flows are **modals over the tab stack**, so the tab you left
is still mounted underneath when you close them.

## Motion

| Where | What | Safety |
| --- | --- | --- |
| `Reveal` | content rises into place | position only — cannot hide content |
| `BeatIcon` | three dots pulse in sequence, 200ms apart | rests at full size |
| `FlowHeader` | progress rail springs toward the current step | width, stable caps |
| `Button`/`Card` | 1px settle / 0.985 scale on press | 120ms, reverts on release |
| `Tabs` | indicator slides between segments | `start` — mirrors for RTL |
| `Switch` | knob travels, track cross-fades | direction-aware |
| `BottomTabBar` | icon lifts 2px, colour crosses | spring |

Everything checks `useReducedMotion()` first.

## RTL

`I18nManager.forceRTL(true)` at the entry, so Yoga mirrors `start`/`end`, text
alignment and row direction for the whole tree. Three things do **not** mirror
automatically and are handled explicitly:

1. **Drawings.** SVG coordinates are absolute — `BookingTicket` places its
   perforation from the physical left edge based on `I18nManager.isRTL`.
2. **`translateX`.** Not mirrored. `Switch` negates it by hand.
3. **Latin runs.** Digits, times, phone numbers and IDs stay LTR via `Num`, and
   the OTP boxes and phone row use `row-reverse` so Yoga flips them back.

## Build wiring (the parts that bite)

- **`index.js` is the entry**, not `expo-router/entry`. It imports
  `src/unistyles` first. expo-router eagerly requires every route module, so
  configuring from the root layout is too late.
- **`babel.config.js`** — Unistyles plugin first, `react-native-worklets` last.
  `autoProcessPaths` uses **absolute** paths: a bare `'src'` also matches
  `node_modules/react-native-unistyles/src`, which makes the plugin rewrite the
  library's own imports to point at itself.
- **`metro.config.js`** — `unstable_conditionNames` drops `import` so the bare
  `react-native-unistyles` specifier resolves to the same `src` build the plugin
  targets; otherwise the bundle carries two copies and two registries.
- Run Metro **from `apps/client-app`**, not the workspace root.
