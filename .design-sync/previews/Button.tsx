import { Button } from '@sama/ui-web';

export const Primary = () => <Button>Confirm & pay</Button>;

export const Quiet = () => <Button variant="quiet">Reschedule</Button>;

export const Disabled = () => <Button disabled>Choose a time</Button>;

/** House action pattern: one primary, secondary as quiet text — never two
 * competing filled/outlined buttons. */
export const ActionRow = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button>Accept job</Button>
    <Button variant="quiet">Decline</Button>
  </div>
);
