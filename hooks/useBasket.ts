import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectBasket,
  selectBasketLoading,
  selectBasketError,
  selectBasketItemCount,
  selectBasketTotal,
  selectBasketFormattedTotal,
  selectIsBasketEmpty,
  selectBasketItemByProductId,
  selectBasketItemCountByProduct,
} from "@/store/selectors/basketSelectors";
import {
  addToBasket,
  removeFromBasket,
  updateQuantity,
  clearBasket,
  setError,
  clearError,
} from "@/store/slices/basketSlice";
import { BasketItem } from "@/store/slices/basketSlice";

export const useBasket = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const basket = useAppSelector(selectBasket);
  const isLoading = useAppSelector(selectBasketLoading);
  const error = useAppSelector(selectBasketError);
  const itemCount = useAppSelector(selectBasketItemCount);
  const total = useAppSelector(selectBasketTotal);
  const formattedTotal = useAppSelector(selectBasketFormattedTotal);
  const isEmpty = useAppSelector(selectIsBasketEmpty);

  // Actions
  const addItem = (itemData: Omit<BasketItem, "id" | "lineTotal" | "protectionFee">) => {
    dispatch(addToBasket(itemData));
  };

  const removeItem = (itemId: string) => {
    dispatch(removeFromBasket(itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  const clearAll = () => {
    dispatch(clearBasket());
  };

  const setBasketError = (errorMessage: string | null) => {
    dispatch(setError(errorMessage));
  };

  const clearBasketError = () => {
    dispatch(clearError());
  };

  // Utility functions
  const getItemByProductId = (productId: number, vendorId: number) => {
    return useAppSelector(selectBasketItemByProductId(productId, vendorId));
  };

  const getItemCountByProduct = (productId: number, vendorId: number) => {
    return useAppSelector(selectBasketItemCountByProduct(productId, vendorId));
  };

  return {
    // State
    basket,
    isLoading,
    error,
    itemCount,
    total,
    formattedTotal,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateItemQuantity,
    clearAll,
    setBasketError,
    clearBasketError,
    
    // Utility functions
    getItemByProductId,
    getItemCountByProduct,
  };
};
