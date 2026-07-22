import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * BACKEND ENVIRONMENT TOGGLE
 * Set to `true` to connect to Render Cloud backend.
 * Set to `false` to connect to your Local Machine backend.
 * 
 * You can also set EXPO_PUBLIC_USE_RENDER=true or false in .env
 */
const TOGGLE_USE_RENDER = true; // <-- Change to false to use Localhost!

const RENDER_BASE_URL = 'https://schooli-backend-cslm.onrender.com';

const isUsingRender = (): boolean => {
  if (process.env.EXPO_PUBLIC_USE_RENDER !== undefined) {
    return process.env.EXPO_PUBLIC_USE_RENDER === 'true';
  }
  return TOGGLE_USE_RENDER;
};

const getHostIp = (): string => {
  // Extract host IP address dynamically from Expo development server
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  // Android Emulator fallback to host machine loopback
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return 'localhost';
};

export const getApiUrl = (): string => {
  if (isUsingRender()) {
    return `${RENDER_BASE_URL}/api`;
  }
  if (process.env.EXPO_PUBLIC_LOCAL_API_URL) {
    return process.env.EXPO_PUBLIC_LOCAL_API_URL;
  }
  const hostIp = getHostIp();
  return `http://${hostIp}:3000/api`;
};

export const getSocketUrl = (): string => {
  if (isUsingRender()) {
    return RENDER_BASE_URL;
  }
  if (process.env.EXPO_PUBLIC_LOCAL_SOCKET_URL) {
    return process.env.EXPO_PUBLIC_LOCAL_SOCKET_URL;
  }
  const hostIp = getHostIp();
  return `http://${hostIp}:3000`;
};

export const API_URL = getApiUrl();
export const SOCKET_URL = getSocketUrl();
export const IS_RENDER_MODE = isUsingRender();

console.log(`[SchoolI Config] ${IS_RENDER_MODE ? '🌐 Cloud (Render)' : '💻 Local (Host Machine)'} API: ${API_URL}`);
