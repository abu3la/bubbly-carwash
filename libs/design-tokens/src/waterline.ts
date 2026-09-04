/** The shallow wash-water silhouette shared by native and web surfaces. */
export function waterlinePath(width: number, depth: number) {
  return `M0,${depth} Q${width / 2},0 ${width},${depth}`;
}

export function waterlineFillPath(width: number, depth: number, height: number) {
  return `${waterlinePath(width, depth)} L${width},${height} L0,${height} Z`;
}
