import ArticleCarousel from "@/components/article-carousel";
import PopularProductsCarousel from "@/components/popular-products-carousel";
import ProductCard, { Product } from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { typesenseService } from "@/api/services";
import { VintStreetListing } from "@/api/types/product.types";

const { width: screenWidth } = Dimensions.get("window");

// Mock data for products
const trendingProducts = [
  {
    id: 1,
    name: "Lee Jeans Green - 14",
    brand: "Lee Jeans",
    price: "£27.00",
    images: [
      require("@/assets/images/hero-banner.jpg"),
      require("@/assets/images/homepage_slider/1.jpg"),
      require("@/assets/images/homepage_slider/2.jpg"),
    ],
    likes: 0,
  },
  {
    id: 2,
    name: "Armani Jeans, Straight Leg Jeans",
    brand: "Armani Jeans",
    price: "£1,125.00",
    images: [
      require("@/assets/images/hero-banner.jpg"),
      require("@/assets/images/homepage_slider/4.jpg"),
      require("@/assets/images/homepage_slider/5.jpg"),
    ],
    likes: 0,
  },
  {
    id: 3,
    name: "Victoria Beckham Skinny Jeans",
    brand: "Victoria Beckham",
    price: "£1,125.00",
    images: [
      require("@/assets/images/hero-banner.jpg"),
      require("@/assets/images/homepage_slider/3.jpg"),
      require("@/assets/images/homepage_slider/6.jpg"),
    ],
    likes: 0,
  },
];

const recentlyAddedProducts = [
  {
    id: 3,
    name: "Nike Cropped Crew Neck Jumpe...",
    brand: "Nike",
    price: "£30.00",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 1,
  },
  {
    id: 4,
    name: "Tomy Hilfiger Crew Neck Jume",
    brand: "Tommy Hilfiger",
    price: "£31.00",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
  },
];

const indieItems = [
  {
    id: 5,
    name: "Love Moschino Long-Sleeve Shirt...",
    brand: "Love Moschino",
    size: "XS",
    price: "£75.00",
    protectionFee: "£5.40",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
  },
  {
    id: 6,
    name: "Grandpa's Great Escape and Fin..",
    brand: "No Brand",
    price: "£2.00",
    protectionFee: "£0.14",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
  },
];

const recentlyViewedProducts: Product[] = [
  {
    id: 7,
    name: "Love Moschino Long-Sleeve Shirt...",
    brand: "Love Moschino",
    price: "£75.00",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
    size: "XS",
    protectionFee: "£5.40",
  },
];

const brands = [
  {
    name: "Levi's",
    image:
      "https://www.citypng.com/public/uploads/preview/levis-black-logo-hd-png-70175169470713089bqxrjlb3.png",
  },
  {
    name: "Adidas",
    image:
      "https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo-1991.jpg",
  },
  {
    name: "H&M",
    image: "https://1000logos.net/wp-content/uploads/2017/02/H-Logo-1999.png",
  },
  {
    name: "Nike",
    image:
      "https://static.vecteezy.com/system/resources/previews/010/994/412/original/nike-logo-black-with-name-clothes-design-icon-abstract-football-illustration-with-white-background-free-vector.jpg",
  },
  {
    name: "Zara",
    image:
      "https://1000logos.net/wp-content/uploads/2017/05/Zara-Logo-2008.png",
  },
  {
    name: "Gucci",
    image:
      "https://1000logos.net/wp-content/uploads/2017/03/Gucci-Logo-2015.png",
  },
];

const topCategories = [
  {
    title: "Caps",
    image: require("@/assets/images/cat_caps.png"),
  },
  {
    title: "Denim",
    image: require("@/assets/images/cat_denim.png"),
  },
  {
    title: "Vinyl",
    image: require("@/assets/images/cat_vinyl.png"),
  },
  {
    title: "Football Shirts",
    image: require("@/assets/images/cat_football_shirts.png"),
  },
  {
    title: "Gaming",
    image: require("@/assets/images/cat_gaming.png"),
  },
  {
    title: "Levi's",
    image: require("@/assets/images/cat_levis.png"),
  },
  {
    title: "Nike",
    image: require("@/assets/images/cat_nike.png"),
  },
  {
    title: "Tees",
    image: require("@/assets/images/cat_tees.png"),
  },
  {
    title: "Y2K",
    image: require("@/assets/images/cat_y2k.png"),
  },
];

const eras = [
  {
    name: "70s",
    decade: "1970s",
    color: "#E91E63",
    image: require("@/assets/images/70s.jpg"),
  },
  {
    name: "80s",
    decade: "1980s",
    color: "#9C27B0",
    image: require("@/assets/images/80s.jpg"),
  },
  {
    name: "90s",
    decade: "1990s",
    color: "#2196F3",
    image: require("@/assets/images/90s.jpg"),
  },
  {
    name: "00s",
    decade: "2000s",
    color: "#4CAF50",
    image: require("@/assets/images/00s.jpg"),
  },
];

interface Brand {
  name: string;
  image: any;
}

