import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CheckoutItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  lineTotal: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export default function CheckoutScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [protectionFee, setProtectionFee] = useState(0);
  const [total, setTotal] = useState(0);

  // Step completion tracking
  const [stepCompleted, setStepCompleted] = useState([false, false, false]);

  // Form states
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "United Kingdom",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "United Kingdom",
  });

  const [isBillingDifferent, setIsBillingDifferent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    country: "United States",
    zipCode: "",
  });

  useEffect(() => {
    loadCheckoutData();
  }, []);

  useEffect(() => {
    updateStepCompletion();
  }, [shippingAddress, billingAddress, cardDetails]);

  const loadCheckoutData = async () => {
    setIsLoading(true);

    try {
      // Mock data - replace with actual data fetching
      const mockItems: CheckoutItem[] = [
        {
          id: "1",
          name: "D&G 2003 Bomber Jacket, Black - XXL",
          brand: "D&G",
          price: 999.0,
          quantity: 1,
          image: "https://via.placeholder.com/50x50/000000/FFFFFF?text=D&G",
          lineTotal: 999.0,
        },
      ];

      const mockSubtotal = 999.0;
      const mockProtectionFee = 71.93;
      const mockTotal = 1070.93;

      setCheckoutItems(mockItems);
      setSubtotal(mockSubtotal);
      setProtectionFee(mockProtectionFee);
      setTotal(mockTotal);
    } catch (err) {
      Alert.alert("Error", "Failed to load checkout data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepCompletion = () => {
    const shippingComplete =
      shippingAddress.firstName.trim() !== "" &&
      shippingAddress.lastName.trim() !== "" &&
      shippingAddress.email.trim() !== "" &&
      shippingAddress.phone.trim() !== "" &&
      shippingAddress.address1.trim() !== "" &&
      shippingAddress.city.trim() !== "" &&
      shippingAddress.postcode.trim() !== "";

    const billingComplete = isBillingDifferent
      ? billingAddress.firstName.trim() !== "" &&
        billingAddress.lastName.trim() !== "" &&
        billingAddress.email.trim() !== "" &&
        billingAddress.phone.trim() !== "" &&
        billingAddress.address1.trim() !== "" &&
        billingAddress.city.trim() !== "" &&
        billingAddress.postcode.trim() !== ""
      : shippingComplete;

    const paymentComplete =
      cardDetails.cardholderName.trim() !== "" &&
      cardDetails.cardNumber.trim() !== "" &&
      cardDetails.expiryDate.trim() !== "" &&
      cardDetails.cvc.trim() !== "";

    setStepCompleted([shippingComplete, billingComplete, paymentComplete]);
  };

  const canProceedToCheckout = () => {
    return stepCompleted.every((step) => step);
  };

  const getValidationMessage = () => {
    const missingFields = [];

    if (!stepCompleted[0]) missingFields.push("Shipping address");
    if (!stepCompleted[1]) missingFields.push("Billing details");
    if (!stepCompleted[2]) missingFields.push("Payment method");

    if (missingFields.length === 0) return "All fields are complete!";
    if (missingFields.length === 1)
      return `Please complete: ${missingFields[0]}`;
    if (missingFields.length === 2)
      return `Please complete: ${missingFields[0]} and ${missingFields[1]}`;
    return `Please complete: ${missingFields.slice(0, -1).join(", ")}, and ${
      missingFields[missingFields.length - 1]
    }`;
  };

  const processCheckout = () => {
    if (!canProceedToCheckout()) {
      Alert.alert("Complete Required Fields", getValidationMessage());
      return;
    }

    Alert.alert(
      "Checkout",
      "This would process the payment and create the order"
    );
  };

  const OrderSummaryCard = () => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#f8f9fa",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Feather name="shopping-bag" color="#666" size={20} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            marginLeft: 8,
            flex: 1,
          }}
        >
          Order Summary
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            color: "#666",
          }}
        >
          {checkoutItems.length} item{checkoutItems.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Items */}
      {checkoutItems.map((item) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            padding: 16,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              backgroundColor: "#f0f0f0",
              marginRight: 12,
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Bold",
                color: "#333",
                marginBottom: 4,
              }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "#666",
                marginBottom: 4,
              }}
            >
              {item.brand}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "#666",
              }}
            >
              Qty: {item.quantity}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            £{item.lineTotal.toFixed(2)}
          </Text>
        </View>
      ))}

      {/* Totals */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#f8f9fa",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#666",
            }}
          >
            Subtotal
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            £{subtotal.toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#666",
            }}
          >
            Protection Fee
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            £{protectionFee.toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#e0e0e0",
            marginVertical: 8,
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
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            Total
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#333",
            }}
          >
            £{total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const ProgressIndicator = () => {
    const completedSteps = stepCompleted.filter((step) => step).length;
    const totalSteps = stepCompleted.length;
    const progress = completedSteps / totalSteps;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          margin: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Feather name="check-square" color="#007AFF" size={20} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#333",
              marginLeft: 8,
              flex: 1,
            }}
          >
            Checkout Progress
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#666",
            }}
          >
            {completedSteps} of {totalSteps} completed
          </Text>
        </View>

        <View
          style={{
            height: 8,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              height: 8,
              backgroundColor: progress === 1 ? "#34C759" : "#007AFF",
              borderRadius: 4,
              width: `${progress * 100}%`,
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 12,
            fontFamily: progress === 1 ? "Poppins-Bold" : "Poppins-Regular",
            color: progress === 1 ? "#34C759" : "#666",
          }}
        >
          {progress === 1
            ? "All steps completed! You can now place your order."
            : "Complete all steps to place your order."}
        </Text>
      </View>
    );
  };

  const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    required = false,
    icon,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: "default" | "email-address" | "numeric";
    required?: boolean;
    icon?: string;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-Bold",
          color: "#333",
          marginBottom: 8,
        }}
      >
        {label} {required && <Text style={{ color: "#ff4444" }}>*</Text>}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          paddingHorizontal: 12,
        }}
      >
        {icon && (
          <Feather
            name={icon as any}
            color="#666"
            size={16}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: "#333",
          }}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const ShippingAddressSection = () => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: stepCompleted[0] ? "#34C759" : "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          {stepCompleted[0] ? (
            <Feather name="check" color="#fff" size={20} />
          ) : (
            <Feather name="map-pin" color="#666" size={20} />
          )}
        </View>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            flex: 1,
          }}
        >
          Shipping Address
        </Text>

        {stepCompleted[0] && (
          <View
            style={{
              backgroundColor: "#34C759",
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontFamily: "Poppins-Bold",
              }}
            >
              ✓
            </Text>
          </View>
        )}
      </View>

      {/* Section Content */}
      <View style={{ padding: 20 }}>
        <FormField
          label="Enter Shipping Address"
          value=""
          onChangeText={() => {}}
          placeholder="Search for your address..."
          icon="search"
        />

        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="First Name"
              value={shippingAddress.firstName}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, firstName: text })
              }
              placeholder="First Name"
              icon="user"
              required
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <FormField
              label="Last Name"
              value={shippingAddress.lastName}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, lastName: text })
              }
              placeholder="Last Name"
              required
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="Email"
              value={shippingAddress.email}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, email: text })
              }
              placeholder="Email"
              keyboardType="email-address"
              icon="mail"
              required
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <FormField
              label="Phone"
              value={shippingAddress.phone}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, phone: text })
              }
              placeholder="Phone"
              keyboardType="numeric"
              icon="phone"
              required
            />
          </View>
        </View>

        <FormField
          label="Address Line 1"
          value={shippingAddress.address1}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, address1: text })
          }
          placeholder="Address Line 1"
          icon="home"
          required
        />

        <FormField
          label="Address Line 2 (Optional)"
          value={shippingAddress.address2 || ""}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, address2: text })
          }
          placeholder="Address Line 2 (Optional)"
          icon="home"
        />

        <FormField
          label="City"
          value={shippingAddress.city}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, city: text })
          }
          placeholder="City"
          required
        />

        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 8 }}>
            <FormField
              label="State/Country"
              value={shippingAddress.state}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, state: text })
              }
              placeholder="State/Country"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <FormField
              label="Postcode"
              value={shippingAddress.postcode}
              onChangeText={(text) =>
                setShippingAddress({ ...shippingAddress, postcode: text })
              }
              placeholder="Postcode"
              required
            />
          </View>
        </View>
      </View>
    </View>
  );

  const BillingDetailsSection = () => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: stepCompleted[1] ? "#34C759" : "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          {stepCompleted[1] ? (
            <Feather name="check" color="#fff" size={20} />
          ) : (
            <Feather name="home" color="#666" size={20} />
          )}
        </View>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            flex: 1,
          }}
        >
          Billing Details
        </Text>

        {stepCompleted[1] && (
          <View
            style={{
              backgroundColor: "#34C759",
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontFamily: "Poppins-Bold",
              }}
            >
              ✓
            </Text>
          </View>
        )}
      </View>

      {/* Section Content */}
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Feather name="arrow-right-circle" color="#666" size={20} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#333",
              marginLeft: 8,
              flex: 1,
            }}
          >
            Is billing address different from shipping address?
          </Text>
          <Switch
            value={isBillingDifferent}
            onValueChange={setIsBillingDifferent}
            trackColor={{ false: "#e0e0e0", true: "#007AFF" }}
            thumbColor={isBillingDifferent ? "#fff" : "#fff"}
          />
        </View>

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            color: "#666",
            marginBottom: 16,
          }}
        >
          Billing address will be the same as shipping address
        </Text>

        {isBillingDifferent && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Bold",
                color: "#333",
                marginBottom: 16,
              }}
            >
              Billing Address
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormField
                  label="First Name"
                  value={billingAddress.firstName}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, firstName: text })
                  }
                  placeholder="First Name"
                  icon="user"
                  required
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <FormField
                  label="Last Name"
                  value={billingAddress.lastName}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, lastName: text })
                  }
                  placeholder="Last Name"
                  required
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormField
                  label="Email"
                  value={billingAddress.email}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, email: text })
                  }
                  placeholder="Email"
                  keyboardType="email-address"
                  icon="mail"
                  required
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <FormField
                  label="Phone"
                  value={billingAddress.phone}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, phone: text })
                  }
                  placeholder="Phone"
                  keyboardType="numeric"
                  icon="phone"
                  required
                />
              </View>
            </View>

            <FormField
              label="Address Line 1"
              value={billingAddress.address1}
              onChangeText={(text) =>
                setBillingAddress({ ...billingAddress, address1: text })
              }
              placeholder="Address Line 1"
              icon="home"
              required
            />

            <FormField
              label="Address Line 2 (Optional)"
              value={billingAddress.address2 || ""}
              onChangeText={(text) =>
                setBillingAddress({ ...billingAddress, address2: text })
              }
              placeholder="Address Line 2 (Optional)"
              icon="home"
            />

            <FormField
              label="City"
              value={billingAddress.city}
              onChangeText={(text) =>
                setBillingAddress({ ...billingAddress, city: text })
              }
              placeholder="City"
              required
            />

            <View
              style={{
                flexDirection: "row",
                marginBottom: 16,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormField
                  label="State/Country"
                  value={billingAddress.state}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, state: text })
                  }
                  placeholder="State/Country"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <FormField
                  label="Postcode"
                  value={billingAddress.postcode}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, postcode: text })
                  }
                  placeholder="Postcode"
                  required
                />
              </View>
            </View>
          </>
        )}

        <View
          style={{
            backgroundColor: "#e3f2fd",
            borderRadius: 8,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather name="shield" color="#1976d2" size={16} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#1976d2",
              marginLeft: 8,
              flex: 1,
            }}
          >
            Your billing information is securely stored and only used for order
            processing.
          </Text>
        </View>
      </View>
    </View>
  );

  const PaymentInformationSection = () => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        margin: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 3,
      }}
    >
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: stepCompleted[2] ? "#34C759" : "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 16,
          }}
        >
          {stepCompleted[2] ? (
            <Feather name="check" color="#fff" size={20} />
          ) : (
            <Feather name="credit-card" color="#666" size={20} />
          )}
        </View>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            flex: 1,
          }}
        >
          Payment Information
        </Text>

        {stepCompleted[2] && (
          <View
            style={{
              backgroundColor: "#34C759",
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontFamily: "Poppins-Bold",
              }}
            >
              ✓
            </Text>
          </View>
        )}
      </View>

      {/* Section Content */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#333",
            marginBottom: 16,
          }}
        >
          Payment Method
        </Text>

        {/* Credit/Debit Card Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("card")}
          style={{
            backgroundColor: paymentMethod === "card" ? "#e3f2fd" : "#fff",
            borderRadius: 8,
            padding: 16,
            borderWidth: 1,
            borderColor: paymentMethod === "card" ? "#1976d2" : "#e0e0e0",
            marginBottom: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather
            name="credit-card"
            color={paymentMethod === "card" ? "#1976d2" : "#666"}
            size={20}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Bold",
                color: paymentMethod === "card" ? "#1976d2" : "#333",
              }}
            >
              Credit/Debit Card
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: paymentMethod === "card" ? "#1976d2" : "#666",
              }}
            >
              Visa, Mastercard, American Express
            </Text>
          </View>
          {paymentMethod === "card" && (
            <Feather name="check" color="#1976d2" size={20} />
          )}
        </TouchableOpacity>

        {/* Google Pay Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("googlepay")}
          style={{
            backgroundColor: paymentMethod === "googlepay" ? "#e3f2fd" : "#fff",
            borderRadius: 8,
            padding: 16,
            borderWidth: 1,
            borderColor: paymentMethod === "googlepay" ? "#1976d2" : "#e0e0e0",
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather
            name="smartphone"
            color={paymentMethod === "googlepay" ? "#1976d2" : "#666"}
            size={20}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Bold",
                color: paymentMethod === "googlepay" ? "#1976d2" : "#333",
              }}
            >
              Google Pay
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: paymentMethod === "googlepay" ? "#1976d2" : "#666",
              }}
            >
              Google Pay (availability will be checked at payment)
            </Text>
          </View>
          {paymentMethod === "googlepay" && (
            <Feather name="check" color="#1976d2" size={20} />
          )}
        </TouchableOpacity>

        {paymentMethod === "card" && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Bold",
                color: "#333",
                marginBottom: 16,
              }}
            >
              Card Details
            </Text>

            <FormField
              label="Cardholder Name"
              value={cardDetails.cardholderName}
              onChangeText={(text) =>
                setCardDetails({ ...cardDetails, cardholderName: text })
              }
              placeholder="Cardholder Name"
              icon="user"
              required
            />

            {cardDetails.cardholderName.trim() === "" && (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#666",
                  marginTop: -12,
                  marginBottom: 16,
                }}
              >
                Cardholder name is required
              </Text>
            )}

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Bold",
                color: "#333",
                marginBottom: 16,
              }}
            >
              Card Information
            </Text>

            <View
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <FormField
                label="Card Number"
                value={cardDetails.cardNumber}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, cardNumber: text })
                }
                placeholder="Card number"
                keyboardType="numeric"
              />

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FormField
                    label="Expiry Date"
                    value={cardDetails.expiryDate}
                    onChangeText={(text) =>
                      setCardDetails({ ...cardDetails, expiryDate: text })
                    }
                    placeholder="MM/YY"
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <FormField
                    label="CVC"
                    value={cardDetails.cvc}
                    onChangeText={(text) =>
                      setCardDetails({ ...cardDetails, cvc: text })
                    }
                    placeholder="CVC"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <FormField
                label="Country"
                value={cardDetails.country}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, country: text })
                }
                placeholder="Country"
              />

              <FormField
                label="ZIP Code"
                value={cardDetails.zipCode}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, zipCode: text })
                }
                placeholder="ZIP Code"
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        <View
          style={{
            backgroundColor: "#e3f2fd",
            borderRadius: 8,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather name="shield" color="#1976d2" size={16} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#1976d2",
              marginLeft: 8,
              flex: 1,
            }}
          >
            Your payment information is securely processed by Stripe and never
            stored on our servers.
          </Text>
        </View>
      </View>
    </View>
  );

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
            Checkout All Items
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
          Checkout All Items
        </Text>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* Order Summary */}
        <OrderSummaryCard />

        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* Shipping Address */}
        <ShippingAddressSection />

        {/* Billing Details */}
        <BillingDetailsSection />

        {/* Payment Information */}
        <PaymentInformationSection />
      </ScrollView>

      {/* Bottom Action Button */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        }}
      >
        <TouchableOpacity
          onPress={processCheckout}
          style={{
            backgroundColor: canProceedToCheckout() ? "#000" : "#ff9500",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
            }}
          >
            {canProceedToCheckout()
              ? "Complete Order"
              : "Complete Required Fields"}
          </Text>
          {!canProceedToCheckout() && (
            <Text
              style={{
                color: "#fff",
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {getValidationMessage()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
