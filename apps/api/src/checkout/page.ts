export interface CheckoutPage {
  language: 'ar' | 'en';
  mode: 'booking' | 'membership';
  title: string;
  description: string;
  vehicle?: string;
  address?: string;
  schedule: Array<{ label: string; time: string }>;
  lines: Array<{ label: string; amount: number }>;
  amount: number;
  reference: string;
  renewal?: { date: string; amount: number };
  sdk?: Record<string, unknown>;
  fallbackUrl?: string;
  statusUrl?: string;
  consentUrl?: string;
  returnUrl?: string;
  status?: 'form' | 'paid' | 'pending' | 'unavailable';
  preview?: boolean;
}
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export function checkoutPage(p: CheckoutPage) {
  const ar = p.language === 'ar';
  const t = (a: string, e: string) => ar ? a : e;
  const money = (minor: number) => `<span class="money"><bdi>${(minor / 100).toFixed(2)}</bdi><span>${t('ر.س', 'SAR')}</span></span>`;
  const h = escapeHtml;
  const lock = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  const paid = p.status === 'paid';
  const unavailable = p.status === 'unavailable';
  return `<!doctype html><html lang="${p.language}" dir="${ar ? 'rtl' : 'ltr'}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">
<title>${t('الدفع', 'Checkout')} · Bubbles</title>
<link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.15.0/moyasar.css"><link rel="stylesheet" href="/checkout/checkout.css">
<script defer src="https://cdn.moyasar.com/mpf/1.15.0/moyasar.js"></script><script defer src="/checkout/checkout.js"></script></head>
<body><div class="checkout-shell">
<header class="brand-header"><img src="/checkout/assets/bubbles-logo.svg" alt="Bubbles" width="173" height="28"><span class="secure">${lock}${t('الدفع عبر ميسر', 'Payment via Moyasar')}</span></header>
${p.preview ? `<p class="preview-note">${t('معاينة التصميم · بيانات الباقات من الكتالوج · الدفع معطل', 'Design preview · catalogue plan data · payments disabled')}</p>` : ''}
<main class="checkout-layout${paid || unavailable ? ' result-layout' : ''}">
<aside class="order-column" aria-label="${t('ملخص الطلب', 'Order summary')}">
<section class="order-summary" aria-label="${t('تفاصيل الطلب والمبلغ', 'Order and price details')}">
<header class="order-card ${p.mode === 'membership' ? 'membership' : 'booking'}">
<div class="order-top">${t('ملخص الطلب', 'Order summary')}</div>
<h1>${h(p.title)}</h1>
<p class="order-description">${h(p.description)}${p.mode === 'membership' ? `${p.description ? ' · ' : ''}${t('اشتراك كل 30 يومًا', 'Subscription every 30 days')}` : ''}</p>
</header>
${p.vehicle || p.address || p.schedule.length ? `<div class="order-fulfilment">
${p.vehicle ? `<p class="order-vehicle">${h(p.vehicle)}</p>` : ''}${p.address ? `<p class="order-address">${h(p.address)}</p>` : ''}
${p.schedule.length ? `<div class="schedule">${p.schedule.map((s) => `<div><span>${h(s.label)}</span><bdi>${h(s.time)}</bdi></div>`).join('')}</div>` : ''}
</div>` : ''}
<div class="totals-card">
${p.lines.length > 1 ? p.lines.map((l) => `<div class="ledger-row"><span>${h(l.label)}</span>${money(l.amount)}</div>`).join('') : ''}
<div class="ledger-row grand-total"><div><strong>${p.mode === 'membership' ? t('المستحق اليوم', 'Due today') : t('الإجمالي', 'Total')}</strong><small>${t('شامل ضريبة القيمة المضافة', 'VAT included')}</small></div>${money(p.amount)}</div>
${p.renewal ? `<div class="renewal-row"><div><span>${t('التجديد التلقائي التالي', 'Next automatic renewal')}</span><time>${h(p.renewal.date)}</time></div>${money(p.renewal.amount)}</div>` : ''}
</div>
</section>
</aside>
<section class="payment-card" aria-labelledby="payment-title">
${paid ? `<div class="result-mark" aria-hidden="true"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg></div><h2 id="payment-title">${t('تم تأكيد الدفع', 'Payment confirmed')}</h2><p>${t('يمكن متابعة حالة الطلب من الحساب.', 'You can follow your order from your account.')}</p>${p.returnUrl ? `<a class="primary-action" href="${h(p.returnUrl)}">${t('العودة إلى الطلب', 'Return to order')}</a>` : ''}` : unavailable ? `<h2 id="payment-title">${t('رابط الدفع غير متاح', 'Checkout unavailable')}</h2><p>${t('انتهت مهلة الدفع أو أُلغي الطلب. يمكن العودة إلى الطلب للتحقق من حالته.', 'The checkout expired or the order was cancelled. Return to the order to check its status.')}</p>${p.returnUrl ? `<a class="primary-action" href="${h(p.returnUrl)}">${t('العودة إلى الطلب', 'Return to order')}</a>` : ''}` : `
<h2 id="payment-title">${t('إتمام الدفع', 'Complete payment')}</h2>
<p class="payment-lead">${t('اختيار وسيلة الدفع وإدخال بياناتها.', 'Choose a payment method and enter its details.')}</p>
${p.renewal ? `<label class="consent"><input id="renewal-consent" type="checkbox"><span>${t(`أوافق على تجديد الاشتراك وخصم ${(p.renewal.amount / 100).toFixed(2)} ر.س كل 30 يومًا حتى إلغاء التجديد.`, `I agree to renew this subscription and pay SAR ${(p.renewal.amount / 100).toFixed(2)} every 30 days until renewal is cancelled.`)}</span></label>` : ''}
<p id="payment-error" class="notice error" role="alert" hidden></p>
<div id="loading" class="loading" role="status"><span class="beat" aria-hidden="true"><i></i><i></i><i></i></span><span>${t('جار تحميل وسائل الدفع…', 'Loading payment methods…')}</span></div>
<div id="moyasar-form"><div class="mysr-form"></div></div>
<div id="payment-recovery" hidden><p>${t('تعذر تحميل وسائل الدفع. يمكن إعادة المحاولة.', 'Payment methods could not load. Try again.')}</p><button class="primary-action" id="retry-load" type="button">${t('إعادة المحاولة', 'Try again')}</button>${p.fallbackUrl && !p.renewal ? `<a class="text-action" href="${h(p.fallbackUrl)}">${t('فتح صفحة ميسر', 'Open Moyasar checkout')}</a>` : ''}</div>
<noscript><p>${t('يلزم تفعيل JavaScript لإتمام الدفع.', 'JavaScript is required to complete payment.')}</p></noscript>
<div id="verifying" class="notice" role="status" hidden>${t('جار التحقق من نتيجة الدفع…', 'Verifying payment…')}</div>
`}
<footer class="payment-footer">${lock}<span>${t('تتم معالجة بيانات الدفع بواسطة ميسر', 'Payment details are processed by Moyasar')}</span></footer>
</section>
</main><footer class="checkout-footer"><span>${t('رقم الطلب', 'Order reference')} <bdi>${h(p.reference)}</bdi></span>${p.status !== 'paid' && p.returnUrl ? `<a href="${h(p.returnUrl)}">${t('العودة إلى الطلب', 'Return to order')}</a>` : ''}</footer>
</div><script id="checkout-config" type="application/json">${json({ sdk: p.sdk, preview: p.preview, status: p.status, statusUrl: p.statusUrl, consentUrl: p.consentUrl, renewal: !!p.renewal, language: p.language })}</script></body></html>`;
}

export function checkoutErrorPage(language: 'ar' | 'en' = 'ar', temporary = false) {
  const ar = language === 'ar';
  const heading = temporary ? (ar ? 'تعذر تحميل صفحة الدفع' : 'Could not load checkout') : (ar ? 'انتهت صلاحية رابط الدفع' : 'Checkout link expired');
  const body = temporary ? (ar ? 'يمكن إعادة المحاولة بعد التحقق من الاتصال.' : 'Check your connection and try again.') : (ar ? 'يمكن العودة إلى الطلب لفتح صفحة دفع جديدة.' : 'Return to your order to open a new checkout.');
  return `<!doctype html><html lang="${language}" dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${heading} · Bubbles</title><link rel="stylesheet" href="/checkout/checkout.css"></head><body><main class="checkout-shell standalone-error"><img src="/checkout/assets/bubbles-logo.svg" width="173" height="28" alt="Bubbles"><section class="payment-card"><h1>${heading}</h1><p>${body}</p>${temporary ? `<a class="primary-action" href="">${ar ? 'إعادة المحاولة' : 'Try again'}</a>` : ''}</section></main></body></html>`;
}
