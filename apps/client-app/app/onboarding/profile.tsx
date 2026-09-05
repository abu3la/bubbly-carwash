import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Button, Input, Screen, Txt, useLocale } from '@bubbles/ui-native';
import { updateProfile } from '../../src/api';
import { FlowHeader } from '../../src/components/FlowHeader';
import { useCopy } from '../../src/i18n';
import { useCustomerData } from '../../src/customerData';

export default function CustomerProfile() {
  const router = useRouter();
  const { language } = useLocale();
  const copy = useCopy();
  const { refresh, applyProfile } = useCustomerData();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const save = async () => {
    setSaving(true);
    setError(false);
    try {
      const result = await updateProfile(name, language);
      applyProfile(result.profile);
      await refresh();
      router.replace('/onboarding/permission');
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen scroll contentStyle={styles.screen}>
      <FlowHeader title={copy.onboarding.profileTitle} step={3} steps={5} onBack={() => router.back()} />
      <View style={styles.body}>
        <View style={styles.head}>
          <Txt variant="title" weight="bold">{copy.onboarding.profileHeading}</Txt>
          <Txt variant="small" tone="secondary">{copy.onboarding.profileSub}</Txt>
        </View>
        <Input
          label={copy.onboarding.fullNamePlaceholder}
          value={name}
          onChangeText={setName}
          placeholder={copy.onboarding.fullNamePlaceholder}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          maxLength={80}
        />
        <View style={styles.spacer} />
        {error ? <Txt variant="small" tone="danger" center>{copy.authErrors.unknown}</Txt> : null}
        <Button
          label={saving ? copy.common.sending : copy.common.continue}
          size="lg"
          fullWidth
          disabled={saving || name.trim().length < 2}
          onPress={save}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { paddingBottom: theme.spacing[7] },
  body: { flex: 1, paddingHorizontal: theme.spacing[6], paddingTop: theme.spacing[5], gap: theme.spacing[4] },
  head: { gap: theme.spacing[1] + 2 },
  spacer: { flex: 1 },
}));
