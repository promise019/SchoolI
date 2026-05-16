import Platform from 'react-native';

// Replace with your local machine's IP address if testing on a physical device
// For Android emulator: 10.0.2.2
// For iOS simulator: localhost
const API_BASE = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

export const CONFIG = {
  API_URL: API_BASE,
  SOCKET_URL: SOCKET_URL,
};
