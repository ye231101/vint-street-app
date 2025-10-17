import { typesenseService } from "@/api/services";
import { VintStreetListing } from "@/api/types/product.types";
import { useBasket } from "@/hooks/useBasket";
import { useRecentlyViewed } from "@/providers/recently-viewed-provider";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  likes: number;
  brand: string;
  size: string;
  description: string;
  vendorId: number;
  vendorShopName: string;
  stockQuantity: number;
  onSale: boolean;
  averageRating: number;
  reviewCount: number;
  condition: string;
  colour: string;
  gender: string;
  flaws?: string;
}

// Mock product data
const mockProduct: Product = {
  id: 1,
  name: "Tommy Hilfiger Jeans, Blue - 11",
  price: 40.0,
  images: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400",
  ],
  likes: 0,
  brand: "Tommy Hilfiger",
  size: "11",
  description:
    "Tommy Hilfiger Jeans, Blue - Size 11. Classic blue denim jeans in excellent condition, featuring two front pockets, including a coin pocket on the right with an embroidered Tommy Hilfiger logo for added detail. The waistband is finished with another signature Tommy Hilfiger logo embroidered on the back. Two back pockets provide a timeless silhouette & reliable high-quality staple for",
  vendorId: 42,
  vendorShopName: "Vint Street Official",
  stockQuantity: 5,
  onSale: false,
  averageRating: 4.8,
  reviewCount: 127,
  condition: "Excellent",
  colour: "Blue",
  gender: "Unisex",
  flaws: "None",
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addProduct } = useRecentlyViewed();
  const { addToBasket } = useBasket();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["description"])
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const [productListing, setProductListing] =
    useState<VintStreetListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch product and add to recently viewed
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productId = parseInt(id as string, 10);
        const listing = await typesenseService.getProductById(productId);

        if (listing) {
          setProductListing(listing);
          // Add to recently viewed
          await addProduct(listing);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Show error if product not found
  if (!productListing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontFamily: "Poppins-Regular", fontSize: 16 }}>
            Product not found
          </Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 14,
                color: "#007AFF",
              }}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Convert listing to product format for display
  const product: Product = {
    id: productListing.id,
    name: productListing.name,
    price: productListing.price,
    images:
      productListing.fullImageUrls.length > 0
        ? productListing.fullImageUrls
        : productListing.thumbnailImageUrls,
    likes: productListing.favoritesCount,
    brand: productListing.brand || "No Brand",
    size: productListing.attributes.pa_size?.[0] || "",
    description:
      productListing.description || productListing.shortDescription || "",
    vendorId: productListing.vendorId,
    vendorShopName: productListing.vendorShopName || "Unknown Vendor",
    stockQuantity: productListing.stockQuantity,
    onSale: productListing.onSale,
    averageRating: productListing.averageRating,
    reviewCount: productListing.reviewCount,
    condition: productListing.attributes.pa_condition?.[0] || "",
    colour: productListing.attributes.pa_colour?.[0] || "",
    gender: productListing.attributes.pa_gender?.[0] || "",
    flaws: productListing.attributes.flaws?.[0],
  };

  const handleShoppingCart = () => {
    router.push("/basket");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddToBasket = () => {
    if (!productListing) return;

    const productData = {
      productId: productListing.id,
      name: productListing.name,
      price: productListing.price,
      quantity: 1,
      image: productListing.fullImageUrls?.[0] || "",
      vendorId: productListing.vendorId,
      vendorName: productListing.vendorShopName,
      protectionFeePercentage: productListing.vendorId === 42 ? 0 : 0.072, // 7.2% protection fee for non-official products
    };

    addToBasket(productData);
  };

  const handleBuyNow = () => {
    if (!productListing) return;

    // Add to basket first
    const productData = {
      productId: productListing.id,
      name: productListing.name,
      price: productListing.price,
      quantity: 1,
      image: productListing.fullImageUrls?.[0] || "",
      vendorId: productListing.vendorId,
      vendorName: productListing.vendorShopName,
      protectionFeePercentage: productListing.vendorId === 42 ? 0 : 0.072,
    };

    addToBasket(productData);

    // Navigate to checkout
    router.push("/checkout");
  };

  const formatPrice = (price: number) => {
    return `£${price.toFixed(2)}`;
  };

  const renderImageCarousel = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentImageIndex(index);
        }}
        style={styles.imageScrollView}
      >
        {product.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Image dots */}
      <View style={styles.dotsContainer}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentImageIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderAccordionSection = (
    title: string,
    section: string,
    children: React.ReactNode
  ) => {
    const isExpanded = expandedSections.has(section);

    return (
      <View style={styles.accordionSection}>
        <Pressable
          style={styles.accordionHeader}
          onPress={() => toggleSection(section)}
        >
          <Text style={styles.accordionTitle}>{title}</Text>
          <Feather
            name={isExpanded ? "chevron-down" : "chevron-right"}
            size={20}
            color="#666"
          />
        </Pressable>
        {isExpanded && <View style={styles.accordionContent}>{children}</View>}
      </View>
    );
  };

  const renderDescriptionContent = () => (
    <View style={styles.descriptionContent}>
      <Text style={styles.descriptionTitle}>{product.name}</Text>
      <Text style={styles.descriptionText}>{product.description}</Text>
    </View>
  );

  const renderAttributesContent = () => (
    <View style={styles.attributesContent}>
      <Text style={styles.attributesTitle}>Product Details</Text>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Brand</Text>
        <Text style={styles.attributeValue}>{product.brand}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Colour</Text>
        <Text style={styles.attributeValue}>{product.colour}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Condition</Text>
        <Text style={styles.attributeValue}>{product.condition}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Flaws</Text>
        <Text style={styles.attributeValue}>{product.flaws || "None"}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Gender</Text>
        <Text style={styles.attributeValue}>{product.gender}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Size</Text>
        <Text style={styles.attributeValue}>{product.size}</Text>
      </View>
      <View style={styles.attributeRow}>
        <Text style={styles.attributeLabel}>Stock Quantity</Text>
        <Text style={styles.attributeValue}>{product.stockQuantity}</Text>
      </View>
      {product.onSale && (
        <View style={styles.attributeRow}>
          <Text style={styles.attributeLabel}>On Sale</Text>
          <Text style={styles.attributeValue}>Yes</Text>
        </View>
      )}
    </View>
  );

  const renderSellerContent = () => (
    <View style={styles.sellerContent}>
      <Text style={styles.sellerTitle}>Seller Information</Text>
      <View style={styles.sellerInfo}>
        <View style={styles.sellerAvatar}>
          <Feather name="shopping-bag" size={24} color="#666" />
        </View>
        <View style={styles.sellerDetails}>
          <Text style={styles.sellerName}>{product.vendorShopName}</Text>
          <View style={styles.sellerRating}>
            <Feather name="star" size={14} color="#FFA500" />
            <Text style={styles.ratingText}>
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </Text>
          </View>
        </View>
      </View>
      <Pressable style={styles.visitShopButton}>
        <Feather name="shopping-bag" size={18} color="#fff" />
        <Text style={styles.visitShopText}>Visit Shop</Text>
      </Pressable>
      <Pressable style={styles.contactSellerButton}>
        <Feather name="message-circle" size={18} color="#fff" />
        <Text style={styles.contactSellerText}>Contact Seller</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </Pressable>
        <Pressable onPress={handleShoppingCart}>
          <Feather name="shopping-bag" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        {/* Image Carousel */}
        {renderImageCarousel()}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productPrice}>
                {formatPrice(product.price)}
              </Text>
              <Text style={styles.productStatus}>
                {product.vendorId === 42
                  ? "(Official Vint Street Product)"
                  : `(Protection fee: ${formatPrice(product.price * 0.072)})`}
              </Text>
            </View>
            <Pressable style={styles.likeButton} onPress={handleLike}>
              <Text style={styles.likeCount}>{product.likes}</Text>
              <Feather
                name={isLiked ? "heart" : "heart"}
                size={20}
                color={isLiked ? "#FF6B6B" : "#666"}
              />
            </Pressable>
          </View>
        </View>

        {/* Accordion Sections */}
        <View style={styles.accordionContainer}>
          {renderAccordionSection(
            "Description",
            "description",
            renderDescriptionContent()
          )}
          {renderAccordionSection(
            "Attributes",
            "attributes",
            renderAttributesContent()
          )}
          {renderAccordionSection("Seller", "seller", renderSellerContent())}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.addToBasketButton} onPress={handleAddToBasket}>
          <Text style={styles.addToBasketText}>Add to Basket</Text>
        </Pressable>
        <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 24,
    marginTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    height: screenWidth * (4 / 3),
  },
  imageScrollView: {
    height: "100%",
  },
  productImage: {
    width: screenWidth,
    height: "100%",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
  productInfo: {
    backgroundColor: "#fff",
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  productStatus: {
    fontSize: 12,
    color: "#666",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  likeCount: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  accordionContainer: {
    backgroundColor: "#fff",
  },
  accordionSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionContent: {
    paddingVertical: 8,
  },
  descriptionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 11,
    color: "#000",
    lineHeight: 16,
  },
  attributesContent: {
    paddingVertical: 8,
  },
  attributesTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  attributeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  attributeLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#000",
  },
  attributeValue: {
    fontSize: 11,
    color: "#000",
  },
  sellerContent: {
    paddingVertical: 8,
  },
  sellerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 3,
  },
  sellerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 3,
  },
  visitShopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  visitShopText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 8,
  },
  contactSellerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#66B7ED",
    paddingVertical: 10,
    borderRadius: 6,
  },
  contactSellerText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 8,
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  addToBasketButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  addToBasketText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "bold",
  },
  buyNowButton: {
    flex: 1,
    height: 40,
    backgroundColor: "#000",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  buyNowText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "bold",
  },
});
