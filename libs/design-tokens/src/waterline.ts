/**
 * The waterline — Bubbly's one bespoke silhouette: a shallow meniscus curve,
 * crest at y=0, resting at y=depth. Drawn from this module everywhere it
 * appears (sheet tops, wash-track fill edge, landing section transition) so
 * the geometry is identical on native (react-native-svg), web SVG, and CSS
 * clip-path.
 */
export function waterlinePath(width: number, depth: number): string {
  return `M0,${depth} Q${width / 2},0 ${width},${depth}`;
}

/** Closed variant for fills and clip paths: curve, then down to `height`. */
export function waterlineFillPath(width: number, depth: number, height: number): string {
  return `${waterlinePath(width, depth)} L${width},${height} L0,${height} Z`;
}
