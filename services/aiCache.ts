import * as FileSystem from 'expo-file-system/legacy';

const CACHE_FILE = FileSystem.documentDirectory + 'study_ai_cache.json';
const HISTORY_FILE = FileSystem.documentDirectory + 'study_chat_history.json';

export interface CacheEntry {
  query: string;
  response: {
    text: string;
    resources: any[];
  };
  timestamp: number;
}

/**
 * Normalizes a string for better pattern matching:
 * - Lowercase
 * - Remove special characters
 * - Trim
 */
const normalize = (str: string) => {
  return str.toLowerCase().replace(/[^\w\s]/gi, '').trim();
};

/**
 * Basic "Pattern Matching" using Jaccard Similarity on keywords
 */
const calculateSimilarity = (s1: string, s2: string) => {
  const words1 = new Set(normalize(s1).split(/\s+/));
  const words2 = new Set(normalize(s2).split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

export const saveToCache = async (query: string, response: any) => {
  try {
    const existing = await loadCache();
    const normalizedQuery = normalize(query);
    
    // We only cache if query is meaningful
    if (normalizedQuery.length < 3) return;

    existing[normalizedQuery] = {
      query: query,
      response: response,
      timestamp: Date.now()
    };

    await FileSystem.writeAsStringAsync(CACHE_FILE, JSON.stringify(existing));
  } catch (e) {
    console.error("Cache Save Error:", e);
  }
};

export const getFromCache = async (query: string) => {
  try {
    const cache = await loadCache();
    const normalizedQuery = normalize(query);

    // 1. Precise Match
    if (cache[normalizedQuery]) {
      return cache[normalizedQuery].response;
    }

    // 2. Pattern Matching (Find similar previous questions)
    let bestMatch = null;
    let highestScore = 0;

    for (const key in cache) {
      const score = calculateSimilarity(normalizedQuery, key);
      if (score > 0.7 && score > highestScore) { // 70% word overlap threshold
        highestScore = score;
        bestMatch = cache[key].response;
      }
    }

    return bestMatch;
  } catch (e) {
    console.error("Cache Get Error:", e);
    return null;
  }
};

const loadCache = async (): Promise<Record<string, CacheEntry>> => {
  try {
    const info = await FileSystem.getInfoAsync(CACHE_FILE);
    if (!info.exists) return {};

    const content = await FileSystem.readAsStringAsync(CACHE_FILE);
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
};

export const clearCache = async () => {
  try {
    await FileSystem.deleteAsync(CACHE_FILE, { idempotent: true });
    await FileSystem.deleteAsync(HISTORY_FILE, { idempotent: true });
  } catch (e) {}
};

export const saveChatHistory = async (messages: any[]) => {
  try {
    await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(messages));
  } catch (e) {
    console.error("Chat History Save Error:", e);
  }
};

export const loadChatHistory = async () => {
  try {
    const info = await FileSystem.getInfoAsync(HISTORY_FILE);
    if (!info.exists) return null;

    const content = await FileSystem.readAsStringAsync(HISTORY_FILE);
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
};
