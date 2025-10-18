import { VintStreetListing } from '@/api/types/product.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RecentlyViewedState {
  items: VintStreetListing[];
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

const MAX_ITEMS = 50; // Maximum number of items to store

const initialState: RecentlyViewedState = {
  items: [],
  isInitialized: false,
  loading: false,
  error: null,
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    // Initialize recently viewed items (called when loading from storage)
    initializeItems: (state, action: PayloadAction<VintStreetListing[]>) => {
      // Store items as-is (with string dates for serialization)
      state.items = action.payload;
      state.isInitialized = true;
      state.loading = false;
      state.error = null;
    },

    // Add product to recently viewed
    addProduct: (state, action: PayloadAction<VintStreetListing>) => {
      const product = action.payload;

      // Remove the product if it already exists (to move it to the front)
      const filtered = state.items.filter((item) => item.id !== product.id);

      // Add the new product at the beginning
      const newItems = [product, ...filtered];

      // Limit to MAX_ITEMS
      state.items = newItems.slice(0, MAX_ITEMS);
      state.error = null;
    },

    // Remove product from recently viewed
    removeProduct: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.error = null;
    },

    // Clear all recently viewed items
    clearAll: (state) => {
      state.items = [];
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set initialization state
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const {
  initializeItems,
  addProduct,
  removeProduct,
  clearAll,
  setLoading,
  setError,
  clearError,
  setInitialized,
} = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
