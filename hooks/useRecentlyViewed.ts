import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectRecentlyViewedItems,
  selectRecentlyViewedLoading,
  selectRecentlyViewedError,
  selectRecentlyViewedInitialized,
  selectRecentlyViewedCount,
  selectIsRecentlyViewedEmpty,
  selectRecentlyViewedHasItems,
  selectIsProductRecentlyViewed,
  selectRecentlyViewedItemById,
  selectRecentlyViewedItemsWithDates,
} from "@/store/selectors/recentlyViewedSelectors";
import {
  initializeItems,
  addProduct,
  removeProduct,
  clearAll,
  setLoading,
  setError,
  clearError,
  setInitialized,
} from "@/store/slices/recentlyViewedSlice";
import { VintStreetListing } from "@/api/types/product.types";
import { useEffect } from "react";
import { getSecureValue, setSecureValue, removeSecureValue } from "@/utils/storage";

// Interface for serialized product data (with string dates)
interface SerializedVintStreetListing extends Omit<VintStreetListing, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "recently_viewed_products";

export const useRecentlyViewed = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const items = useAppSelector(selectRecentlyViewedItemsWithDates);
  const loading = useAppSelector(selectRecentlyViewedLoading);
  const error = useAppSelector(selectRecentlyViewedError);
  const isInitialized = useAppSelector(selectRecentlyViewedInitialized);
  const itemCount = useAppSelector(selectRecentlyViewedCount);
  const isEmpty = useAppSelector(selectIsRecentlyViewedEmpty);
  const hasItems = useAppSelector(selectRecentlyViewedHasItems);

  // Initialize recently viewed items from storage on mount
  useEffect(() => {
    if (!isInitialized) {
      loadFromStorage();
    }
  }, [isInitialized]);

  // Save to storage whenever items change
  useEffect(() => {
    if (isInitialized && items.length > 0) {
      saveToStorage(items);
    }
  }, [items, isInitialized]);

  const loadFromStorage = async () => {
    try {
      dispatch(setLoading(true));
      const stored = await getSecureValue(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const products = parsed.map((item: any) => {
          const now = new Date();
          return {
            ...item,
            createdAt: item.createdAt ? 
              (item.createdAt instanceof Date ? item.createdAt : 
               typeof item.createdAt === 'string' ? new Date(item.createdAt) : now) : now,
            updatedAt: item.updatedAt ? 
              (item.updatedAt instanceof Date ? item.updatedAt : 
               typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : now) : now,
          };
        });
        dispatch(initializeItems(products));
      } else {
        dispatch(initializeItems([]));
      }
    } catch (error) {
      console.error("Error loading recently viewed products:", error);
      dispatch(setError("Failed to load recently viewed products"));
      dispatch(initializeItems([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const saveToStorage = async (products: VintStreetListing[]) => {
    try {
      // Convert Date objects to ISO strings for serialization
      const serializedProducts = products.map(product => {
        const now = new Date().toISOString();
        return {
          ...product,
          createdAt: product.createdAt ? 
            (product.createdAt instanceof Date ? product.createdAt.toISOString() : 
             typeof product.createdAt === 'string' ? product.createdAt : now) : now,
          updatedAt: product.updatedAt ? 
            (product.updatedAt instanceof Date ? product.updatedAt.toISOString() : 
             typeof product.updatedAt === 'string' ? product.updatedAt : now) : now,
        };
      });
      await setSecureValue(STORAGE_KEY, JSON.stringify(serializedProducts));
    } catch (error) {
      console.error("Error saving recently viewed products:", error);
      dispatch(setError("Failed to save recently viewed products"));
    }
  };

  // Actions
  const addProductToRecentlyViewed = async (product: VintStreetListing) => {
    try {
      dispatch(clearError());
      
      // Convert Date objects to ISO strings for Redux serialization
      const now = new Date().toISOString();
      const productWithSerializedDates: SerializedVintStreetListing = {
        ...product,
        createdAt: product.createdAt ? 
          (product.createdAt instanceof Date ? product.createdAt.toISOString() : 
           typeof product.createdAt === 'string' ? product.createdAt : now) : now,
        updatedAt: product.updatedAt ? 
          (product.updatedAt instanceof Date ? product.updatedAt.toISOString() : 
           typeof product.updatedAt === 'string' ? product.updatedAt : now) : now,
      };
      
      dispatch(addProduct(productWithSerializedDates as any));
    } catch (error) {
      console.error("Error adding product to recently viewed:", error);
      dispatch(setError("Failed to add product to recently viewed"));
    }
  };

  const removeProductFromRecentlyViewed = async (productId: number) => {
    try {
      dispatch(clearError());
      dispatch(removeProduct(productId));
    } catch (error) {
      console.error("Error removing product from recently viewed:", error);
      dispatch(setError("Failed to remove product from recently viewed"));
    }
  };

  const clearAllRecentlyViewed = async () => {
    try {
      dispatch(clearError());
      dispatch(clearAll());
      await removeSecureValue(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing recently viewed products:", error);
      dispatch(setError("Failed to clear recently viewed products"));
    }
  };

  const setRecentlyViewedError = (errorMessage: string | null) => {
    dispatch(setError(errorMessage));
  };

  const clearRecentlyViewedError = () => {
    dispatch(clearError());
  };

  // Utility functions
  const isProductRecentlyViewed = (productId: number) => {
    return useAppSelector(selectIsProductRecentlyViewed(productId));
  };

  const getRecentlyViewedItemById = (productId: number) => {
    return useAppSelector(selectRecentlyViewedItemById(productId));
  };

  return {
    // State
    items,
    loading,
    error,
    isInitialized,
    itemCount,
    isEmpty,
    hasItems,
    
    // Actions
    addProduct: addProductToRecentlyViewed,
    removeProduct: removeProductFromRecentlyViewed,
    clearAll: clearAllRecentlyViewed,
    setError: setRecentlyViewedError,
    clearError: clearRecentlyViewedError,
    
    // Utility functions
    isProductRecentlyViewed,
    getRecentlyViewedItemById,
  };
};
