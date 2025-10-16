import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export interface PopularProductItem {
  id: number | string;
  name: string;
  brand: string;
  price: string;
  images: any[];
  likes?: number;
}

export default function PopularProductsCarousel({
  title = "TRENDING NOW",
  items = [],
  onPressItem,
}: {
  title?: string;
  items?: PopularProductItem[];
  onPressItem?: (item: PopularProductItem) => void;
}) {
  const cardWidth = screenWidth / 2 - 20;
  const cardHeight = cardWidth * (4 / 3);
  const [currentForId, setCurrentForId] = useState<
    Record<string | number, number>
  >({});
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const [draggingInner, setDraggingInner] = useState(false);

  const handleImageScroll = (id: string | number, event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const viewW = event.nativeEvent.layoutMeasurement.width;
    const idx = Math.round(x / viewW);
    if (currentForId[id] !== idx) {
      setCurrentForId((prev) => ({ ...prev, [id]: idx }));
    }
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins-Bold",
          color: "black",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={outerScrollEnabled}
      >
        {items.map((product) => (
          <Pressable
            key={product.id}
            onPress={() => {
              if (!draggingInner) onPressItem?.(product);
            }}
            style={{
              width: cardWidth,
              marginRight: 8,
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            <View style={{ position: "relative" }}>
              {Array.isArray(product.images) && product.images.length > 0 ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  nestedScrollEnabled
                  directionalLockEnabled
                  showsHorizontalScrollIndicator={false}
                  onScrollBeginDrag={() => {
                    setDraggingInner(true);
                    setOuterScrollEnabled(false);
                  }}
                  onScrollEndDrag={() => {
                    setDraggingInner(false);
                    setOuterScrollEnabled(true);
                  }}
                  onMomentumScrollEnd={() => {
                    setDraggingInner(false);
                    setOuterScrollEnabled(true);
                  }}
                  onScroll={(e) => handleImageScroll(product.id, e)}
                  scrollEventThrottle={16}
                  style={{ width: cardWidth, height: cardHeight }}
                >
                  {product.images.map((img, idx) => (
                    <Image
                      key={`${product.id}-${idx}`}
                      source={img}
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        resizeMode: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Image
                  source={product.images[0]}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    resizeMode: "cover",
                  }}
                />
              )}
              <View
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderRadius: 12,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "black", fontSize: 12, marginRight: 8 }}>
                  {product.likes ?? 0}
                </Text>
                <Feather name="heart" size={12} color="black" />
              </View>
              {Array.isArray(product.images) && product.images.length > 1 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 6,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {product.images.map((_, dotIdx) => (
                    <View
                      key={dotIdx}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        marginHorizontal: 3,
                        backgroundColor:
                          (currentForId[product.id] ?? 0) === dotIdx
                            ? "#ffffff"
                            : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
            <View style={{ padding: 8 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {product.name}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontFamily: "Poppins-Regular",
                  color: "#666",
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {product.brand}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins-SemiBold",
                }}
              >
                {product.price}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Poppins-Regular",
                  color: "#666",
                  marginTop: 2,
                }}
              >
                (Official Vint Street Product)
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
