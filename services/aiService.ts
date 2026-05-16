import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system/legacy';
import { ACADEMIC_RESOURCES, Resource, getRecommendedResources } from '../constants/Resources';

// Note: In a real app, this should be in an environment variable
// EXPO_PUBLIC_GEMINI_API_KEY
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

import { getFromCache, saveToCache } from './aiCache';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const chatWithStudyAI = async (
  history: ChatMessage[],
  message: string,
  base64Image?: string,
  base64Audio?: string
) => {
  // Try cache first for text queries (patterns)
  if (!base64Image && !base64Audio && message) {
    const cached = await getFromCache(message);
    if (cached) {
      return {
        ...cached,
        isCached: true
      };
    }
  }

  if (!API_KEY) {
    return {
      text: "Please provide a valid Gemini API Key in your environment variables to enable the AI features.",
      resources: [],
      isOffline: true
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let result;
    if (base64Image) {
      // Multimodal request (Scan)
      result = await model.generateContent([
        "You are a study assistant. Summarize this image of a book page or academic resource. Also, suggest if any of our internal courses relate to it. Keep it concise and formatted in markdown.",
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg"
          }
        }
      ]);
    } else if (base64Audio) {
      // Multimodal request (Audio)
      result = await model.generateContent([
        "You are a study assistant. Listen to this audio and provide a detailed summary. If it's a lecture, highlight the key points and explain complex terms. Format in markdown.",
        {
          inlineData: {
            data: base64Audio,
            mimeType: "audio/mp4" // Expo's HIGH_QUALITY is usually m4a
          }
        }
      ]);
    } else {
      // Text-only chat
      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      result = await chat.sendMessage(message);
    }

    const response = await result.response;
    const text = response.text();

    // Basic regex to find course codes like CSC 411 or keywords to recommend resources
    const recommended = getRecommendedResources(text + " " + message);

    const finalResponse = {
      text: text,
      resources: recommended.slice(0, 2) // Limit to 2 recommendations per message
    };

    // Save to cache if successful text query
    if (!base64Image && !base64Audio) {
      saveToCache(message, finalResponse);
    }

    return finalResponse;
  } catch (error: any) {
    console.error("AI Error:", error);
    
    // If it's a network error/offline, try cache once more as a fallback
    const fallback = await getFromCache(message);
    if (fallback) {
      return {
        ...fallback,
        isCached: true,
        isOffline: true
      };
    }

    return {
      text: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your internet connection.",
      resources: [],
      isOffline: true
    };
  }
};

export const imageToBase64 = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    return base64;
  } catch (e) {
    console.error("Failed to convert image to base64", e);
    return null;
  }
};
export const audioToBase64 = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });
    return base64;
  } catch (e) {
    console.error("Failed to convert audio to base64", e);
    return null;
  }
};
