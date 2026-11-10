# Handoff: Moyasar Checkout (Bubbles / Sama app)

## Overview
Arabic (RTL) in-app checkout screen for the Bubbles on-demand carwash app (React Native). The app decides **before** this screen whether the order is a one-time booking or a monthly subscription (and which plan). The screen shows an order summary first, then the payment step: Apple Pay, Samsung Pay, or card (mada / Visa / Mastercard) processed through **Moyasar**. Subscriptions are recurring monthly charges and require explicit consent.

## About the Design Files
`MoyasarCheckout.dc.html` (+ `ds-base.js`, `support.js`) is a **design reference built in HTML** — it shows intended look and behavior. Do not ship it. Recreate the screen in the React Native codebase using its existing components/navigation, and use the **Moyasar React Native SDK** (Apple Pay via `PKPaymentAuthorizationViewController`, Samsung Pay SDK on Android, and Moyasar's credit-card/mada tokenization) for the actual payments. The HTML simulates processing with a timer — replace with real SDK callbacks.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii and copy are final (prices/plan names are placeholders from the app's data). Recreate pixel-accurately, mapping tokens to the app's Bubbles theme.

## Screen: Checkout (390pt wide, vertical scroll)
Page background `#FAFAF5` (Warm Cloud). Outer padding 16 top / 20 sides / 40 bottom. Content is a vertical stack, gap 20. Font: IBM Plex Sans Arabic, `dir=rtl`.

### 1. Header (row, space-between, margin-bottom 20)
- Bubbles logo (`assets/bubbles-logo.svg`) height 28.
- Right-aligned trust label: lock icon 14px + "دفع مشفّر ومعتمد", 12.5px / 600, color `rgba(23,22,46,.56)`.

### 2. Order summary (shown only in `form` phase) — column, gap 12
Two variants, chosen by `mode`.

**A. `mode = once` (single booking)**
- Booking card: background `#BDEEFF` (Ice Blue), radius 28, padding 20/20/18, column gap 14.
  - Row: micro-label "ملخص الطلب" (11px / 700 / letter-spacing .08em / `rgba(23,22,46,.72)`) + white pill badge "حجز لمرة واحدة" (11.5px / 700, padding 4×10, radius 999, ink text).
  - Title "غسلة خارجية كاملة" 18px / 700 / -0.01em; subtitle "لكزس LX — أبيض · فيلا 12، حي النخيل" 13.5px `ink-72`; three-beat dots (9px circles: `#5A42FF`, `#FF5E7E`, `#FFD84D`, gap 5) at the far end.
  - Time row above a 1.5px **dashed** `rgba(23,22,46,.16)` border: "الثلاثاء 14 مايو" 13px / 600 ink-72; slot "10:30–11:00" LTR, 26px / 700 / -0.02em, tabular numerals, pushed to the opposite end.
- Totals card: white, radius 28, shadow `0 1px 2px rgba(23,22,46,.05), 0 6px 20px rgba(23,22,46,.07)`, padding 18×20, rows gap 10, tabular numerals. Rows are plain typography (no boxes):
  - "غسلة خارجية كاملة" — 89.00 ر.س (14.5px / 500)
  - "إضافة: تلميع الإطارات" — 30.00 ر.س
  - "ضريبة القيمة المضافة 15٪" — 17.85 ر.س (color ink-56)
  - "الإجمالي" — 136.85 ر.س (18px / 700, padding-top 12, 1.5px solid `rgba(23,22,46,.1)` top border)
- Note (12.5px, ink-56, clock icon 15px): "الموعد محجوز مؤقتًا لمدة 10 دقائق أثناء إتمام الدفع. الإلغاء مجاني قبل الموعد بـ 3 ساعات."

**B. `mode = subscription`**
- Plan card: background `#17162E` (Deep Ink), white text, radius 28, padding 20/20/18, column gap 14.
  - Row: micro-label "ملخص الطلب" (`rgba(255,255,255,.72)`) + violet pill "اشتراك شهري" (`#5A42FF` bg, white text) + three-beat dots at far end.
  - Plan name 18px / 700; description 13.5px `rgba(255,255,255,.72)`.
  - Perk chips: 12px / 600, padding 5×10, radius 999, bg `rgba(255,255,255,.12)`, wrap, gap 8.
  - Price row above 1.5px `rgba(255,255,255,.12)` border: price LTR 30px / 700 / -0.02em tabular + "ر.س / شهريًا · يتجدد تلقائيًا" 14px 72% white; far end "<per-wash> ر.س للغسلة" 12.5px.
