import { Stat } from '@sama/ui-web';

export const StatRow = () => (
  <div style={{ display: 'flex', gap: 40 }}>
    <Stat value="42" label="Washes today" />
    <Stat value="$1,284" label="Revenue" />
    <Stat value="4.9" label="Avg rating" />
  </div>
);

export const Single = () => <Stat value="7 min" label="Avg response time" />;
