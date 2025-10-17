import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BasketItem } from "@/store/slices/basketSlice";
import {
  addToBasket as addToBasketAction,
  removeFromBasket as removeFromBasketAction,
  updateQuantity as updateQuantityAction,
  clearBasket as clearBasketAction,
  setLoading,
  setError,
  clearError,
} from "@/store/slices/basketSlice";

export const useBasket = () => {
  const dispatch = useAppDispatch();
  const basketState = useAppSelector((state) => state.basket);

  const addToBasket = (
    itemData: Omit<BasketItem, "id" | "lineTotal" | "protectionFee">
  ) => {
    dispatch(addToBasketAction(itemData));
  };

  const removeFromBasket = (itemId: string) => {
    dispatch(removeFromBasketAction(itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateQuantityAction({ itemId, quantity }));
  };

  const clearBasket = () => {
    dispatch(clearBasketAction());
  };

  const getVendorTotals = (vendorId: number) => {
    const vendorItems = basketState.basket.items.filter(
      (item) => item.vendorId === vendorId
    );
    const subtotal = vendorItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const protectionFee = vendorItems.reduce(
      (sum, item) => sum + item.protectionFee,
      0
    );
    const total = subtotal + protectionFee;

    return { subtotal, protectionFee, total };
  };

  const getVendorShopName = (vendorId: number) => {
    return basketState.basket.vendors[vendorId]?.name || `Vendor ${vendorId}`;
  };

  return {
    basket: basketState.basket,
    isLoading: basketState.isLoading,
    error: basketState.error,
    addToBasket,
    removeFromBasket,
    updateQuantity,
    clearBasket,
    getVendorTotals,
    getVendorShopName,
  };
};