- Totals card (same style as A):
  - "اشتراك شهري — <plan short>" — net (price ÷ 1.15)
  - "ضريبة القيمة المضافة 15٪" — VAT
  - "يُسحب اليوم" — price (18px / 700, top border)
  - "ثم شهريًا في يوم 14" — price (13.5px, ink-56)
- Note (refresh icon): "الإلغاء مجاني في أي وقت، ويبقى الاشتراك فعّالًا حتى نهاية الدورة المدفوعة."

Plans (placeholder data — replace with API):
| key | name | perks | price/mo | washes |
|---|---|---|---|---|
| basic | بيسك — غسلتان شهريًا | غسلتان / شهر · ترحيل غسلة واحدة | 99 | 2 |
| super | سوبر واش — 3 غسلات شهريًا | 3 غسلات / شهر · داخلية سريعة · ترحيل غسلتين | 129 | 3 |
| shine | لمعة — 4 غسلات شهريًا | 4 غسلات / شهر · أولوية مواعيد 10:00 · ترحيل غسلتين | 149 | 4 |

### 3. Payment card (`form` phase) — white, radius 28, card shadow, padding 22×20, column gap 20
- Micro-label "الدفع · PAYMENT" (11px / 700 / .08em / ink-56) + H1 "اختر وسيلة الدفع" 22px / 700 / -0.02em.
- Wallet buttons (column, gap 10), each height 50, radius 999, bg `#000`, hover `#1c1c1e`, LTR:
  - Apple Pay: Apple glyph 22px white + "Pay" 20px / 500. Use Apple's official `PKPaymentButton` (type: plain/subscribe, style: black) in RN.
  - Samsung Pay: "SAMSUNG" 15px / 700 / .12em + "Pay" 19px / 500. Use Samsung's official button asset.
  - Show per `wallets` prop / platform availability. Hide Apple Pay on Android, Samsung Pay on iOS.
- Divider: 1.5px `rgba(23,22,46,.1)` lines with centered "أو ادفع بالبطاقة" 12.5px / 600 ink-56.
- Card brand marks row (LTR, gap 8): mada, Visa, Mastercard tiles 52×32, white, 1.5px `rgba(23,22,46,.1)` border, radius 6. Use official brand SVGs. Live behavior: detected brand gets a 2px `#5A42FF` ring; the others fade to 40% opacity (120ms, `cubic-bezier(.2,.8,.2,1)`).
- Form (column, gap 14), Bubbles `Input` (label 13px/600 above, field radius 14, 1.5px border `rgba(23,22,46,.16)`, focus ring `0 0 0 3px rgba(90,66,255,.35)`, error border `#FF5E7E`):
  - "الاسم على البطاقة" — placeholder "كما هو مطبوع على البطاقة", autocomplete cc-name
  - "رقم البطاقة" — LTR, numeric, grouped `0000 0000 0000 0000`, max 16 digits; error "رقم البطاقة غير صحيح"
  - 2-col grid gap 12: "تاريخ الانتهاء" (`MM / YY`, auto-inserts ` / `) · "رمز الأمان CVC" (password, 3–4 digits)
  - Subscription only: Checkbox "أوافق على تجديد الاشتراك وسحب <price> ر.س شهريًا من هذه البطاقة حتى الإلغاء"
  - Primary Button `size=lg`, full width, centered text, violet `#5A42FF` (hover `#4A33E6`, press `#3D28C4` + translateY 1px), radius 999, height 52, white text 16px / 600:
    - once: "ادفع 136.85 ر.س"
    - subscription: "اشترك — <price> ر.س / شهريًا" + helper "أول سحب اليوم، والتجديد التالي في 14 يونيو." (12px, ink-56, centered)
  - Disabled (40% opacity, no pointer) until valid.
- Footer (12px, ink-56, centered, 1.5px top border, padding-top 16): "مؤمَّن بواسطة" + Moyasar wordmark + "· ميسر · متوافق مع PCI DSS".

### 4. Processing state
Same white card, min-height 520, centered: Bubbles `BeatIcon` (three dots pulsing in sequence, `bb-beat`), "نعالج الدفع بأمان…" 20px / 700, "لا تغلق الصفحة — لن يُخصم المبلغ مرتين." 13.5px ink-72. Summary hidden.

