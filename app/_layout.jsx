import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ApolloProvider } from "@apollo/client";
import { AppProvider } from "@/hooks/use-app-context";
import { trpc, trpcClient } from "@/lib/trpc";
import { apolloClient } from "@/lib/apollo";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </AppProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ApolloProvider>
  );
}