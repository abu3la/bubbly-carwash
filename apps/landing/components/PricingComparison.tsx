'use client';
import { useId, useState } from 'react';
import { Button } from './primitives';
import type { useLanding } from './useLanding';
import type { strings, Language } from './strings';
import styles from '../styles/landing.module.css';

export function PricingComparison({ plans, lang, copy }: {
  plans: ReturnType<typeof useLanding>['plans'];
  lang: Language;
  copy: typeof strings.ar.packages;
}) {
  const groupId = useId();
  const frequencies = [...new Set(plans.filter(p => p.weekly > 0).map(p => p.weekly))].sort((a, b) => a - b);
  const [selection, setSelection] = useState<number | null>(null);
  const weekly = selection !== null && frequencies.includes(selection) ? selection : frequencies[0];
  const subscriptions = plans.filter(p => p.weekly === weekly);
  const single = plans.find(p => p.weekly === 0);
  const ar = lang === 'ar';
  return (
    <div className={styles.pricingComparison}>
      {frequencies.length > 0 && <fieldset className={styles.frequencySelector}>
        <legend>{ar ? 'كم غسلة في الأسبوع؟' : 'How many washes a week?'}</legend>
        <div className={styles.frequencyOptions}>
          {frequencies.map(frequency => <label key={frequency} className={styles.frequencyOption}>
            <input type="radio" name={groupId} value={frequency} checked={weekly === frequency} onChange={() => setSelection(frequency)} />
            <span>{ar ? frequency === 2 ? 'غسلتان' : `${frequency} غسلات` : `${frequency} washes`}</span>
          </label>)}
        </div>
      </fieldset>}
      <div className={styles.planGrid} aria-live="polite" aria-atomic="true">
        {subscriptions.map((plan, index) => <article key={plan.name} className={styles.planPanel} data-tone={index % 2 === 0 ? 'ice' : 'ink'}>
          <div className={styles.planHeading}>
            <h3>{plan.name}</h3>
            <span>{plan.period}</span>
          </div>
          <p className={styles.planPrice}>{plan.price}</p>
          <p className={styles.planFrequency}>{plan.freq}</p>
          <div className={styles.planAction}>
            <Button variant="primary" size="lg" disabled>{copy.cta}</Button>
            <span>{ar ? 'الاشتراك غير متاح حاليًا' : 'Subscriptions are currently unavailable'}</span>
          </div>
        </article>)}
      </div>
      {single && <article className={styles.singleWash}>
        <div><h3>{single.name}</h3><p>{single.period}</p></div>
        <p className={styles.singlePrice}>{single.price}</p>
      </article>}
      <p className={styles.pricingNote}><a href={`/${lang}/terms`}>{ar ? 'تطبق الشروط والأحكام' : 'Terms and conditions apply'}</a></p>
    </div>
  );
}
