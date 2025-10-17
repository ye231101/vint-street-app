import React, { createContext, ReactNode, useContext, useState } from "react";
import { Alert } from "react-native";

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

interface BasketContextType {
  basket: Basket;
  isLoading: boolean;
  error: string | null;
  addToBasket: (item: Omit<BasketItem, 'id' | 'lineTotal' | 'protectionFee'>) => void;
  removeFromBasket: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearBasket: () => void;
  getVendorTotals: (vendorId: number) => { subtotal: number; protectionFee: number; total: number };
  getVendorShopName: (vendorId: number) => string;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};

interface BasketProviderProps {
  children: ReactNode;
}

export const BasketProvider: React.FC<BasketProviderProps> = ({ children }) => {
  const [basket, setBasket] = useState<Basket>({
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
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotals = (items: BasketItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalProtectionFee = items.reduce((sum, item) => sum + item.protectionFee, 0);
    const total = subtotal + totalProtectionFee;
    
    return {
      subtotal,
      totalProtectionFee,
      total,
      formattedSubtotal: `£${subtotal.toFixed(2)}`,
      formattedTotalProtectionFee: `£${totalProtectionFee.toFixed(2)}`,
      formattedTotal: `£${total.toFixed(2)}`,
    };
  };

  const updateVendorData = (items: BasketItem[]) => {
    const vendors: { [key: number]: Vendor } = {};
    const vendorItems: { [key: number]: BasketItem[] } = {};
    const vendorIds: number[] = [];

    items.forEach(item => {
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

    return { vendors, vendorItems, vendorIds };
  };

  const addToBasket = (itemData: Omit<BasketItem, 'id' | 'lineTotal' | 'protectionFee'>) => {
    try {
      setError(null);
      
      // Check if item already exists in basket
      const existingItemIndex = basket.items.findIndex(
        item => item.productId === itemData.productId && item.vendorId === itemData.vendorId
      );

      let updatedItems: BasketItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...basket.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + itemData.quantity;
        const newLineTotal = itemData.price * newQuantity;
        const newProtectionFee = newLineTotal * itemData.protectionFeePercentage;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          lineTotal: newLineTotal,
          protectionFee: newProtectionFee,
        };
      } else {
        // Add new item
        const newItem: BasketItem = {
          ...itemData,
          id: `${itemData.productId}_${itemData.vendorId}_${Date.now()}`,
          lineTotal: itemData.price * itemData.quantity,
          protectionFee: (itemData.price * itemData.quantity) * itemData.protectionFeePercentage,
        };
        updatedItems = [...basket.items, newItem];
      }

      const totals = calculateTotals(updatedItems);
      const { vendors, vendorItems, vendorIds } = updateVendorData(updatedItems);

      setBasket({
        items: updatedItems,
        vendors,
        vendorItems,
        vendorIds,
        ...totals,
      });

      Alert.alert("Success", "Item added to basket!");
    } catch (err) {
      setError("Failed to add item to basket");
      Alert.alert("Error", "Failed to add item to basket");
    }
  };

  const removeFromBasket = (itemId: string) => {
    try {
      setError(null);
      
      const updatedItems = basket.items.filter(item => item.id !== itemId);
      const totals = calculateTotals(updatedItems);
      const { vendors, vendorItems, vendorIds } = updateVendorData(updatedItems);

      setBasket({
        items: updatedItems,
        vendors,
        vendorItems,
        vendorIds,
        ...totals,
      });
    } catch (err) {
      setError("Failed to remove item from basket");
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      setError(null);
      
      if (quantity <= 0) {
        removeFromBasket(itemId);
        return;
      }

      const updatedItems = basket.items.map(item => {
        if (item.id === itemId) {
          const newLineTotal = item.price * quantity;
          const newProtectionFee = newLineTotal * item.protectionFeePercentage;
          return {
            ...item,
            quantity,
            lineTotal: newLineTotal,
            protectionFee: newProtectionFee,
          };
        }
        return item;
      });

      const totals = calculateTotals(updatedItems);
      const { vendors, vendorItems, vendorIds } = updateVendorData(updatedItems);

      setBasket({
        items: updatedItems,
        vendors,
        vendorItems,
        vendorIds,
        ...totals,
      });
    } catch (err) {
      setError("Failed to update item quantity");
    }
  };

  const clearBasket = () => {
    setBasket({
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
    });
  };

  const getVendorTotals = (vendorId: number) => {
    const vendorItems = basket.items.filter(item => item.vendorId === vendorId);
    const subtotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const protectionFee = vendorItems.reduce((sum, item) => sum + item.protectionFee, 0);
    const total = subtotal + protectionFee;
    
    return { subtotal, protectionFee, total };
  };

  const getVendorShopName = (vendorId: number) => {
    return basket.vendors[vendorId]?.name || `Vendor ${vendorId}`;
  };

  const value: BasketContextType = {
    basket,
    isLoading,
    error,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    getVendorTotals,
    getVendorShopName,
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
};
