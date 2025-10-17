/**
 * Recently Viewed Provider
 * Tracks and manages recently viewed products
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VintStreetListing } from '@/api/types/product.types';
import { setSecureValue, getSecureValue, removeSecureValue } from '@/utils/secure-storage';

interface RecentlyViewedContextType {
  items: VintStreetListing[];
  isInitialized: boolean;
  addProduct: (product: VintStreetListing) => Promise<void>;
  clearAll: () => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = '@recently_viewed_products';
const MAX_ITEMS = 50; // Maximum number of items to store

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<VintStreetListing[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load recently viewed products from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const stored = await getSecureValue(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const products = parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        setItems(products);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading recently viewed products:', error);
      setIsInitialized(true);
    }
  };

  const saveToStorage = async (products: VintStreetListing[]) => {
    try {
      await setSecureValue(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving recently viewed products:', error);
    }
  };

  const addProduct = useCallback(async (product: VintStreetListing) => {
    setItems((prevItems) => {
      // Remove the product if it already exists (to move it to the front)
      const filtered = prevItems.filter((item) => item.id !== product.id);
      
      // Add the new product at the beginning
      const newItems = [product, ...filtered];
      
      // Limit to MAX_ITEMS
      const limited = newItems.slice(0, MAX_ITEMS);
      
      // Save to storage
      saveToStorage(limited);
      
      return limited;
    });
  }, []);

  const removeProduct = useCallback(async (productId: number) => {
    setItems((prevItems) => {
      const filtered = prevItems.filter((item) => item.id !== productId);
      saveToStorage(filtered);
      return filtered;
    });
  }, []);

  const clearAll = useCallback(async () => {
    setItems([]);
    try {
      await removeSecureValue(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed products:', error);
    }
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        isInitialized,
        addProduct,
        clearAll,
        removeProduct,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

