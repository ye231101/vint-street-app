import { configureStore } from "@reduxjs/toolkit";
import recentlyViewedReducer, { addProduct } from "../slices/recentlyViewedSlice";
import { VintStreetListing } from "@/api/types/product.types";

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      recentlyViewed: recentlyViewedReducer,
    },
  });
};

// Mock product data with various date formats
const mockProductWithDateObjects: VintStreetListing = {
  id: 1,
  name: "Test Product 1",
  price: 29.99,
  brand: "Test Brand",
  thumbnailImageUrls: ["test-image1.jpg"],
  fullImageUrls: ["test-image1-full.jpg"],
  favoritesCount: 5,
  averageRating: 4.5,
  reviewCount: 10,
  condition: "Good",
  colour: "Blue",
  gender: "Unisex",
  stockQuantity: 5,
  onSale: false,
  vendorId: 1,
  vendorShopName: "Test Vendor",
  attributes: {
    pa_size: ["M", "L"],
  },
  category: "Clothing",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
};

const mockProductWithStringDates: VintStreetListing = {
  id: 2,
  name: "Test Product 2",
  price: 49.99,
  brand: "Test Brand 2",
  thumbnailImageUrls: ["test-image2.jpg"],
  fullImageUrls: ["test-image2-full.jpg"],
  favoritesCount: 3,
  averageRating: 4.0,
  reviewCount: 8,
  condition: "Excellent",
  colour: "Red",
  gender: "Men",
  stockQuantity: 3,
  onSale: true,
  vendorId: 2,
  vendorShopName: "Test Vendor 2",
  attributes: {
    pa_size: ["S", "M"],
  },
  category: "Shoes",
  createdAt: "2023-01-02T00:00:00.000Z" as any,
  updatedAt: "2023-01-02T00:00:00.000Z" as any,
};

const mockProductWithUndefinedDates: VintStreetListing = {
  id: 3,
  name: "Test Product 3",
  price: 39.99,
  brand: "Test Brand 3",
  thumbnailImageUrls: ["test-image3.jpg"],
  fullImageUrls: ["test-image3-full.jpg"],
  favoritesCount: 2,
  averageRating: 3.5,
  reviewCount: 5,
  condition: "Good",
  colour: "Green",
  gender: "Women",
  stockQuantity: 2,
  onSale: false,
  vendorId: 3,
  vendorShopName: "Test Vendor 3",
  attributes: {
    pa_size: ["S", "M"],
  },
  category: "Accessories",
  createdAt: undefined as any,
  updatedAt: undefined as any,
};

describe("Recently Viewed Date Handling", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it("should handle products with Date objects", () => {
    store.dispatch(addProduct(mockProductWithDateObjects));
    const state = store.getState().recentlyViewed;

    expect(state.items).toHaveLength(1);
    expect(state.items[0].createdAt).toBeInstanceOf(Date);
    expect(state.items[0].updatedAt).toBeInstanceOf(Date);
    expect(state.error).toBeNull();
  });

  it("should handle products with string dates", () => {
    store.dispatch(addProduct(mockProductWithStringDates));
    const state = store.getState().recentlyViewed;

    expect(state.items).toHaveLength(1);
    expect(state.items[0].createdAt).toBeInstanceOf(Date);
    expect(state.items[0].updatedAt).toBeInstanceOf(Date);
    expect(state.error).toBeNull();
  });

  it("should handle products with undefined dates", () => {
    store.dispatch(addProduct(mockProductWithUndefinedDates));
    const state = store.getState().recentlyViewed;

    expect(state.items).toHaveLength(1);
    expect(state.items[0].createdAt).toBeInstanceOf(Date);
    expect(state.items[0].updatedAt).toBeInstanceOf(Date);
    expect(state.error).toBeNull();
  });

  it("should handle mixed date formats in multiple products", () => {
    store.dispatch(addProduct(mockProductWithDateObjects));
    store.dispatch(addProduct(mockProductWithStringDates));
    store.dispatch(addProduct(mockProductWithUndefinedDates));
    
    const state = store.getState().recentlyViewed;

    expect(state.items).toHaveLength(3);
    state.items.forEach(item => {
      expect(item.createdAt).toBeInstanceOf(Date);
      expect(item.updatedAt).toBeInstanceOf(Date);
    });
    expect(state.error).toBeNull();
  });

  it("should not throw errors when processing various date formats", () => {
    expect(() => {
      store.dispatch(addProduct(mockProductWithDateObjects));
      store.dispatch(addProduct(mockProductWithStringDates));
      store.dispatch(addProduct(mockProductWithUndefinedDates));
    }).not.toThrow();
  });
});
