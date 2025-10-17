import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ReportsData {
  summary: {
    totalSales: number;
    formattedTotalSales: string;
    totalOrders: number;
    pageviews: number;
    sellerBalance: number;
    formattedSellerBalance: string;
    processingOrders: number;
    completedOrders: number;
    onHoldOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
  };
}

interface RecentOrder {
  id: string;
  number: string;
  status: string;
  total: number;
  formattedTotal: string;
  dateCreated: string;
}

interface TopSellingProduct {
  id: string;
  title: string;
  soldQty: number;
  formattedSoldQty: string;
}

interface SellerSettings {
  storeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    fullAddress: string;
  };
  gravatar: string;
  trusted: boolean;
  rating: {
    rating: number;
    count: number;
  };
}

export default function SellerDashboardScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [sellerSettings, setSellerSettings] = useState<SellerSettings | null>(
    null
  );
  const [topSellingProducts, setTopSellingProducts] = useState<
    TopSellingProduct[]
  >([]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const periodOptions = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual data fetching
      const mockReportsData: ReportsData = {
        summary: {
          totalSales: 1250.5,
          formattedTotalSales: "£1,250.50",
          totalOrders: 15,
          pageviews: 1250,
          sellerBalance: 850.25,
          formattedSellerBalance: "£850.25",
          processingOrders: 3,
          completedOrders: 8,
          onHoldOrders: 1,
          pendingOrders: 2,
          cancelledOrders: 1,
          refundedOrders: 0,
        },
      };

      const mockRecentOrders: RecentOrder[] = [
        {
          id: "1",
          number: "#1001",
          status: "processing",
          total: 89.99,
          formattedTotal: "£89.99",
          dateCreated: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          number: "#1002",
          status: "completed",
          total: 125.5,
          formattedTotal: "£125.50",
          dateCreated: "2024-01-14T14:20:00Z",
        },
      ];

      const mockSellerSettings: SellerSettings = {
        storeName: "Vintage Street Store",
        firstName: "John",
        lastName: "Doe",
        email: "john@vintagestreet.com",
        phone: "+1234567890",
        address: {
          fullAddress: "123 Vintage Lane, London, UK",
        },
        gravatar: "",
        trusted: true,
        rating: {
          rating: 4.8,
          count: 127,
        },
      };

      const mockTopProducts: TopSellingProduct[] = [
        {
          id: "1",
          title: "Vintage Nike Air Max",
          soldQty: 25,
          formattedSoldQty: "25",
        },
        {
          id: "2",
          title: "Retro Adidas Jacket",
          soldQty: 18,
          formattedSoldQty: "18",
        },
      ];

      setReportsData(mockReportsData);
      setRecentOrders(mockRecentOrders);
      setSellerSettings(mockSellerSettings);
      setTopSellingProducts(mockTopProducts);
    } catch (err) {
      setError("Error loading dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const changePeriod = (period: string) => {
    if (period !== selectedPeriod) {
      setSelectedPeriod(period);
    }
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const navigateToEditProduct = (productId: string) => {
    // router.push(`/sell/edit/${productId}`);
  };

  const StatsCard = ({
    title,
    value,
    isPositive = true,
  }: {
    title: string;
    value: string;
    isPositive?: boolean;
  }) => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 16,
        flex: 1,
      }}
    >
      <Text
        style={{
          color: "#999",
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 20,
          fontFamily: "Poppins-Bold",
        }}
      >
        {value}
      </Text>
    </View>
  );

  const OrderStatusBreakdown = () => {
    if (!reportsData?.summary) return null;

    const summary = reportsData.summary;
    const statusItems = [
      {
        label: "Processing",
        count: summary.processingOrders,
        color: "#007AFF",
      },
      { label: "Completed", count: summary.completedOrders, color: "#34C759" },
      { label: "On Hold", count: summary.onHoldOrders, color: "#FF9500" },
      { label: "Pending", count: summary.pendingOrders, color: "#FFCC00" },
      { label: "Cancelled", count: summary.cancelledOrders, color: "#FF3B30" },
      { label: "Refunded", count: summary.refundedOrders, color: "#AF52DE" },
    ].filter((item) => item.count > 0);

    if (statusItems.length === 0) {
      return (
        <View
          style={{
            backgroundColor: "#333",
            borderRadius: 12,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              textAlign: "center",
            }}
          >
            No orders yet
          </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: "#333",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Order Status
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
            }}
          >
            {summary.totalOrders} Total
          </Text>
        </View>

        {statusItems.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: item.color,
                marginRight: 12,
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                flex: 1,
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Bold",
              }}
            >
              {item.count}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const TopProductsList = () => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
      }}
    >
      {topSellingProducts.map((product, index) => (
        <View key={product.id}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0, 122, 255, 0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 16,
              }}
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                }}
              >
                {index + 1}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 4,
                }}
              >
                {product.title}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
              >
                Sold: {product.formattedSoldQty}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => navigateToEditProduct(product.id)}
                style={{ padding: 8, marginRight: 8 }}
              >
                <Feather name="edit" color="#007AFF" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateToProduct(product.id)}
                style={{ padding: 8 }}
              >
                <Feather name="eye" color="#999" size={20} />
              </TouchableOpacity>
            </View>
          </View>
          {index < topSellingProducts.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "#555",
                marginLeft: 72,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );

  const RecentOrdersList = () => (
    <View
      style={{
        backgroundColor: "#333",
        borderRadius: 12,
      }}
    >
      {recentOrders.map((order, index) => (
        <View key={order.id}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 4,
                }}
              >
                {order.number}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
              >
                {order.status} • {order.formattedTotal}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "Poppins-Bold",
                }}
              >
                View
              </Text>
            </TouchableOpacity>
          </View>
          {index < recentOrders.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "#555",
                marginLeft: 16,
              }}
            />
          )}
        </View>
      ))}
    </View>
  );

  const StoreProfileCard = () => {
    if (!sellerSettings) return null;

    return (
      <View
        style={{
          backgroundColor: "#333",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#555",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Feather name="shopping-bag" color="#fff" size={25} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                marginBottom: 4,
              }}
            >
              {sellerSettings.storeName}
            </Text>
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              {sellerSettings.firstName} {sellerSettings.lastName}
            </Text>
          </View>

          {sellerSettings.trusted && (
            <View style={{ alignItems: "center" }}>
              <Feather name="check-circle" color="#34C759" size={20} />
              <Text
                style={{
                  color: "#34C759",
                  fontSize: 10,
                  fontFamily: "Poppins-Regular",
                  marginTop: 4,
                }}
              >
                Trusted
              </Text>
            </View>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="mail" color="#999" size={16} />
              <Text
                style={{
                  color: "#999",
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  marginLeft: 8,
                }}
              >
                Email
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                marginLeft: 24,
              }}
            >
              {sellerSettings.email}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Feather name="phone" color="#999" size={16} />
              <Text
                style={{
                  color: "#999",
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  marginLeft: 8,
                }}
              >
                Phone
              </Text>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                marginLeft: 24,
              }}
            >
              {sellerSettings.phone || "Not provided"}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Feather name="map-pin" color="#999" size={16} />
          <Text
            style={{
              color: "#999",
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              marginLeft: 8,
            }}
          >
            Address
          </Text>
        </View>
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            marginLeft: 24,
            marginBottom: 12,
          }}
        >
          {sellerSettings.address.fullAddress || "Not provided"}
        </Text>

        {sellerSettings.rating.count > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="star" color="#999" size={16} />
            <Text
              style={{
                color: "#999",
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                marginLeft: 8,
              }}
            >
              Rating
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                marginLeft: 8,
              }}
            >
              {sellerSettings.rating.rating} ({sellerSettings.rating.count}{" "}
              reviews)
            </Text>
          </View>
        )}
      </View>
    );
  };

  const FinancialSummary = () => {
    if (!reportsData?.summary) return null;

    const summary = reportsData.summary;

    return (
      <View
        style={{
          backgroundColor: "#333",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              Total Sales
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Bold",
              }}
            >
              {summary.formattedTotalSales}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              Current Balance
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Bold",
              }}
            >
              {summary.formattedSellerBalance}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
              }}
            >
              Total Orders
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontFamily: "Poppins-Bold",
              }}
            >
              {summary.totalOrders}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#555",
            marginVertical: 12,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            Active Orders
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            {summary.processingOrders + summary.pendingOrders}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 16,
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#fff",
            }}
          >
            Seller Dashboard
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#000",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginRight: 16,
            }}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#fff",
            }}
          >
            Seller Dashboard
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Feather name="alert-circle" color="#ff4444" size={48} />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Error loading dashboard data
          </Text>
          <Text
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadDashboardData}
            style={{
              backgroundColor: "#007AFF",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Poppins-Bold",
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#000",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginRight: 16,
          }}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: "Poppins-Bold",
            color: "#fff",
          }}
        >
          Seller Dashboard
        </Text>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Select Period",
              "Choose a time period",
              periodOptions.map((option) => ({
                text: option.label,
                onPress: () => changePeriod(option.value),
              }))
            );
          }}
          style={{
            marginRight: 16,
            padding: 8,
          }}
        >
          <Feather name="calendar" color="#fff" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={loadDashboardData}
          style={{
            padding: 8,
          }}
        >
          <Feather name="refresh-cw" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDashboardData}
            tintColor="#007AFF"
          />
        }
      >
        <View style={{ padding: 16 }}>
          {/* Period Selector */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                marginRight: 8,
              }}
            >
              Period:
            </Text>
            <View
              style={{
                backgroundColor: "#555",
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "Poppins-Bold",
                }}
              >
                {periodOptions.find((p) => p.value === selectedPeriod)?.label}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 12,
            }}
          >
            <StatsCard
              title="Total Sales"
              value={reportsData?.summary?.formattedTotalSales || "£0.00"}
            />
            <View style={{ width: 12 }} />
            <StatsCard
              title="Total Orders"
              value={reportsData?.summary?.totalOrders?.toString() || "0"}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginBottom: 24,
            }}
          >
            <StatsCard
              title="Page Views"
              value={reportsData?.summary?.pageviews?.toString() || "0"}
            />
            <View style={{ width: 12 }} />
            <StatsCard
              title="Balance"
              value={reportsData?.summary?.formattedSellerBalance || "£0.00"}
            />
          </View>

          {/* Order Status Breakdown */}
          {reportsData?.summary && (
            <>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 12,
                }}
              >
                Order Status Breakdown
              </Text>
              <OrderStatusBreakdown />
              <View style={{ height: 24 }} />
            </>
          )}

          {/* Quick Actions */}
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>
          <View
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#999",
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                textAlign: "center",
              }}
            >
              Quick actions would be implemented here
            </Text>
          </View>

          {/* Store Profile */}
          {sellerSettings && (
            <>
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
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Store Profile
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Edit Profile",
                      "This would navigate to profile editing"
                    );
                  }}
                >
                  <Text
                    style={{
                      color: "#007AFF",
                      fontSize: 16,
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
              <StoreProfileCard />
              <View style={{ height: 24 }} />
            </>
          )}

          {/* Top Selling Products */}
          {topSellingProducts.length > 0 && (
            <>
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
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: "Poppins-Bold",
                  }}
                >
                  Top Selling Products
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("View All", "This would navigate to inventory");
                  }}
                >
                  <Text
                    style={{
                      color: "#007AFF",
                      fontSize: 16,
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              <TopProductsList />
              <View style={{ height: 24 }} />
            </>
          )}

          {/* Recent Orders */}
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
                color: "#fff",
                fontSize: 18,
                fontFamily: "Poppins-Bold",
              }}
            >
              Recent Orders
            </Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("View All", "This would navigate to orders");
              }}
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 16,
                  fontFamily: "Poppins-Regular",
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <RecentOrdersList />

          {/* Financial Summary */}
          {reportsData?.summary && (
            <>
              <View style={{ height: 24 }} />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  marginBottom: 12,
                }}
              >
                Financial Summary
              </Text>
              <FinancialSummary />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
