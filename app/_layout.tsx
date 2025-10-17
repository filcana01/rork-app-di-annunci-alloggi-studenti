import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/hooks/use-app-context";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();



function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="filters" options={{ presentation: 'modal', title: 'Filtri' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClientState] = useState(() => new QueryClient());
  const [trpcClientState] = useState(() => trpcClient);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClientState} queryClient={queryClientState}>
      <QueryClientProvider client={queryClientState}>
        <AppProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}