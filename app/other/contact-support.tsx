import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactSupportScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Order Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const supportCategories = [
    "Order Issue",
    "Payment Problem",
    "Account Access",
    "Technical Issue",
    "Product Question",
    "Other",
  ];

  const handleSubmitRequest = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please describe your issue");
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert("Error", "Please provide more details");
      return;
    }

    setIsSubmitting(true);

    try {
      const subject = `Support Request: ${selectedCategory}`;
      const body = `Hello Vint Street Support Team,

I need assistance with the following issue:

Category: ${selectedCategory}

Description:
${message.trim()}

Please get back to me as soon as possible.

Thank you,
[Your Name]`;

      const emailUri = `mailto:support@vintstreet.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(emailUri);
      if (canOpen) {
        await Linking.openURL(emailUri);

        Alert.alert(
          "Email App Launched",
          "Your default email app has been opened with a pre-filled message to our support team. Please review and send the email.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Email App Not Found",
          "No email app was found on your device. Please manually send an email to support@vintstreet.com with your support request."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `An error occurred while trying to open your email app: ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickEmail = async () => {
    try {
      const emailUri = `mailto:support@vintstreet.com?subject=${encodeURIComponent(
        "Support Request"
      )}&body=${encodeURIComponent(`Hello Vint Street Support Team,

I need assistance with an issue.

Please get back to me as soon as possible.

Thank you,
[Your Name]`)}`;

      const canOpen = await Linking.canOpenURL(emailUri);
      if (canOpen) {
        await Linking.openURL(emailUri);
      } else {
        Alert.alert("Error", "No email app found on your device");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open email app: ${error}`);
    }
  };

  const handleEmailContact = async () => {
    try {
      const emailUri = `mailto:support@vintstreet.com?subject=${encodeURIComponent(
        "Support Request"
      )}&body=${encodeURIComponent(`Hello Vint Street Support Team,

I need assistance with an issue.

Please get back to me as soon as possible.

Thank you,
[Your Name]`)}`;

      const canOpen = await Linking.canOpenURL(emailUri);
      if (canOpen) {
        await Linking.openURL(emailUri);
      } else {
        Alert.alert("Error", "No email app found on your device");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open email app: ${error}`);
    }
  };

  const handlePhoneContact = async () => {
    try {
      const phoneUri = "tel:1-800-VINT-STREET";
      const canOpen = await Linking.canOpenURL(phoneUri);
      if (canOpen) {
        await Linking.openURL(phoneUri);
      } else {
        Alert.alert("Error", "Unable to make phone call");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open phone app: ${error}`);
    }
  };

  const CategoryDropdown = () => {
    if (!showCategoryDropdown) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onPress={() => setShowCategoryDropdown(false)}
          activeOpacity={1}
        />
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 16,
            right: 16,
            backgroundColor: "#333",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {supportCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedCategory(category);
                setShowCategoryDropdown(false);
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: index < supportCategories.length - 1 ? 1 : 0,
                borderBottomColor: "#444",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: selectedCategory === category ? "#007AFF" : "#fff",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
              >
                {category}
              </Text>
              {selectedCategory === category && (
                <Feather name="check" size={16} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const ContactMethod = ({
    icon,
    title,
    value,
    isTappable = false,
    onPress,
  }: {
    icon: string;
    title: string;
    value: string;
    isTappable?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={isTappable ? onPress : undefined}
      disabled={!isTappable}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
      }}
    >
      <Feather name={icon as any} color="#999" size={20} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text
          style={{
            color: "#999",
            fontSize: 12,
            fontFamily: "Poppins-Regular",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: isTappable ? "#007AFF" : "#fff",
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            textDecorationLine: isTappable ? "underline" : "none",
          }}
        >
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          Contact Support
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Support Categories */}
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              marginBottom: 8,
            }}
          >
            What can we help you with?
          </Text>

          <TouchableOpacity
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontFamily: "Poppins-Regular",
              }}
            >
              {selectedCategory}
            </Text>
            <Feather name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>

          <View style={{ height: 24 }} />

          {/* Message Field */}
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              marginBottom: 8,
            }}
          >
            Describe your issue
          </Text>

          <TextInput
            value={message}
            onChangeText={setMessage}
            style={{
              backgroundColor: "#333",
              borderRadius: 12,
              padding: 16,
              color: "#fff",
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              textAlignVertical: "top",
              minHeight: 120,
            }}
            placeholder="Please provide as much detail as possible..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
          />

          <View style={{ height: 24 }} />

          {/* Quick Email Button */}
          <TouchableOpacity
            onPress={handleQuickEmail}
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#007AFF",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#007AFF",
                fontSize: 16,
                fontFamily: "Poppins-Bold",
              }}
            >
              Send Quick Email
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitRequest}
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? "#666" : "#007AFF",
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {isSubmitting ? (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Submitting...
              </Text>
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                }}
              >
                Submit Request
              </Text>
            )}
          </TouchableOpacity>

          {/* Contact Info Card */}
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
                marginBottom: 12,
              }}
            >
              <Feather name="info" size={20} color="#007AFF" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  marginLeft: 8,
                }}
              >
                Other Ways to Contact Us
              </Text>
            </View>

            <ContactMethod
              icon="mail"
              title="Email"
              value="support@vintstreet.com"
              isTappable
              onPress={handleEmailContact}
            />

            <View style={{ height: 8 }} />

            <ContactMethod
              icon="phone"
              title="Phone"
              value="1-800-VINT-STREET"
              isTappable
              onPress={handlePhoneContact}
            />

            <View style={{ height: 8 }} />

            <ContactMethod
              icon="clock"
              title="Hours"
              value="Mon-Fri, 9:00 AM - 6:00 PM EST"
            />
          </View>
        </View>
      </ScrollView>

      {/* Category Dropdown */}
      <CategoryDropdown />
    </SafeAreaView>
  );
}
