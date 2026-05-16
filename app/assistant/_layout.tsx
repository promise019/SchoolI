import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function AssistantLayout() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="study-chat" />
    </Stack>
  );
}
