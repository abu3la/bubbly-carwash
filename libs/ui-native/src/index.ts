// primitives
export { Txt, type TextVariant, type TextWeight, type TextTone } from './primitives/Text';
export { Num } from './primitives/Num';
export { Screen } from './primitives/Screen';
export { Reveal } from './primitives/Reveal';

// actions
export { Button, type ButtonVariant, type ButtonSize } from './actions/Button';
export { IconButton } from './actions/IconButton';

// display
export { Card, type CardVariant } from './display/Card';
export { Badge, type BadgeTone } from './display/Badge';
export { Tag } from './display/Tag';
export { StatusBadge } from './display/StatusBadge';
export { BeatIcon } from './display/BeatIcon';
export { BookingTicket } from './display/BookingTicket';

// forms
export { Input } from './forms/Input';
export { Select, type SelectOption } from './forms/Select';
export { Checkbox } from './forms/Checkbox';
export { Radio } from './forms/Radio';
export { Switch } from './forms/Switch';

// feedback
export { Dialog } from './feedback/Dialog';
export { ToastProvider, useToast } from './feedback/Toast';
export { Tooltip } from './feedback/Tooltip';

// navigation
export { Tabs } from './navigation/Tabs';

// theme — the app calls configureDesignSystem() once from its entry
export { configureDesignSystem, theme, breakpoints, type AppTheme } from './theme/theme';
export { LocaleProvider, useLocale, type Language, type Direction, type Locale } from './theme/locale';
export { DirectionRoot } from './theme/DirectionRoot';
export { isolate } from './theme/bidi';
