import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light';
  
  return (
    <Stack
      screenOptions={{
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
      {/* 
        Ensure groups are explicitly handled if needed, or just let them resolve from filesystem.
        The warning was likely because name="(auth)" was used but should be "(auth)/index" 
        or simply not used if let to resolve automatically. 
      */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/index" options={{ headerShown: false, title: 'Login' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
