import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CalendarDays, MapPin, Camera, Check } from 'lucide-react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Button, Num, Screen, Txt } from '@bubbles/ui-native';

interface Props {
  ar: boolean;
  onSkip: () => void;
  onStart: () => void;
  onLanguage: () => void;
}

/** An explicitly illustrative booking, with working stage controls and no invented photos. */
export function WelcomeExperience({ ar, onSkip, onStart, onLanguage }: Props) {
  const { theme } = useUnistyles();
  const [stage, setStage] = useState(0);
  const labels = ar ? ['الموعد', 'وصول الفريق', 'التوثيق'] : ['Appointment', 'Arrival', 'Evidence'];
  const details = ar ? [
    'اختيار السيارة والموقع والموعد، ثم مراجعة السعر قبل الدفع.',
    'متابعة وصول الفريق وحالة الغسيل من صفحة الحجز.',
    'مشاهدة صور السيارة قبل الغسيل وبعده من الحجز نفسه.',
  ] : [
    'Choose your vehicle, location and appointment. Review the price before paying.',
    'Follow the team’s arrival and wash status from your booking.',
    'View the vehicle’s before and after photos in the same booking.',
  ];
  return <Screen scroll contentStyle={styles.page} header={
    <View style={styles.header}>
      <Txt variant="bodyLg" weight="bold" style={styles.grow}>Bubbles</Txt>
      <Button label={ar ? 'English' : 'العربية'} variant="ghost" size="sm" onPress={onLanguage} />
      <Button label={ar ? 'تخطي' : 'Skip'} variant="ghost" size="sm" onPress={onSkip} />
    </View>
  }>
    <View style={styles.intro}>
      <Txt variant="title" weight="bold">{ar ? 'غسيلك عند بيتك' : 'Your wash, at home'}</Txt>
      <Txt variant="body" tone="secondary">{ar ? 'من اختيار الموعد إلى صور الغسلة.' : 'From choosing a time to viewing your wash photos.'}</Txt>
    </View>
    <View style={styles.example}>
      <Txt variant="caption" tone="secondary">{ar ? 'مثال توضيحي للحجز' : 'Illustrative booking'}</Txt>
      <View style={styles.appointment}>
        <CalendarDays size={24} color={theme.text.primary} />
        <View style={styles.grow}>
          <Num variant="title" weight="bold">09:00</Num>
          <Txt variant="small" tone="secondary">{ar ? 'غسيل خارجي' : 'Exterior wash'}</Txt>
        </View>
      </View>
      <View style={styles.location}>
        <MapPin size={18} color={theme.text.secondary} />
        <Txt variant="small" tone="secondary" style={styles.grow}>{ar ? 'شربتلي فيلج، جدة' : 'Sharbatly Village, Jeddah'}</Txt>
      </View>
      <View style={styles.stages} accessibilityRole="tablist">
        {labels.map((label, index) => <Pressable key={index} accessibilityRole="tab" accessibilityState={{ selected: stage === index }} onPress={() => setStage(index)} style={({ pressed }) => [styles.stage(stage === index), pressed && styles.pressed]}>
          <Txt variant="small" weight={stage === index ? 'bold' : 'regular'} tone={stage === index ? 'action' : 'secondary'} center>{label}</Txt>
        </Pressable>)}
      </View>
      <View style={styles.detail} accessibilityLiveRegion="polite">
        {stage === 2 ? <Camera size={24} color={theme.text.primary} /> : stage === 1 ? <Check size={24} color={theme.text.primary} /> : null}
        <Txt variant="body" weight="semibold">{stage === 0 ? (ar ? 'موعد محفوظ' : 'Appointment saved') : stage === 1 ? (ar ? 'وصل الفريق' : 'Team arrived') : (ar ? 'قبل الغسيل وبعده' : 'Before and after')}</Txt>
        <Txt variant="small" tone="secondary">{details[stage]}</Txt>
      </View>
    </View>
    <View style={styles.actions}>
      <Button label={ar ? 'ابدأ اشتراكك' : 'Start your subscription'} size="lg" fullWidth onPress={onStart} />
      <Button label={ar ? 'لدي حساب' : 'I have an account'} variant="ghost" fullWidth onPress={onSkip} />
    </View>
  </Screen>;
}

const styles = StyleSheet.create((theme) => ({
  page: { paddingHorizontal: theme.spacing[5], paddingTop: theme.spacing[2], paddingBottom: theme.spacing[5], gap: theme.spacing[5] },
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[1] },
  grow: { flex: 1 },
  intro: { gap: theme.spacing[2], paddingTop: theme.spacing[4] },
  example: { backgroundColor: theme.surface.card, borderRadius: theme.radius.lg, padding: theme.spacing[5], gap: theme.spacing[4] },
  appointment: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[4] },
  location: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] },
  stages: { flexDirection: 'row', gap: theme.spacing[1] },
  stage: (selected: boolean) => ({ flex: 1, minHeight: theme.layout.hitTarget, paddingVertical: theme.spacing[2], paddingHorizontal: theme.spacing[1], justifyContent: 'center', backgroundColor: selected ? theme.action.tint : 'transparent', borderRadius: theme.radius.sm }),
  pressed: { backgroundColor: theme.palette.ink06 },
  detail: { minHeight: theme.scale(140), gap: theme.spacing[2], justifyContent: 'center' },
  actions: { gap: theme.spacing[1], marginTop: 'auto' },
}));
