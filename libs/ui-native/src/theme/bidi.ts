/**
 * Unicode directional isolates.
 *
 * `writingDirection` fixes the direction of a run's own glyphs; it does not
 * stop the bidi algorithm from reordering the *segments* around them. Two
 * failures show up in Arabic screens, and both are fixed by isolating the run:
 *
 *  - "+966 55 123 4567" comes out "4567 123 55 966+" — each group internally
 *    correct, the groups back to front.
 *  - "توفير 12%" comes out "توفير %12" — the percent sign is class ET, and when
 *    the engine declines to fold it into the adjacent digits it falls back to
 *    the paragraph's RTL level and jumps to the far side of the number.
 *
 * LRI…PDI makes the enclosed characters one indivisible left-to-right unit, so
 * neither reordering can reach inside it.
 */
export const LRI = '⁦';
export const PDI = '⁩';

/**
 * Isolates a numeric token embedded in prose — a percentage, a time, an ID.
 *
 * Use it for the token only, never for the surrounding sentence: isolating
 * Arabic words alongside the number would pin *them* left-to-right too, which
 * is how "اللوحة 8241 د ح ب · سيارتي الافتراضية" once came out scrambled.
 * A run that is entirely a number wants the `Num` component instead.
 */
export function isolate(token: string | number): string {
  return `${LRI}${token}${PDI}`;
}
