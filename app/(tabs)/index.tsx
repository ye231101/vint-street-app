import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

// Quick Links slider content
const quickLinks = [
  {
    id: 1,
    title: "Meet Vint Street",
    subtitle: "What, who, where, why, and how",
    image: require("@/assets/images/homepage_slider/1.jpg"),
  },
  {
    id: 2,
    title: "Buying, Selling & Re-Listing",
    subtitle: "Learn how it all works",
    image: require("@/assets/images/homepage_slider/2.jpg"),
  },
  {
    id: 4,
    title: "Get Informed",
    subtitle: "See the best fits. Add yours.",
    image: require("@/assets/images/homepage_slider/4.jpg"),
  },
  {
    id: 5,
    title: "Our Community",
    subtitle: "Join the discussion",
    image: require("@/assets/images/homepage_slider/5.jpg"),
  },
  {
    id: 6,
    title: "Help Centre",
    subtitle: "Problem? Solved!",
    image: require("@/assets/images/homepage_slider/6.jpg"),
  },
];

// Mock data for products
const trendingProducts = [
  {
    id: 1,
    name: "Game & Watch Gallery Advance...",
    brand: "Nintendo",
    price: "£175.00",
    image: require("@/assets/images/hero-banner.jpg"),
    likes: 0,
  },
  {
    id: 2,
    name: "Zelda Game & Watch - Boxed wi...",
    brand: "Nintendo",
    price: "£1,125.00",
    image: require("@/assets/images/hero-banner.jpg"),
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

const brands = [
  { name: "Levi's", image: require("@/assets/images/splash_logo.png") },
  { name: "Adidas", image: require("@/assets/images/splash_logo.png") },
  { name: "H&M", image: require("@/assets/images/splash_logo.png") },
  { name: "Nike", image: require("@/assets/images/splash_logo.png") },
  { name: "Zara", image: require("@/assets/images/splash_logo.png") },
  { name: "Gucci", image: require("@/assets/images/splash_logo.png") },
];

const eras = [
  {
    name: "70s",
    decade: "1970s",
    color: "#E91E63",
    image: require("@/assets/images/hero-banner.jpg"),
  },
  {
    name: "80s",
    decade: "1980s",
    color: "#9C27B0",
    image: require("@/assets/images/hero-banner.jpg"),
  },
  {
    name: "90s",
    decade: "1990s",
    color: "#2196F3",
    image: require("@/assets/images/hero-banner.jpg"),
  },
  {
    name: "00s",
    decade: "2000s",
    color: "#4CAF50",
    image: require("@/assets/images/hero-banner.jpg"),
  },
];

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: any;
  likes: number;
  size?: string;
  protectionFee?: string;
}

const ProductCard = ({
  product,
  showSize = false,
  showProtectionFee = false,
}: {
  product: Product;
  showSize?: boolean;
  showProtectionFee?: boolean;
}) => (
  <View
    style={{
      width: screenWidth * 0.45,
      marginRight: 12,
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <View style={{ position: "relative" }}>
      <Image
        source={product.image}
        style={{
          width: "100%",
          height: 200,
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 12,
          paddingHorizontal: 6,
          paddingVertical: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Feather name="heart" size={12} color="white" />
        <Text style={{ color: "white", fontSize: 10, marginLeft: 2 }}>
          {product.likes}
        </Text>
      </View>
    </View>
    <View style={{ padding: 12 }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins-Regular",
          marginBottom: 4,
        }}
        numberOfLines={2}
      >
        {product.name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins-Regular",
          color: "#666",
          marginBottom: 4,
        }}
      >
        {product.brand}
      </Text>
      {showSize && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins-Regular",
            color: "#666",
            marginBottom: 4,
          }}
        >
          {product.size}
        </Text>
      )}
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-SemiBold",
          marginBottom: 2,
        }}
      >
        {product.price}
      </Text>
      {showProtectionFee && (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Poppins-Regular",
            color: "#666",
          }}
        >
          ({product.protectionFee} Protection Fee)
        </Text>
      )}
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Poppins-Regular",
          color: "#666",
          marginTop: 2,
        }}
      >
        (Official Vint Street Product)
      </Text>
    </View>
  </View>
);

interface Brand {
  name: string;
  image: any;
}

const BrandCard = ({ brand }: { brand: Brand }) => (
  <View
    style={{
      width: screenWidth / 3 - 16,
      height: (screenWidth / 3 - 16) * (3 / 4),
      backgroundColor: "#fff",
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    }}
  >
    <Image
      source={brand.image}
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

interface Era {
  name: string;
  decade: string;
  color: string;
  image: any;
}

const EraCard = ({ era }: { era: Era }) => (
  <Pressable
    style={{
      flex: 1,
      height: 120,
      margin: 6,
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: era.color,
        opacity: 0.7,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
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
  </Pressable>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#151515",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#4a4a4a",
            borderRadius: 8,
            paddingHorizontal: 12,
            marginRight: 32,
          }}
        >
          <Feather name="search" size={20} color="#fff" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#b0b0b0"
            style={{
              flex: 1,
              marginLeft: 8,
              fontFamily: "Poppins-Regular",
              fontSize: 14,
            }}
          />
        </View>
        <Pressable
          style={
            {
              // padding: 8,
            }
          }
        >
          <Feather name="shopping-bag" size={20} color="#fff" />
        </Pressable>
      </View>

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
              color: "#000",
              marginBottom: 12,
            }}
          >
            QUICK LINKS
          </Text>
          <CarouselQuickLinks />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {recentlyAddedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                width: screenWidth * 0.6,
                height: 200,
                marginRight: 12,
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                source={require("@/assets/images/hero-banner.jpg")}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              >
                <View
                  style={{
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
                  >
                    Caps
                  </Text>
                  <Feather name="arrow-right" size={16} color="white" />
                </View>
              </View>
            </View>
            <View
              style={{
                width: screenWidth * 0.6,
                height: 200,
                marginRight: 12,
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                source={require("@/assets/images/hero-banner.jpg")}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 16,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              >
                <View
                  style={{
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
                  >
                    Denim
                  </Text>
                  <Feather name="arrow-right" size={16} color="white" />
                </View>
              </View>
            </View>
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
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {eras.map((era, index) => (
              <EraCard key={era.name} era={era} />
            ))}
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
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {brands.map((brand, index) => (
              <BrandCard key={brand.name} brand={brand} />
            ))}
          </View>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {indieItems.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showSize={true}
                showProtectionFee={true}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending Now Section */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins-Bold",
              color: "#000",
              marginBottom: 12,
            }}
          >
            TRENDING NOW
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding for navigation */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CarouselQuickLinks() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const current = Math.round(contentOffsetX / viewWidth);
    if (current !== index) setIndex(current);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: screenWidth - 16,
          aspectRatio: 16 / 7,
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        >
          {quickLinks.map((item) => (
            <View key={item.id} style={{ width: screenWidth - 16 }}>
              <Pressable
                style={{
                  width: "100%",
                  aspectRatio: 16 / 7,
                  position: "relative",
                }}
              >
                <Image
                  source={item.image}
                  style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                />
                <LinearGradient
                  colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 24,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Poppins-Bold",
                      color: "white",
                      marginBottom: 12,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-Regular",
                      color: "#ffffff",
                      opacity: 0.95,
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 12,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {quickLinks.map((_, i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 3,
                backgroundColor: i === index ? "#ffffff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
