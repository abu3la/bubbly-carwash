import { waterlineFillPath } from '@bubbles/design-tokens';

interface WaterlineProps {
  /** Curve depth in px. */
  depth?: number;
  /** Must match the surface of the section below the curve. */
  fill?: string;
}

/**
 * The signature meniscus edge. Decorative; place it directly above the
 * section whose surface it pours into.
 */
export function Waterline({ depth = 16, fill = 'var(--bb-foam)' }: WaterlineProps) {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height={depth}
      viewBox={`0 0 100 ${depth}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      <path d={waterlineFillPath(100, depth, depth)} fill={fill} />
    </svg>
  );
}
