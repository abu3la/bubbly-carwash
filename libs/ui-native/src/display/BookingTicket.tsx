import { useState, type ReactNode } from 'react';
import { Pressable, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { useUnistyles, StyleSheet } from 'react-native-unistyles';
import { useLocale } from '../theme/locale';
import { Num } from '../primitives/Num';
import { Txt } from '../primitives/Text';
import { BeatIcon } from './BeatIcon';

/** How much of the width the tear-off stub takes. */
const STUB = 0.28;
const NOTCH_R = 11;

interface BookingTicketProps {
  /** Uppercase micro-label above the time. */
  label?: string;
  /** The slot, e.g. "10:30–11:00". Rendered through `Num` for tabular figures. */
  time: string;
  /** The line under the time: day, service, address. */
  meta?: string;
  /** Content of the tear-off stub. Defaults to the three beats. */
  stub?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * The app's signature artifact: a real perforated ticket. The notches are cut
 * out of the shape itself with an even-odd SVG path rather than faked with
 * circles in the page colour, so the ticket keeps its silhouette on any ground
 * it is placed on.
 */
export function BookingTicket({ label = 'بطاقة الحجز', time, meta, stub, onPress, style }: BookingTicketProps) {
  const { theme } = useUnistyles();
  const { isRTL } = useLocale();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const onLayout = (e: LayoutChangeEvent) =>
    setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  // SVG coordinates are absolute and never mirror, so the perforation is
  // placed from the physical left edge using the app's own direction — the
  // same source the flex layout uses to decide which side the stub sits on.
  const notchX = isRTL ? size.width * STUB : size.width * (1 - STUB);
  const Container = onPress ? Pressable : View;

  return (
    <Container
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      onLayout={onLayout}
      style={[styles.ticket, style]}
    >
      {size.width > 0 ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={size.width} height={size.height}>
            <Path
              d={ticketPath(size.width, size.height, theme.radius.lg, notchX, NOTCH_R)}
              fill={theme.surface.booking}
              fillRule="evenodd"
            />
            {/* The perforation line, stopping clear of both notches. */}
            <Line
              x1={notchX}
              y1={NOTCH_R + 6}
              x2={notchX}
              y2={size.height - NOTCH_R - 6}
              stroke={theme.palette.ink16}
              strokeWidth={2}
              strokeDasharray="5 5"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      ) : null}

      <View style={styles.body}>
        <Txt variant="label" weight="bold" style={styles.label}>
          {label}
        </Txt>
        <Num variant="title" weight="bold" style={styles.time}>
          {time}
        </Num>
        {meta ? (
          <Txt variant="caption" tone="secondary" numberOfLines={2}>
            {meta}
          </Txt>
        ) : null}
      </View>

      <View style={styles.stub}>{stub ?? <BeatIcon size="sm" active={0} />}</View>
    </Container>
  );
}

/**
 * A rounded rectangle with two circular bites taken out of the top and bottom
 * edges. Even-odd fill turns the overlapping circles into holes.
 */
function ticketPath(w: number, h: number, r: number, notchX: number, notchR: number): string {
  const rect = [
    `M${r},0`,
    `H${w - r}`,
    `A${r},${r} 0 0 1 ${w},${r}`,
    `V${h - r}`,
    `A${r},${r} 0 0 1 ${w - r},${h}`,
    `H${r}`,
    `A${r},${r} 0 0 1 0,${h - r}`,
    `V${r}`,
    `A${r},${r} 0 0 1 ${r},0`,
    'Z',
  ].join(' ');
  const circle = (cx: number, cy: number) =>
    `M${cx - notchR},${cy} a${notchR},${notchR} 0 1,0 ${notchR * 2},0 a${notchR},${notchR} 0 1,0 ${-notchR * 2},0 Z`;
  return `${rect} ${circle(notchX, 0)} ${circle(notchX, h)}`;
}

const styles = StyleSheet.create((theme) => ({
  ticket: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: theme.scale(92),
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
  },
  body: { flex: 1, minWidth: 0, paddingVertical: theme.spacing[4], paddingHorizontal: theme.scale(18), gap: 2 },
  label: { color: theme.action.primary },
  time: { color: theme.text.primary },
  stub: {
    width: `${STUB * 100}%`,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[3],
  },
}));
