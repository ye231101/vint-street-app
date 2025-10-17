import CategoryWidget from "@/components/category-widget";
import FilterModal from "@/components/filter-modal";
import FilterSortBar from "@/components/filter-sort-bar";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for categories
const mockCategories = [
  { id: 1, name: "Men's", hasChildren: true },
  { id: 2, name: "Women's", hasChildren: true },
  { id: 3, name: "Junior's", hasChildren: true },
  { id: 4, name: "Footwear", hasChildren: true },
  { id: 5, name: "Games", hasChildren: true },
  { id: 6, name: "Consoles", hasChildren: true },
  { id: 7, name: "Music", hasChildren: true },
  { id: 8, name: "Trading Cards", hasChildren: true },
  { id: 9, name: "Collectibles", hasChildren: true },
  { id: 10, name: "Uncategorised", hasChildren: false },
];

// Mock data for subcategories (when in a category)
const mockSubcategories = [
  { id: 1, name: "Accessories", hasChildren: false },
  { id: 2, name: "Clothing", hasChildren: false },
];

// Mock data for products (when viewing products)
const mockProducts = [
  {
    id: 1,
    name: "Kickers Coat; Navy, Cream & Red...",
    brand: "Kickers",
    price: "£76.00",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
    size: "L",
  },
  {
    id: 2,
    name: "Chaps By Ralph Lauren Pullover,...",
    brand: "Ralph Lauren",
    price: "£60.00",
    image: require("@/assets/images/homepage_slider/1.jpg"),
    likes: 0,
    size: "M",
  },
  {
    id: 3,
    name: "D&G 2003 Bomber Jacket, Black -...",
    brand: "D&G",
    price: "£999.00",
    image: require("@/assets/images/homepage_slider/2.jpg"),
    likes: 0,
    size: "XXL",
  },
  {
    id: 4,
    name: "Tommy Hilfiger Jacket, Navy - L",
    brand: "Tommy Hilfiger",
    price: "£200.00",
    image: require("@/assets/images/homepage_slider/3.jpg"),
    likes: 0,
    size: "L",
  },
];

export default function DiscoveryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<
    "categories" | "subcategories" | "products"
  >("categories");
  const [filterCount, setFilterCount] = useState(0);
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Handle category parameter from navigation
  useEffect(() => {
    if (category) {
      const categoryName = decodeURIComponent(category as string);
      // Find the category in mockCategories and navigate to it
      const foundCategory = mockCategories.find(
        (cat) => cat.name === categoryName
      );
      if (foundCategory) {
        handleCategoryPress(categoryName);
      }
    }
  }, [category]);

  const handleCategoryPress = (categoryName: string) => {
    if (categoryName === "Men's") {
      setCategoryPath([categoryName]);
      setCurrentView("subcategories");
    } else {
      // Navigate to products view
      setCategoryPath([categoryName]);
      setCurrentView("products");
    }
  };

  const handleSubcategoryPress = (subcategoryName: string) => {
    setCategoryPath((prev) => [...prev, subcategoryName]);
    setCurrentView("products");
  };

  const handleBack = () => {
    if (categoryPath.length > 1) {
      setCategoryPath((prev) => prev.slice(0, -1));
      setCurrentView("subcategories");
    } else if (categoryPath.length === 1) {
      setCategoryPath([]);
      setCurrentView("categories");
    }
  };

  const handleViewAllProducts = () => {
    setCurrentView("products");
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchText);
  };

  const handleShoppingCartPress = () => {
    // Navigate to shopping cart
    console.log("Navigate to shopping cart");
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
    // Update filter count based on applied filters
    const totalFilters = Object.values(filters).reduce(
      (total: number, options: any) => total + options.length,
      0
    );
    setFilterCount(totalFilters);
  };

  const handleSortPress = () => {
    // Show sort options
    console.log("Show sort options");
  };

  const handleProductPress = (productId: number) => {
    // Navigate to product detail
    console.log("Navigate to product:", productId);
  };

  const getCurrentTitle = () => {
    if (categoryPath.length === 0) return "Discover";
    return categoryPath[categoryPath.length - 1];
  };

  const renderBreadcrumbs = () => {
    if (categoryPath.length === 0) return null;

    return (
      <View style={styles.breadcrumbsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.breadcrumbs}>
            <Pressable
              onPress={() => {
                setCategoryPath([]);
                setCurrentView("categories");
              }}
            >
              <Text style={styles.breadcrumbText}>All Categories</Text>
            </Pressable>
            {categoryPath.map((category, index) => (
              <View key={index} style={styles.breadcrumbItem}>
                <Feather name="chevron-right" size={16} color="#666" />
                <Pressable
                  onPress={() => {
                    if (index === categoryPath.length - 1) return;
                    setCategoryPath((prev) => prev.slice(0, index + 1));
                    setCurrentView(index === 0 ? "subcategories" : "products");
                  }}
                >
                  <Text
                    style={[
                      styles.breadcrumbText,
                      index === categoryPath.length - 1 &&
                        styles.breadcrumbTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "categories":
        return (
          <FlatList
            data={mockCategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryWidget
                title={item.name}
                hasChildren={item.hasChildren}
                onPress={() => handleCategoryPress(item.name)}
              />
            )}
            style={styles.list}
          />
        );

      case "subcategories":
        return (
          <FlatList
            data={mockSubcategories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <CategoryWidget
                title={item.name}
                hasChildren={item.hasChildren}
                onPress={() => handleSubcategoryPress(item.name)}
              />
            )}
            style={styles.list}
          />
        );

      case "products":
        return (
          <View style={styles.productsContainer}>
            <FilterSortBar
              filterCount={filterCount}
              sortBy={sortBy}
              onFilterPress={handleFilterPress}
              onSortPress={handleSortPress}
            />
            <FlatList
              data={mockProducts}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  onPress={() => handleProductPress(item.id)}
                  width={180}
                  height={240}
                />
              )}
              contentContainerStyle={styles.productsGrid}
              columnWrapperStyle={styles.productRow}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <SearchBar />

      {/* Header */}
      <View style={styles.header}>
        {categoryPath.length > 0 && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
        )}
        <Text style={styles.title}>{getCurrentTitle()}</Text>
      </View>

      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* Content */}
      {renderContent()}

      {/* Bottom Button for Categories */}
      {currentView === "subcategories" && (
        <View style={styles.bottomButtonContainer}>
          <Pressable
            style={styles.bottomButton}
            onPress={handleViewAllProducts}
          >
            <Text style={styles.bottomButtonText}>
              View all products in this category
            </Text>
          </Pressable>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#000",
    flex: 1,
  },
  breadcrumbsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  breadcrumbs: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  breadcrumbText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#000",
    fontWeight: "bold",
  },
  breadcrumbTextActive: {
    color: "#666",
  },
  list: {
    flex: 1,
  },
  productsContainer: {
    flex: 1,
  },
  productsGrid: {
    padding: 16,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  bottomButtonContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  bottomButton: {
    backgroundColor: "#000",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});