const BrandCard = ({ brand }: { brand: Brand }) => (
  <View
    style={{
      width: screenWidth / 3,
      height: (screenWidth / 3) * (3 / 4),
      backgroundColor: "#fff",
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      source={{ uri: brand.image }}
      style={{
        width: "80%",
        height: "60%",
        resizeMode: "contain",
      }}
    />
    <Text
      style={{
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        marginTop: 8,
      }}
    >
      {brand.name}
    </Text>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [trendingProductsData, setTrendingProductsData] = useState<any[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // Fetch trending products on mount
  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setIsLoadingTrending(true);
      const response = await typesenseService.getPopularProducts(30);
      
      // Convert Typesense results to carousel format
      const products = response.hits.map((hit) => {
        const listing = typesenseService.convertToVintStreetListing(hit.document);
        
        // Use thumbnail URLs for better performance, fallback to full images
        const imageUrls = listing.thumbnailImageUrls.length > 0 
          ? listing.thumbnailImageUrls 
          : listing.fullImageUrls;
        
        return {
          id: listing.id,
          name: listing.name,
          brand: listing.brand || 'No Brand',
          price: `£${listing.price.toFixed(2)}`,
          images: imageUrls.map(url => ({ uri: url })),
          likes: listing.favoritesCount,
        };
      });
      
      setTrendingProductsData(products);
      console.log(`Loaded ${products.length} trending products`);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      // Keep empty array on error, carousel will show nothing
      setTrendingProductsData([]);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const handleProductPress = (productId: number) => {
    router.push(`/product/${productId}` as any);
  };

  const handleCategoryPress = (categoryName: string) => {
    router.push(`/(tabs)/discovery?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Search Bar */}
      <SearchBar
        onShoppingCartPress={() => {}}
      />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={{ marginVertical: 16 }}>
          <View
            style={{
              width: "100%",
              aspectRatio: 16 / 5,
              borderRadius: 12,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              source={require("@/assets/images/hero-banner.jpg")}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
          </View>
        </View>

        {/* Quick Links Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "black",
              marginBottom: 12,
            }}
          >
            QUICK LINKS
          </Text>
          <ArticleCarousel />
        </View>

        <View style={{ marginBottom: 24 }}>
          {isLoadingTrending ? (
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Bold",
                  color: "black",
                  marginBottom: 12,
                }}
              >
                TRENDING NOW
              </Text>
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
              </View>
            </View>
          ) : trendingProductsData.length > 0 ? (
            <PopularProductsCarousel
              title="TRENDING NOW"
              items={trendingProductsData}
              onPressItem={(item) => handleProductPress(Number(item.id))}
            />
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Bold",
                  color: "black",
                  marginBottom: 12,
                }}
              >
                TRENDING NOW
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#666",
                  textAlign: 'center',
                  paddingVertical: 20,
                }}
              >
                No trending products available
              </Text>
            </View>
          )}
        </View>

        {/* RECENTLY ADDS */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Bold",
                color: "#000",
              }}
            >
              RECENTLY ADDS
            </Text>
            <Pressable>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#007AFF",
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyAddedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onPress={() => handleProductPress(product.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Top Categories Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#000",
              marginBottom: 12,
            }}
          >
            TOP CATEGORIES
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topCategories.map((cat) => {
              const cardWidth = screenWidth / 2;
              const cardHeight = cardWidth * (9 / 16);
              return (
                <Pressable
                  key={cat.title}
                  onPress={() => handleCategoryPress(cat.title)}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    marginRight: 8,
                    borderRadius: 8,
                    overflow: "hidden",
                    position: "relative",
                    borderWidth: 1,
                    borderColor: "rgba(128,128,128,0.2)",
                  }}
                >
                  <Image
                    source={cat.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                  {/* 3-step gradient overlay */}
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: "transparent",
                    }}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(0,0,0,0.9)",
                        "rgba(0,0,0,0.5)",
                        "rgba(0,0,0,0)",
                      ]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      locations={[0.0, 0.5, 0.8]}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                      }}
                    />
                  </View>
                  {/* Title with arrow */}
                  <View
                    style={{
                      position: "absolute",
                      left: 12,
                      right: 12,
                      bottom: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Poppins-Bold",
                        color: "white",
                      }}
                      numberOfLines={1}
                    >
                      {cat.title}
                    </Text>
                    <Feather name="chevron-right" size={16} color="white" />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Explore the Eras Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#000",
              marginBottom: 12,
            }}
          >
            EXPLORE THE ERAS
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {eras.map((era, idx) => {
              const cardWidth = screenWidth / 2 - (16 + 12) / 2;
              const cardHeight = cardWidth * (7 / 16);
              const isLeft = idx % 2 === 0;
              return (
                <View
                  key={era.name}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    marginRight: isLeft ? 12 : 0,
                    marginBottom: 12,
                    borderRadius: 8,
                    overflow: "hidden",
                    shadowColor: era.color,
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  <Image
                    source={era.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: era.color,
                      opacity: 0.5,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Poppins-Bold",
                        color: "white",
                        textShadowColor: "rgba(0,0,0,0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      {era.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "white",
                        textShadowColor: "rgba(0,0,0,0.5)",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                      }}
                    >
                      {era.decade}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Brands Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#000",
              marginBottom: 12,
            }}
          >
            Brands you may like
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from({ length: Math.ceil(brands.length / 2) }).map(
              (_, colIndex) => {
                const first = brands[colIndex * 2];
                const second = brands[colIndex * 2 + 1];
                return (
                  <View key={colIndex}>
                    {first && <BrandCard brand={first} />}
                    {second && <BrandCard brand={second} />}
                  </View>
                );
              }
            )}
          </ScrollView>
        </View>

        {/* Recently Viewed Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#000",
              marginBottom: 12,
            }}
          >
            RECENTLY VIEWED
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyViewedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSize={true}
                showProtectionFee={true}
                onPress={() => handleProductPress(product.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Indie Items Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Bold",
                color: "#000",
              }}
            >
              INDIE ITEMS
            </Text>
            <Pressable>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#007AFF",
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {indieItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSize={true}
                showProtectionFee={true}
                onPress={() => handleProductPress(product.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
