import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BasketItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  vendorId: number;
  vendorName: string;
  lineTotal: number;
  protectionFee: number;
  protectionFeePercentage: number;
}

export interface Vendor {
  id: number;
  name: string;
  itemCount: number;
}

export interface Basket {
  items: BasketItem[];
  vendors: { [key: number]: Vendor };
  vendorIds: number[];
  vendorItems: { [key: number]: BasketItem[] };
  subtotal: number;
  formattedSubtotal: string;
  totalProtectionFee: number;
  formattedTotalProtectionFee: string;
  total: number;
  formattedTotal: string;
}

interface BasketState {
  basket: Basket;
  isLoading: boolean;
  error: string | null;
}

const initialState: BasketState = {
  basket: {
    items: [],
    vendors: {},
    vendorIds: [],
    vendorItems: {},
    subtotal: 0,
    formattedSubtotal: "£0.00",
    totalProtectionFee: 0,
    formattedTotalProtectionFee: "£0.00",
    total: 0,
    formattedTotal: "£0.00",
  },
  isLoading: false,
  error: null,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToBasket: (state, action: PayloadAction<Omit<BasketItem, "id" | "lineTotal" | "protectionFee">>) => {
      const itemData = action.payload;
      const existingItemIndex = state.basket.items.findIndex(
        (item) => item.productId === itemData.productId && item.vendorId === itemData.vendorId
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const existingItem = state.basket.items[existingItemIndex];
        const newQuantity = existingItem.quantity + itemData.quantity;
        const newLineTotal = newQuantity * itemData.price;
        const newProtectionFee = newLineTotal * itemData.protectionFeePercentage;

        state.basket.items[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          lineTotal: newLineTotal,
          protectionFee: newProtectionFee,
        };
      } else {
        // Add new item
        const newItem: BasketItem = {
          id: `${itemData.productId}-${itemData.vendorId}-${Date.now()}`,
          productId: itemData.productId,
          name: itemData.name,
          price: itemData.price,
          quantity: itemData.quantity,
          image: itemData.image,
          vendorId: itemData.vendorId,
          vendorName: itemData.vendorName,
          lineTotal: itemData.quantity * itemData.price,
          protectionFee: (itemData.quantity * itemData.price) * itemData.protectionFeePercentage,
          protectionFeePercentage: itemData.protectionFeePercentage,
        };

        state.basket.items.push(newItem);
      }

      // Recalculate basket data
      basketSlice.caseReducers.updateBasketData(state);
    },
    removeFromBasket: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.basket.items = state.basket.items.filter((item) => item.id !== itemId);
      basketSlice.caseReducers.updateBasketData(state);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.basket.items.findIndex((item) => item.id === itemId);

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.basket.items.splice(itemIndex, 1);
        } else {
          // Update quantity and recalculate totals
          const item = state.basket.items[itemIndex];
          item.quantity = quantity;
          item.lineTotal = quantity * item.price;
          item.protectionFee = item.lineTotal * item.protectionFeePercentage;
        }
        basketSlice.caseReducers.updateBasketData(state);
      }
    },
    clearBasket: (state) => {
      state.basket = {
        items: [],
        vendors: {},
        vendorIds: [],
        vendorItems: {},
        subtotal: 0,
        formattedSubtotal: "£0.00",
        totalProtectionFee: 0,
        formattedTotalProtectionFee: "£0.00",
        total: 0,
        formattedTotal: "£0.00",
      };
    },
    updateBasketData: (state) => {
      const items = state.basket.items;
      
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const totalProtectionFee = items.reduce((sum, item) => sum + item.protectionFee, 0);
      const total = subtotal + totalProtectionFee;

      // Update vendor data
      const vendors: { [key: number]: Vendor } = {};
      const vendorItems: { [key: number]: BasketItem[] } = {};
      const vendorIds: number[] = [];

      items.forEach((item) => {
        if (!vendors[item.vendorId]) {
          vendors[item.vendorId] = {
            id: item.vendorId,
            name: item.vendorName,
            itemCount: 0,
          };
          vendorItems[item.vendorId] = [];
          vendorIds.push(item.vendorId);
        }
        vendors[item.vendorId].itemCount += item.quantity;
        vendorItems[item.vendorId].push(item);
      });

      // Update basket state
      state.basket.subtotal = subtotal;
      state.basket.formattedSubtotal = `£${subtotal.toFixed(2)}`;
      state.basket.totalProtectionFee = totalProtectionFee;
      state.basket.formattedTotalProtectionFee = `£${totalProtectionFee.toFixed(2)}`;
      state.basket.total = total;
      state.basket.formattedTotal = `£${total.toFixed(2)}`;
      state.basket.vendors = vendors;
      state.basket.vendorItems = vendorItems;
      state.basket.vendorIds = vendorIds;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addToBasket,
  removeFromBasket,
  updateQuantity,
  clearBasket,
} = basketSlice.actions;

export default basketSlice.reducer;
