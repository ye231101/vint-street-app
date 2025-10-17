/**
 * Secure Storage Utilities
 * Shared functions for secure storage operations using expo-secure-store
 */

import * as SecureStore from 'expo-secure-store';

/**
 * Set a value in secure storage
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export async function setSecureValue(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

/**
 * Get a value from secure storage
 * @param key - The key to retrieve the value for
 * @returns The stored value or null if not found
 */
export async function getSecureValue(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

/**
 * Remove a value from secure storage
 * @param key - The key to remove
 */
export async function removeSecureValue(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}

/**
 * Check if a key exists in secure storage
 * @param key - The key to check
 * @returns True if the key exists, false otherwise
 */
export async function hasSecureValue(key: string): Promise<boolean> {
  const value = await SecureStore.getItemAsync(key);
  return value !== null;
}

/**
 * Store a JSON object in secure storage
 * @param key - The key to store the object under
 * @param value - The object to store
 */
export async function setSecureJSON(key: string, value: any): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

/**
 * Get a JSON object from secure storage
 * @param key - The key to retrieve the object for
 * @returns The parsed object or null if not found
 */
export async function getSecureJSON(key: string): Promise<any | null> {
  const value = await SecureStore.getItemAsync(key);
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