### 5. Success state
White card, padding 48/26/28, centered: 88px yellow `#FFD84D` circle with 40px ink check; title 24px / 700:
- once: "تم الدفع، حجزك مؤكد!" + "أرسلنا الإيصال إلى بريدك. سنُشعرك عند تعيين الفنّي وقبل وصوله."
- subscription: "اشتراكك في نادي Bubbles فعّال!" + "خُصم <price> ر.س اليوم. التجديد التالي: 14 يونيو — سنذكّرك قبله بثلاثة أيام."
Then `BookingTicket` (label "بطاقة الحجز", time "10:30–11:00", meta "الثلاثاء 14 مايو · فيلا 12، حي النخيل"), transaction row "رقم العملية — MYSR-8F2K-41A9" (13.5px ink-56, LTR tabular), ghost Button "العودة إلى التطبيق".

## Interactions & Behavior
- Card number: strip non-digits, cap 16, group by 4. Brand detection on each keystroke: mada BIN prefix list (4464, 4578, 4886, 5297, 5859, 588845–588851, 588982, 588983, 589005, 589206, 604906, 605141, 636120, 968201–968211 — use Moyasar's/full mada BIN list in prod), else `4` → Visa, `51–55` / `22–27` → Mastercard. mada must be checked **before** Visa/MC.
- Luhn check once 16 digits are entered → error text.
- Expiry: digits only, cap 4, format `MM / YY`. CVC: digits, cap 4.
- Pay button enabled when: name ≥ 2 chars, 16 digits + Luhn OK, expiry 4 digits, CVC ≥ 3, and (subscription → consent checked).
- Tapping Apple Pay / Samsung Pay / Pay → `processing` → SDK result → `success` (or error toast). The HTML fakes this with a 1.9s timer.
- Subscription = Moyasar **recurring** payment: tokenize card / wallet, first charge today, then monthly on the same day; the consent checkbox is mandatory (store timestamp).
- Motion: 120–200ms, `cubic-bezier(.2,.8,.2,1)`; brand-tile ring/opacity 120ms.
- Screen scrolls vertically; keyboard should not cover the active input (KeyboardAvoidingView).

## State Management
Props from the app: `mode: 'once'|'subscription'`, `plan: 'basic'|'super'|'shine'` (or plan object), booking/price data, `wallets` availability.
Local state: `name, number, exp, cvc, consent, touched, phase: 'form'|'processing'|'success'`.
Derived: `brand`, `numberError`, `ready`, totals (`net = price/1.15`, `vat = price − net`, `perWash = price/washes`).

## Design Tokens (Bubbles)
- Colors: violet `#5A42FF` (hover `#4A33E6`, press `#3D28C4`, tint `#EEEBFF`), guava `#FF5E7E`, yellow `#FFD84D`, ice `#BDEEFF`, ink `#17162E`, ink-72 `rgba(23,22,46,.72)`, ink-56 `.56`, ink-16 `.16`, ink-10 `.1`, cloud `#FAFAF5`, white `#FFFFFF`. Wallet buttons: `#000` (brand requirement).
- Spacing: 4 / 8 / 12 / 14 / 16 / 20 / 24 / 40.
- Type: IBM Plex Sans Arabic (Google Fonts) — 11 label (.08em), 12 / 12.5 caption, 13.5 / 14.5 body, 16 button, 18 card title, 22 H1, 24 success title, 26–30 display numbers (-0.02em, tabular). Weights 400 / 500 / 600 / 700.
- Radius: 6 (brand tiles), 14 (inputs/notice), 28 (cards), 999 (pills/buttons).
- Shadow: card `0 1px 2px rgba(23,22,46,.05), 0 6px 20px rgba(23,22,46,.07)`.
- Focus ring: `0 0 0 3px rgba(90,66,255,.35)`.

## Assets
- `assets/bubbles-logo.svg` — brand lockup (never redraw).
- Icons: Lucide (`lock`, `clock`, `refresh-cw`, `check`), 2px stroke, currentColor.
- Payment marks in the HTML are **simplified stand-ins** — use official mada, Visa, Mastercard, Apple Pay, Samsung Pay and Moyasar assets per their brand guidelines.

## Files
- `MoyasarCheckout.dc.html` — the design reference (template markup + logic class at the bottom).
- `ds-base.js`, `support.js` — preview runtime only (ignore).
- `styles.css`, `tokens/` — Bubbles token source.
- `assets/bubbles-logo.svg`.
