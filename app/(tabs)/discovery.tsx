import CategoryWidget from '@/components/category-widget';
import FilterModal from '@/components/filter-modal';
import FilterSortBar from '@/components/filter-sort-bar';
import ProductCard from '@/components/product-card';
import SearchBar from '@/components/search-bar';
import { categoriesService, typesenseService } from '@/api/services';
import { Category } from '@/api/types/category.types';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function DiscoveryScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [searchText, setSearchText] = useState('');
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<'categories' | 'subcategories' | 'products'>(
    'categories'
  );
  const [filterCount, setFilterCount] = useState(0);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // New state for API data
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search functionality
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Filter and sort state
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [currentSortBy, setCurrentSortBy] = useState('Most Relevant');
  const [showSortModal, setShowSortModal] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Handle category parameter from navigation
  useEffect(() => {
    if (category && categories.length > 0) {
      const categoryName = decodeURIComponent(category as string);
      // Find the category in categories and navigate to it
      const foundCategory = categoriesService.findCategoryBySlug(
        categories,
        categoryName.toLowerCase().replace(/\s+/g, '-')
      );
      if (foundCategory) {
        handleCategoryPress(foundCategory);
      }
    }
  }, [category, categories]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedCategories = await categoriesService.getCategories();
      const sortedCategories = categoriesService.sortCategoriesByWeight(fetchedCategories);
      setCategories(sortedCategories);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProductsForCategory = async (category: Category, filters?: any, sortBy?: string) => {
    try {
      setIsLoadingProducts(true);
      setProductsError(null);
      
      // Build filter for the category
      let filterBy = `category_slugs:=${category.slug}`;
      
      // Add additional filters if provided
      if (filters && Object.keys(filters).length > 0) {
        const additionalFilters: string[] = [];
        
        // Brand filter
        if (filters.brand && filters.brand.length > 0) {
          const brandFilters = filters.brand.map((brand: string) => `brand:=${brand}`).join(' || ');
          additionalFilters.push(`(${brandFilters})`);
        }
        
        // Size filter
        if (filters.size && filters.size.length > 0) {
          const sizeFilters = filters.size.map((size: string) => `pa_size:=${size}`).join(' || ');
          additionalFilters.push(`(${sizeFilters})`);
        }
        
        // Price filter
        if (filters.price && filters.price.length > 0) {
          const priceFilters: string[] = [];
          filters.price.forEach((priceRange: string) => {
            switch (priceRange) {
              case 'under-50':
                priceFilters.push('price:<50');
                break;
              case '50-100':
                priceFilters.push('price:>=50 && price:<100');
                break;
              case '100-200':
                priceFilters.push('price:>=100 && price:<200');
                break;
              case 'over-200':
                priceFilters.push('price:>=200');
                break;
            }
          });
          if (priceFilters.length > 0) {
            additionalFilters.push(`(${priceFilters.join(' || ')})`);
          }
        }
        
        if (additionalFilters.length > 0) {
          filterBy = `(${filterBy}) && (${additionalFilters.join(' && ')})`;
        }
      }
      
      // Determine sort order
      let sortOrder = '';
      if (sortBy) {
        switch (sortBy) {
          case 'Price: Low to High':
            sortOrder = 'price:asc';
            break;
          case 'Price: High to Low':
            sortOrder = 'price:desc';
            break;
          case 'Newest First':
            sortOrder = 'created_at:desc';
            break;
          case 'Oldest First':
            sortOrder = 'created_at:asc';
            break;
          case 'Most Popular':
            sortOrder = 'favorites_count:desc';
            break;
          case 'Most Relevant':
          default:
            // No sort order for relevance
            break;
        }
      }
      
      const response = await typesenseService.search({
        query: '*',
        queryBy: 'name,description,short_description,brand,categories,category_slugs',
        filterBy: filterBy,
        sortBy: sortOrder,
        perPage: 20,
        page: 1,
      });

      // Convert Typesense results to product card format
      const products = response.hits.map((hit) => {
        const listing = typesenseService.convertToVintStreetListing(hit.document);

        // Use thumbnail URLs for better performance, fallback to full images
        const imageUrl =
          listing.thumbnailImageUrls.length > 0
            ? listing.thumbnailImageUrls[0]
            : listing.fullImageUrls.length > 0
            ? listing.fullImageUrls[0]
            : null;

        // Get first available size
        const size =
          listing.attributes.pa_size && listing.attributes.pa_size.length > 0
            ? listing.attributes.pa_size[0]
            : undefined;

        return {
          id: listing.id,
          name: listing.name,
          brand: listing.brand || 'No Brand',
          price: `£${listing.price.toFixed(2)}`,
          image: imageUrl ? { uri: imageUrl } : undefined,
          likes: listing.favoritesCount,
          size: size,
        };
      });

      setProducts(products);
      console.log(`Loaded ${products.length} products for category: ${category.name}`);
    } catch (err) {
      console.error('Error loading products for category:', err);
      setProductsError('Failed to load products for this category');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    setCategoryPath([category]);
    if (category.children.length > 0) {
      setCurrentView('subcategories');
    } else {
      setCurrentView('products');
      loadProductsForCategory(category, appliedFilters, currentSortBy);
    }
  };

  const handleSubcategoryPress = (subcategory: Category) => {
    setCategoryPath((prev) => [...prev, subcategory]);
    if (subcategory.children.length > 0) {
      setCurrentView('subcategories');
    } else {
      setCurrentView('products');
      loadProductsForCategory(subcategory, appliedFilters, currentSortBy);
    }
  };

  const handleBack = () => {
    if (showSearchResults) {
      setShowSearchResults(false);
      setSearchText('');
      setSearchResults([]);
      return;
    }

    if (categoryPath.length > 1) {
      setCategoryPath((prev) => prev.slice(0, -1));
      setCurrentView('subcategories');
    } else if (categoryPath.length === 1) {
      setCategoryPath([]);
      setCurrentView('categories');
    }
  };

  const handleViewAllProducts = () => {
    setCurrentView('products');
    if (categoryPath.length > 0) {
      loadProductsForCategory(categoryPath[categoryPath.length - 1], appliedFilters, currentSortBy);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setShowSearchResults(false);
      return;
    }

    try {
      setIsSearching(true);
      setShowSearchResults(true);

      const response = await typesenseService.search({
        query: searchText,
        queryBy: 'name,description,short_description,brand,categories,category_slugs',
        perPage: 20,
        page: 1,
      });

      // Convert Typesense results to product card format
      const products = response.hits.map((hit) => {
        const listing = typesenseService.convertToVintStreetListing(hit.document);

        // Use thumbnail URLs for better performance, fallback to full images
        const imageUrl =
          listing.thumbnailImageUrls.length > 0
            ? listing.thumbnailImageUrls[0]
            : listing.fullImageUrls.length > 0
            ? listing.fullImageUrls[0]
            : null;

        // Get first available size
        const size =
          listing.attributes.pa_size && listing.attributes.pa_size.length > 0
            ? listing.attributes.pa_size[0]
            : undefined;

        return {
          id: listing.id,
          name: listing.name,
          brand: listing.brand || 'No Brand',
          price: `£${listing.price.toFixed(2)}`,
          image: imageUrl ? { uri: imageUrl } : undefined,
          likes: listing.favoritesCount,
          size: size,
        };
      });

      setSearchResults(products);
      console.log(`Search for "${searchText}" returned ${products.length} results`);
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Search Error', 'Failed to search products. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleShoppingCartPress = () => {
    // Navigate to shopping cart
    console.log('Navigate to shopping cart');
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applied filters:', filters);
    setAppliedFilters(filters);
    
    // Update filter count based on applied filters
    const totalFilters = Object.values(filters).reduce(
      (total: number, options: any) => total + options.length,
      0
    );
    setFilterCount(totalFilters);
    
    // Reload products with new filters if we're in products view
    if (currentView === 'products' && categoryPath.length > 0) {
      loadProductsForCategory(categoryPath[categoryPath.length - 1], filters, currentSortBy);
    }
  };

  const handleSortPress = () => {
    setShowSortModal(true);
  };

  const handleSortChange = (sortOption: string) => {
    setCurrentSortBy(sortOption);
    setShowSortModal(false);
    
    // Reload products with new sort if we're in products view
    if (currentView === 'products' && categoryPath.length > 0) {
      loadProductsForCategory(categoryPath[categoryPath.length - 1], appliedFilters, sortOption);
    }
  };

  const handleProductPress = (productId: number) => {
    // Navigate to product detail
    router.push(`/product/${productId}` as any);
  };

  const getCurrentTitle = () => {
    if (showSearchResults) return `Search: "${searchText}"`;
    if (categoryPath.length === 0) return 'Discover';
    return categoryPath[categoryPath.length - 1].name;
  };

  const getCurrentCategories = () => {
    if (categoryPath.length === 0) {
      return categories;
    }
    return categoryPath[categoryPath.length - 1].children;
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
                setCurrentView('categories');
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
                    setCurrentView(index === 0 ? 'subcategories' : 'products');
                  }}
                >
                  <Text
                    style={[
                      styles.breadcrumbText,
                      index === categoryPath.length - 1 && styles.breadcrumbTextActive,
                    ]}
                  >
                    {category.name}
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
    // Show search results if searching
    if (showSearchResults) {
      return (
        <View style={styles.productsContainer}>
          <FilterSortBar
            filterCount={filterCount}
            sortBy={sortBy}
            onFilterPress={handleFilterPress}
            onSortPress={handleSortPress}
          />
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Searching products...</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
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
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No products found for "{searchText}"</Text>
                </View>
              }
            />
          )}
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    switch (currentView) {
      case 'categories':
        return (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Pressable
                style={[
                  styles.categoryItem,
                  index === categories.length - 1 && styles.categoryItemLast,
                ]}
                onPress={() => handleCategoryPress(item)}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
                {item.children.length > 0 && (
                  <Feather
                    name="chevron-right"
                    size={20}
                    color="#666"
                    style={styles.categoryChevron}
                  />
                )}
              </Pressable>
            )}
            style={styles.list}
          />
        );

      case 'subcategories':
        return (
          <FlatList
            data={getCurrentCategories()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Pressable
                style={[
                  styles.categoryItem,
                  index === getCurrentCategories().length - 1 && styles.categoryItemLast,
                ]}
                onPress={() => handleSubcategoryPress(item)}
              >
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryText}>{item.name}</Text>
                </View>
                {item.children.length > 0 && (
                  <Feather
                    name="chevron-right"
                    size={20}
                    color="#666"
                    style={styles.categoryChevron}
                  />
                )}
              </Pressable>
            )}
            style={styles.list}
          />
        );

      case 'products':
        return (
          <View style={styles.productsContainer}>
            <FilterSortBar
              filterCount={filterCount}
              sortBy={currentSortBy}
              onFilterPress={handleFilterPress}
              onSortPress={handleSortPress}
            />
            {isLoadingProducts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : productsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{productsError}</Text>
                <Pressable style={styles.retryButton} onPress={() => {
                  if (categoryPath.length > 0) {
                    loadProductsForCategory(categoryPath[categoryPath.length - 1]);
                  }
                }}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={products}
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
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products found in this category</Text>
                  </View>
                }
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <SearchBar 
        value={searchText}
        onChangeText={setSearchText}
        onSearch={handleSearch}
        placeholder="Search products..."
      />

      {/* Header */}
      <View style={styles.header}>
        {(categoryPath.length > 0 || showSearchResults) && (
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
        )}
        <Text style={styles.title}>{getCurrentTitle()}</Text>
      </View>

      {/* All Categories Label */}
      {!showSearchResults && categoryPath.length === 0 && (
        <View style={styles.allCategoriesContainer}>
          <Text style={styles.allCategoriesText}>All Categories</Text>
        </View>
      )}

      {/* Breadcrumbs */}
      {!showSearchResults && renderBreadcrumbs()}

      {/* Content */}
      {renderContent()}

      {/* Bottom Button for Categories */}
      {currentView === 'subcategories' && (
        <View style={styles.bottomButtonContainer}>
          <Pressable style={styles.bottomButton} onPress={handleViewAllProducts}>
            <Text style={styles.bottomButtonText}>View all products in this category</Text>
          </Pressable>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Sort Dropdown */}
      {showSortModal && (
        <>
          <Pressable 
            style={styles.sortDropdownOverlay} 
            onPress={() => setShowSortModal(false)} 
          />
          <View style={styles.sortDropdown}>
            {[
              'Most Relevant',
              'Price: Low to High',
              'Price: High to Low',
              'Newest First',
              'Oldest First',
              'Most Popular',
            ].map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.sortDropdownOption,
                  currentSortBy === option && styles.sortDropdownOptionSelected,
                ]}
                onPress={() => handleSortChange(option)}
              >
                <Text
                  style={[
                    styles.sortDropdownOptionText,
                    currentSortBy === option && styles.sortDropdownOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {currentSortBy === option && (
                  <Feather name="check" size={16} color="#000" />
                )}
              </Pressable>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    flex: 1,
    fontWeight: 'bold',
  },
  allCategoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  allCategoriesText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  breadcrumbsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  breadcrumbText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontWeight: 'bold',
  },
  breadcrumbTextActive: {
    color: '#666',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    backgroundColor: '#fff',
  },
  categoryItemLast: {
    borderBottomWidth: 0,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    fontWeight: 'normal',
  },
  categoryChevron: {
    marginLeft: 8,
  },
  productsContainer: {
    flex: 1,
  },
  productsGrid: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bottomButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomButton: {
    backgroundColor: '#000',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  sortDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  sortDropdown: {
    position: 'absolute',
    top: 50, // Position directly below the FilterSortBar
    right: 20, // Align with the right edge of the sort button
    width: 200, // Fixed width for the dropdown
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  sortDropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortDropdownOptionSelected: {
    backgroundColor: '#f8f9fa',
  },
  sortDropdownOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    flex: 1,
  },
  sortDropdownOptionTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
});
