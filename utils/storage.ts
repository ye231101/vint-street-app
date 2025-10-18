/**
 * Storage Utilities
 * Shared functions for storage operations using @react-native-async-storage/async-storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Set a value in storage
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export const setStorageValue = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

/**
 * Get a value from storage
 * @param key - The key to retrieve the value for
 * @returns The stored value or null if not found
 */
export const getStorageValue = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

/**
 * Remove a value from storage
 * @param key - The key to remove
 */
export const removeStorageValue = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

/**
 * Check if a key exists in storage
 * @param key - The key to check
 * @returns True if the key exists, false otherwise
 */
export const hasStorageValue = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value !== null;
};

/**
 * Store a JSON object in storage
 * @param key - The key to store the object under
 * @param value - The object to store
 */
export const setStorageJSON = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

/**
 * Get a JSON object from storage
 * @param key - The key to retrieve the object for
 * @returns The parsed object or null if not found
 */
export const getStorageJSON = async (key: string) => {
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
};
