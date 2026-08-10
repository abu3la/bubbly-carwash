import type { BookingStatus } from '@bubbly/types';

const STATIONS = [
  { key: 'pending', label: 'Pending' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'en_route', label: 'En route' },
  { key: 'washing', label: 'Washing' },
  { key: 'done', label: 'Done' },
] as const;

// Station positions leave margin so edge labels never clip the viewBox.
const XS = [48, 184, 320, 456, 592];
const TRACK_Y = 24;
const LABEL_Y = 56;

/**
 * The shared status track: the booking fills with water station by station.
 * For `cancelled`, render a StatusBadge instead — a cancelled booking has no
 * progress to show (this component draws an empty track if handed one).
 */
export function WashTrack({ status }: { status: BookingStatus }) {
  const reached = STATIONS.findIndex((s) => s.key === status);
  const label =
    status === 'cancelled' ? 'Booking cancelled' : `Booking progress: ${STATIONS[reached].label}`;
  return (
    <svg
      viewBox="0 0 640 72"
      width="100%"
      role="img"
      aria-label={label}
      style={{ display: 'block', maxWidth: 640 }}
    >
      <line
        x1={XS[0]}
        y1={TRACK_Y}
        x2={XS[XS.length - 1]}
        y2={TRACK_Y}
        stroke="var(--bb-surface-sunken)"
        strokeWidth={6}
        strokeLinecap="round"
      />
      {reached > 0 && (
        <line
          x1={XS[0]}
          y1={TRACK_Y}
          x2={XS[reached]}
          y2={TRACK_Y}
          stroke="var(--bb-aqua-deep)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}
      {STATIONS.map((station, i) => {
        const passed = reached >= 0 && i <= reached;
        const current = i === reached;
        return (
          <g key={station.key}>
            <circle
              cx={XS[i]}
              cy={TRACK_Y}
              r={current ? 10 : 8}
              fill={passed ? 'var(--bb-aqua-deep)' : 'var(--bb-surface)'}
              stroke={passed ? 'var(--bb-aqua-deep)' : 'var(--bb-ink-faint)'}
              strokeWidth={2}
            />
            <text
              x={XS[i]}
              y={LABEL_Y}
              textAnchor="middle"
              fontSize={12}
              fontFamily="var(--bb-font-body-family)"
              fontWeight={current ? 600 : 400}
              fill={current ? 'var(--bb-ink)' : 'var(--bb-ink-soft)'}
            >
              {station.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
