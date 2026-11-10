# Mobile interface refinement

Scope: the six user-approved changes to the customer and driver applications. Existing session, onboarding-skip, fixed-header and button-loading work is preserved. No deployment or production records changed.

## Result

- Customer sign-in: one screen title, a named mobile-number field and retained terms. Removed the duplicate heading and verification explanation. Driver sign-in also drops its repeated explanation and oversized decorative brand treatment.
- Shared buttons: medium rounded corners, neutral secondary surfaces and ink text for secondary actions. Loading behavior and hit targets remain intact. Disabled text has a neutral surface and legible ink rather than translucent violet.
- Introduction: one interactive illustrative booking. Appointment, arrival and evidence controls change the content; skip and sign-in actions remain. The example is labeled and does not invent photos or make a live-booking claim.
- Booking: the appointment retains the supplied ticket design; vehicle/address details now render in full below it. Add-ons and payment choices use spacing rather than nested cards. Vehicle/address choices share a grouped surface. Subscription review combines related details and retains fee, renewal consent and schedule conditions.
- Driver task: villa, time and service lead. The camera action precedes the evidence checklist and customer details, with a 64-unit minimum height. The duplicated instruction was removed. Reporting controls remain available below the task details.
- Color and depth: ordinary cards no longer have default shadows; active selection retains a stable inset outline. Metadata, secondary action icons, ticket labels and completed driver-progress tracks use ink. The brand palette and Plex font families remain unchanged.

## Visual review

Reviewed on an iPhone 17 Pro iOS simulator using temporary copies of the actual screen components with local data and mocked requests. The bottom four-button navigation visible in introduction, booking and driver screenshots belongs only to the review harness. The final login screenshot uses the normal application entry. All harness files were removed and the application entry restored.

- Arabic/English introduction: stage selection, language switching and skip were clicked; content and direction updated.
- Customer sign-in: duplicate copy removed, field label and terms visible.
- Booking review: selecting an optional add-on changed the illustrative total from 50 to 60 SAR. No transaction submitted.
- Driver task: camera action visible ahead of the checklist; reporting form opened and cancelled. Camera capture, live authentication and production operations were not exercised.
- Screenshots: `intro-ar.png`, `login-ar.png`, `booking-ar.png`, `driver-ar.png`.

The full anti-slop instructions were reviewed against these changed mobile surfaces: no new ornamental gradients, glows, fake media, default shadows or entrance-hidden content; action hierarchy, spacing, notched-ticket text clearance, RTL layout and loading labels were inspected. Website-only hero/footer rules are outside this mobile scope. Existing approved brand colors, fonts and useful icons take precedence over generic defaults. No claim is made that every unchanged application screen was visually audited.

## Copy decisions

| Location | Previous | Decision | Result / visible context |
| --- | --- | --- | --- |
| Customer login heading | سجّل دخولك برقم جوالك | Replace | رقم الجوال labels the field; تسجيل الدخول already labels the screen. |
| Customer login description | نستخدم رقم جوالك للتحقق من هويتك. | Remove | The mobile field and إرسال رمز التحقق action communicate this. Terms remain. |
| Intro example label | None | Add | مثال توضيحي للحجز identifies the displayed data as illustrative. |
| Driver photo action | صوّر اليمين (and other angles) | Replace | تصوير اليمين (same angle-dependent action). |
| Driver evidence status | موثّق | Replace | تم التوثيق preserves completion status. |

## Checks

- Shared button tests: 4 passed (pending lock, rejected request recovery, disabled/external loading, unmount).
- TypeScript: customer app, driver app and native UI library passed.
- ESLint: customer app, driver app and native UI library passed.
- `git diff --check`: passed.
- Normal iOS application entry bundled successfully after the harness was removed; persisted introduction-skip opened the simplified login.
