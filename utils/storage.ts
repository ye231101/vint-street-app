/**
 * Storage Utilities
 * Shared functions for storage operations using @react-native-async-storage/async-storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Set a value in storage
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export async function setSecureValue(
  key: string,
  value: string
): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

/**
 * Get a value from storage
 * @param key - The key to retrieve the value for
 * @returns The stored value or null if not found
 */
export async function getSecureValue(key: string): Promise<string | null> {
  return await AsyncStorage.getItem(key);
}

/**
 * Remove a value from storage
 * @param key - The key to remove
 */
export async function removeSecureValue(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Check if a key exists in storage
 * @param key - The key to check
 * @returns True if the key exists, false otherwise
 */
export async function hasSecureValue(key: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(key);
  return value !== null;
}

/**
 * Store a JSON object in storage
 * @param key - The key to store the object under
 * @param value - The object to store
 */
export async function setSecureJSON(key: string, value: any): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Get a JSON object from storage
 * @param key - The key to retrieve the object for
 * @returns The parsed object or null if not found
 */
export async function getSecureJSON(key: string): Promise<any | null> {
  const value = await AsyncStorage.getItem(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON for key ${key}:`, error);
      return null;
    }
  }
  return null;
}
