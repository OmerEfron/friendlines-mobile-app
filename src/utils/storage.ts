// Storage utility for Friendlines mobile app
// Note: Will be updated to use expo-sqlite/kv-store when API is confirmed

// For now, create a simple interface that can be easily replaced
interface StorageInterface {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
}

// Placeholder storage implementation
// This will be replaced with KVStore in a future update
class SimpleStorage implements StorageInterface {
  private storage = new Map<string, string>();

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

// Initialize storage instance
export const storage = new SimpleStorage();

// Utility functions
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    await storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const value = await storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await storage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME_PREFERENCE: 'theme_preference',
  NEWSFLASHES_CACHE: 'newsflashes_cache',
  USER_PROFILE: 'user_profile',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]; 