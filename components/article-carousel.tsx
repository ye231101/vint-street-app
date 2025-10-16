import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

type NavigationType = "internal" | "helpCenter";

interface ArticleItem {
  id: number;
  title: string;
  subtitle: string;
  image: any;
  link?: string;
  navigationType?: NavigationType;
  routeName?: string;
}

const articles: ArticleItem[] = [
  {
    id: 1,
    title: "Meet Vint Street",
    subtitle: "What, who, where, why, and how",
    image: require("@/assets/images/homepage_slider/1.jpg"),
    link: "https://vintstreet.com/about",
    navigationType: "internal",
    routeName: "/articles/meet-vint-street",
  },
  {
    id: 2,
    title: "Buying, Selling & Re-Listing",
    subtitle: "Learn how it all works",
    image: require("@/assets/images/homepage_slider/2.jpg"),
    link: "https://vintstreet.com/sell",
    navigationType: "internal",
    routeName: "/articles/selling-relisting",
  },
  {
    id: 4,
    title: "Get Informed",
    subtitle: "See the best fits. Add yours.",
    image: require("@/assets/images/homepage_slider/4.jpg"),
    link: "https://vintstreet.com/inspiration",
    navigationType: "internal",
    routeName: "/articles/get-informed",
  },
  {
    id: 5,
    title: "Our Community",
    subtitle: "Join the discussion",
    image: require("@/assets/images/homepage_slider/5.jpg"),
    link: "https://vintstreet.com/community",
    navigationType: "internal",
    routeName: "/articles/our-community",
  },
  {
    id: 6,
    title: "Help Centre",
    subtitle: "Problem? Solved!",
    image: require("@/assets/images/homepage_slider/6.jpg"),
    link: "https://vintstreet.com/help",
    navigationType: "helpCenter",
    routeName: "/account/help-center",
  },
];

export default function ArticleCarousel() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const current = Math.round(contentOffsetX / viewWidth);
    if (current !== index) setIndex(current);
  };

  const launchUrl = async (url?: string) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (e) {}
  };

  const handleTap = (item: ArticleItem) => {
    switch (item.navigationType) {
      case "internal": {
        break;
      }
      case "helpCenter": {
        break;
      }
      default: {
        break;
      }
    }
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
          {articles.map((item) => (
            <View key={item.id} style={{ width: screenWidth - 16 }}>
              <Pressable
                onPress={() => handleTap(item)}
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
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
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
          {articles.map((_, i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 3,
                backgroundColor:
                  i === index ? "#ffffff" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
