import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const CREDENTIALS_KEY = 'user_credentials';

export const biometricService = {
  /**
   * Check if the device is capable of biometric authentication
   */
  async isHardwareAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },

  /**
   * Trigger biometric authentication prompt
   */
  async authenticate(promptMessage: string = 'Authenticate to continue'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Enter Password',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },

  /**
   * Securely save user credentials
   */
  async saveCredentials(studentId: string, password: string): Promise<void> {
    const credentials = JSON.stringify({ studentId, password });
    await SecureStore.setItemAsync(CREDENTIALS_KEY, credentials);
  },

  /**
   * Retrieve saved credentials after successful biometric authentication
   */
  async getCredentials(): Promise<{ studentId: string; password: string } | null> {
    try {
      const credentialsJson = await SecureStore.getItemAsync(CREDENTIALS_KEY);
      if (credentialsJson) {
        return JSON.parse(credentialsJson);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  },

  /**
   * Clear saved credentials
   */
  async clearCredentials(): Promise<void> {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
  },

  /**
   * Get the type of biometric supported (Fingerprint, FaceID, etc.)
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  }
};
