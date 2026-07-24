/**
 * aiService.ts
 *
 * All AI inference is handled server-side via WebSocket (socketService).
 * The Gemini API key lives ONLY in the backend .env — never in the client.
 *
 * This file retains only client-side file-to-base64 utilities that are
 * needed to prepare attachments before sending them through the socket.
 */
import * as FileSystem from 'expo-file-system/legacy';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Converts a local image URI to a base64 string so it can be sent
 * to the backend via the WebSocket message payload.
 */
export const imageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    return base64;
  } catch (e) {
    console.error('Failed to convert image to base64', e);
    return null;
  }
};

/**
 * Converts a local audio URI to a base64 string so it can be sent
 * to the backend via the WebSocket message payload.
 */
export const audioToBase64 = async (uri: string): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    return base64;
  } catch (e) {
    console.error('Failed to convert audio to base64', e);
    return null;
  }
};
