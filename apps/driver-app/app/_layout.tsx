import { useState } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureApi } from '@bubbly/api-client';
import { color } from '@bubbly/design-tokens';

// Simulators reach the wrangler dev server on localhost; a physical device
// needs your machine's LAN IP here.
configureApi({ baseUrl: 'http://localhost:8787' });

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.foam },
          headerTintColor: color.ink,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.foam },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Job queue' }} />
        <Stack.Screen name="job/[id]" options={{ title: 'Job' }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
      </Stack>
    </QueryClientProvider>
  );
}
