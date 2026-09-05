import { Waterline } from '@bubbles/ui-web';

/** The signature meniscus edge: place it directly above the section whose
 * surface it pours into — the fill must match that section's background. */
export const SectionTransition = () => (
  <div style={{ maxWidth: 480 }}>
    <div style={{ background: 'var(--bb-surface)', padding: '24px 20px' }}>
      Your washer is on the way.
    </div>
    <Waterline depth={16} fill="var(--bb-foam)" />
    <div style={{ background: 'var(--bb-foam)', padding: '20px', color: 'var(--bb-ink-soft)' }}>
      Booking details
    </div>
  </div>
);

export const DeepCurve = () => (
  <div style={{ maxWidth: 480 }}>
    <div style={{ background: 'var(--bb-surface)', height: 32 }} />
    <Waterline depth={28} fill="var(--bb-surface-sunken)" />
    <div style={{ background: 'var(--bb-surface-sunken)', height: 48 }} />
  </div>
);
