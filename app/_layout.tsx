import { Stack, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { AppProvider } from '../store/appContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { useApp } from '../store/appContext';

function RootLayoutNav() {
  const { themeOverride, isAuthenticated, isLoading } = useApp();
  const systemTheme = useColorScheme() ?? 'light';
  const theme = themeOverride ?? systemTheme;
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    // List of public route segments that don't require authentication
    const publicSegments = ['(auth)', 'auth', 'explore'];
    const inPublicGroup = segments[0] && publicSegments.includes(segments[0]);

    if (!isAuthenticated && !inPublicGroup) {
      // Signed out — redirect to login
      router.replace('/(auth)');
    } else if (isAuthenticated && inPublicGroup) {
      // Signed in but on auth screen — redirect to app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerTintColor: Colors[theme].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="explore/index" options={{ headerShown: false, title: 'Explore' }} />
      <Stack.Screen name="(auth)/index" options={{ headerShown: false, title: 'Login' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </SafeAreaProvider>
  );
}
