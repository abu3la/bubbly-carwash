/* global document, window, location, fetch, setTimeout, AbortSignal, MutationObserver, URL */
(() => {
  const config = JSON.parse(document.getElementById('checkout-config').textContent);
  if (config.status === 'paid' || config.status === 'unavailable') return;
  const ar = config.language === 'ar';
  const loading = document.getElementById('loading');
  const recovery = document.getElementById('payment-recovery');
  const error = document.getElementById('payment-error');
  const form = document.getElementById('moyasar-form');
  const consent = document.getElementById('renewal-consent');
  const verifying = document.getElementById('verifying');
  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
  };
  document.getElementById('retry-load')?.addEventListener('click', () => location.reload());
  if (!config.sdk || !window.Moyasar) {
    loading.hidden = true;
    recovery.hidden = false;
    return;
  }
  let busy = false;
  form.addEventListener('submit', (event) => {
    if (!config.preview) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showError(ar ? 'هذه معاينة للتصميم، ولا تنفذ أي عملية دفع.' : 'This design preview does not process payments.');
  }, true);
  window.Moyasar.init({
    ...config.sdk,
    element: form.querySelector('.mysr-form'),
    language: config.language,
    fixed_width: false,
    translations: {
      ar: {
        'form.card_info': 'رقم البطاقة',
        'form.save_card_notice': 'تُحفظ البطاقة لدى ميسر للتجديد التلقائي.',
      },
    },
    on_initiating: async () => {
      error.hidden = true;
      if (config.preview) {
        showError(
          ar
            ? 'هذه معاينة للتصميم، ولا تنفذ أي عملية دفع.'
            : 'This design preview does not process payments.',
        );
        throw (ar ? 'تعذر بدء الدفع.' : 'Could not start payment.');
      }
      if (busy) throw (ar ? 'جار إتمام الدفع.' : 'Payment in progress.');
      if (config.renewal && !consent?.checked) {
        showError(
          ar
            ? 'تلزم الموافقة على التجديد التلقائي لإتمام الاشتراك.'
            : 'Agree to automatic renewal to continue.',
        );
        consent?.focus();
        throw (ar ? 'تعذر بدء الدفع.' : 'Could not start payment.');
      }
      busy = true;
      try {
        // Revalidate the invoice and record consent immediately before any method charges.
        const response = await fetch(config.consentUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ renewalConsent: Boolean(consent?.checked) }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error('notReady');
        return true;
      } catch {
        busy = false;
        showError(
          ar
            ? 'تعذر بدء الدفع. تحقق من الاتصال وأعد المحاولة.'
            : 'Could not start payment. Check your connection and try again.',
        );
        throw (ar ? 'تعذر بدء الدفع.' : 'Could not start payment.');
      }
    },
    on_failure: () => {
      busy = false;
      verifying.hidden = true;
      showError(
        ar
          ? 'لم تكتمل عملية الدفع. تحقق من بيانات الدفع أو استخدم وسيلة أخرى.'
          : 'Payment did not complete. Check your details or use another method.',
      );
    },
    on_completed: async (payment) => {
      verifying.hidden = false;
      if (config.renewal && !config.preview) {
        const url = new URL(config.consentUrl);
        url.pathname = url.pathname.replace(/\/prepare$/, '/capture');
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: payment.id }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error('Could not save payment reference');
      }
    },
  });
  const labelFields = () => {
    const fields = [
      ['#mysr-cc-name', 'الاسم على البطاقة', 'Name on card', 'cc-name'],
      ['[autocomplete="cc-exp"]', 'تاريخ الانتهاء', 'Expiry date', 'cc-exp'],
      ['[autocomplete="cc-csc"]', 'رمز الأمان', 'Security code', 'cc-csc'],
    ];
    for (const [selector, arabic, english, autocomplete] of fields) {
      const input = form.querySelector(selector);
      if (!input) continue;
      const label = ar ? arabic : english;
      if (input.getAttribute('aria-label') !== label) input.setAttribute('aria-label', label);
      if (input.autocomplete !== autocomplete) input.autocomplete = autocomplete;
      if (autocomplete === 'cc-csc' && input.type !== 'password') input.type = 'password';
    }
    const button = form.querySelector('button.mysr-form-button');
    if (button && !button.hasAttribute('aria-label'))
      button.setAttribute(
        'aria-label',
        (ar ? 'دفع ' : 'Pay ') + (config.sdk.amount / 100).toFixed(2) + (ar ? ' ر.س' : ' SAR'),
      );
  };
  new MutationObserver(labelFields).observe(form, { childList: true, subtree: true });
  labelFields();
  loading.hidden = true;
  if (config.status === 'pending' && config.statusUrl) {
    form.hidden = true;
    verifying.hidden = false;
    let attempts = 0;
    const check = async () => {
      try {
        const response = await fetch(config.statusUrl, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error('verificationUnavailable');
        const result = await response.json();
        if (result.status === 'paid') {
          location.replace(result.url);
          return;
        }
        if (result.status === 'unavailable') {
          location.replace(result.url);
          return;
        }
        if (result.status === 'failed') {
          form.hidden = false;
          verifying.hidden = true;
          showError(
            ar
              ? 'لم يكتمل الدفع. يمكن المحاولة مرة أخرى.'
              : 'Payment was not completed. You can try again.',
          );
          return;
        }
      } catch {
        /* Keep uncertain results distinct from a failed charge. */
      }
      if (++attempts < 6) setTimeout(check, 2500);
      else {
        verifying.hidden = true;
        showError(
          ar
            ? 'لم تصل نتيجة الدفع بعد. أعد التحقق قبل محاولة الدفع مجددًا.'
            : 'The payment result is not available yet. Check again before paying again.',
        );
        recovery.hidden = false;
      }
    };
    check();
  }
})();
