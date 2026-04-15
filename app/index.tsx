import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, check for auth token here
  return <Redirect href="/(auth)" />;
}
