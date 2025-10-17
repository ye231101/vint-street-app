import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stockManagement, setStockManagement] = useState(false);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [productStatus, setProductStatus] = useState("Published");
  const [visibility, setVisibility] = useState("Visible");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const categories = [
    "Men's",
    "Women's",
    "Junior's",
    "Footwear",
    "Games",
    "Consoles",
    "Music",
    "Trading Cards",
    "Collectibles",
    "Uncategorised",
  ];

  const statusOptions = ["Published", "Draft"];
  const visibilityOptions = ["Visible", "Hidden"];

  const handleSaveDraft = () => {
    Alert.alert("Draft Saved", "Your item has been saved as draft.");
  };

  const handlePublishItem = () => {
    if (!title || !description || !price || !category) {
      Alert.alert(
        "Required Fields",
        "Please complete all required fields (*) to publish this product."
      );
      return;
    }
    Alert.alert("Item Published", "Your item has been published successfully!");
  };

  const handleGalleryPress = async () => {
    try {
      // Request permission for gallery access
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access photo library is required!"
        );
        return;
      }

      // Open gallery to pick multiple images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: true,
        quality: 1,
        allowsEditing: true,
        aspect: [3, 4], // Portrait aspect ratio
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...newImages]);
        Alert.alert(
          "Success",
          `${newImages.length} image(s) selected from gallery`
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access images. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  const handleCameraPress = async () => {
    try {
      // Request permission for camera access
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera is required!"
        );
        return;
      }

      // Open camera to take a photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 1,
        allowsEditing: true,
        aspect: [3, 4], // Portrait aspect ratio
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const newImage = result.assets[0].uri;
        setSelectedImages((prev) => [...prev, newImage]);
        Alert.alert("Success", "Photo taken successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to access camera. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  const handleImageSourceSelection = (source: "gallery" | "camera") => {
    setShowImageSourceModal(false);
    if (source === "gallery") {
      handleGalleryPress();
    } else {
      handleCameraPress();
    }
  };

  // Track if there are unsaved changes
  const checkForUnsavedChanges = () => {
    const hasChanges = Boolean(
      title ||
        description ||
        price ||
        brand ||
        category ||
        purchaseNote ||
        selectedImages.length > 0 ||
        stockManagement
    );
    setHasUnsavedChanges(hasChanges);
    return hasChanges;
  };

  // Handle navigation away with unsaved changes
  const handleNavigationAway = () => {
    if (checkForUnsavedChanges()) {
      setShowUnsavedChangesModal(true);
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  };

  // Handle continue without saving
  const handleContinueWithoutSaving = () => {
    setShowUnsavedChangesModal(false);
    setHasUnsavedChanges(false);
    // Clear all form data
    setTitle("");
    setDescription("");
    setPrice("");
    setBrand("");
    setCategory("");
    setPurchaseNote("");
    setSelectedImages([]);
    setStockManagement(false);
    // Navigate away (this would be handled by the navigation system)
  };

  // Handle cancel - stay on page
  const handleCancelNavigation = () => {
    setShowUnsavedChangesModal(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#000",
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleNavigationAway}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Feather
            name="arrow-left"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins-Bold",
              color: "#fff",
            }}
          >
            Sell an item
          </Text>
        </TouchableOpacity>
        <Feather name="shopping-bag" size={24} color="#fff" />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            setShowStatusDropdown(false);
            setShowVisibilityDropdown(false);
          }}
        >
          <View style={{ padding: 16 }}>
            {/* Add Photos Section */}
            {selectedImages.length === 0 ? (
              <TouchableOpacity
                style={{
                  height: 200,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  borderStyle: "dashed",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
                onPress={() => setShowImageSourceModal(true)}
              >
                <Feather name="image" size={48} color="#999" />
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#999",
                    marginTop: 8,
                  }}
                >
                  Add Photos
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ marginBottom: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} style={{ position: "relative" }}>
                      <Image
                        source={{ uri: imageUri }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 8,
                          backgroundColor: "#f0f0f0",
                        }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setSelectedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <Feather name="x" size={14} color="#fff" />
                      </TouchableOpacity>
                      {index === 0 && (
                        <View
                          style={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontFamily: "Poppins-SemiBold",
                            }}
                          >
                            Main
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e0e0e0",
                      borderStyle: "dashed",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => setShowImageSourceModal(true)}
                  >
                    <Feather name="plus" size={24} color="#999" />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#666",
                    marginTop: 8,
                    fontStyle: "italic",
                  }}
                >
                  Drag to reorder. First image will be the main product image.
                </Text>
              </View>
            )}

            {/* Information Box */}
            <View
              style={{
                backgroundColor: "#e3f2fd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Feather name="info" size={20} color="#1976d2" />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#1976d2",
                    marginBottom: 4,
                  }}
                >
                  Creating New Product
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#1976d2",
                  }}
                >
                  Fields marked with * are required. You can save as draft or
                  publish directly.
                </Text>
              </View>
            </View>

            {/* Title Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Title *
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
                placeholder="Enter item title"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Description *
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  height: 100,
                  textAlignVertical: "top",
                }}
                placeholder="Enter item description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Price Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Price *
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#e0e0e0",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    flex: 1,
                  }}
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Brand Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Brand
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                }}
                placeholder="Enter brand name (API brands not loaded)"
                value={brand}
                onChangeText={setBrand}
              />
              <View
                style={{
                  backgroundColor: "#fff3cd",
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather name="alert-circle" size={16} color="#856404" />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#856404",
                    marginLeft: 4,
                  }}
                >
                  Brand API not responding. Using text input as fallback.
                </Text>
              </View>
            </View>

            {/* Category Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Category
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: category ? "#000" : "#999",
                  }}
                >
                  {category || "Select Category"}
                </Text>
                <Feather name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Stock Management Section */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  marginBottom: 16,
                }}
              >
                Stock Management
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: stockManagement ? "#000" : "#ccc",
                    borderRadius: 4,
                    backgroundColor: stockManagement ? "#000" : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                  onPress={() => setStockManagement(!stockManagement)}
                >
                  {stockManagement && (
                    <Feather name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-Regular",
                    color: "#000",
                  }}
                >
                  Enable stock management
                </Text>
              </View>
            </View>

            {/* Purchase Note Field */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-SemiBold",
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                Purchase Note
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#e0e0e0",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  height: 80,
                  textAlignVertical: "top",
                }}
                placeholder="Customer will get this info in their order email"
                value={purchaseNote}
                onChangeText={setPurchaseNote}
                multiline
              />
            </View>

            {/* Product Status Section */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  marginBottom: 16,
                }}
              >
                Product Status
              </Text>

              {/* Status Dropdown */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                    marginBottom: 8,
                  }}
                >
                  Status
                </Text>
                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e0e0e0",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowVisibilityDropdown(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#000",
                      }}
                    >
                      {productStatus}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>

                  {showStatusDropdown && (
                    <View
                      style={{
                        position: "absolute",
                        top: 45,
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#e0e0e0",
                        zIndex: 1000,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                      }}
                    >
                      {statusOptions.map((status, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            borderBottomWidth:
                              index < statusOptions.length - 1 ? 1 : 0,
                            borderBottomColor: "#f0f0f0",
                            backgroundColor:
                              status === productStatus
                                ? "#f5f5f5"
                                : "transparent",
                          }}
                          onPress={(e) => {
                            e.stopPropagation();
                            setProductStatus(status);
                            setShowStatusDropdown(false);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "Poppins-Regular",
                              color: "#000",
                            }}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Visibility Dropdown */}
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                    marginBottom: 8,
                  }}
                >
                  Visibility
                </Text>
                <View style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#e0e0e0",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowVisibilityDropdown(!showVisibilityDropdown);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#000",
                      }}
                    >
                      {visibility}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#999" />
                  </TouchableOpacity>

                  {showVisibilityDropdown && (
                    <View
                      style={{
                        position: "absolute",
                        top: 45,
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#e0e0e0",
                        zIndex: 1000,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                      }}
                    >
                      {visibilityOptions.map((vis, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 12,
                            borderBottomWidth:
                              index < visibilityOptions.length - 1 ? 1 : 0,
                            borderBottomColor: "#f0f0f0",
                            backgroundColor:
                              vis === visibility ? "#f5f5f5" : "transparent",
                          }}
                          onPress={(e) => {
                            e.stopPropagation();
                            setVisibility(vis);
                            setShowVisibilityDropdown(false);
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "Poppins-Regular",
                              color: "#000",
                            }}
                          >
                            {vis}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  marginRight: 8,
                  alignItems: "center",
                }}
                onPress={handleSaveDraft}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                  }}
                >
                  Save as Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  marginLeft: 8,
                  alignItems: "center",
                }}
                onPress={handlePublishItem}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                  }}
                >
                  Publish Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Warning Message */}
            <View
              style={{
                backgroundColor: "#fff3cd",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather name="alert-circle" size={20} color="#856404" />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#856404",
                  marginLeft: 8,
                  flex: 1,
                }}
              >
                Complete all required fields (*) to publish this product
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 8,
              paddingHorizontal: 20,
              paddingBottom: 20,
              maxHeight: "80%",
            }}
          >
            {/* Modal Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "#e0e0e0",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                }}
              >
                Select Category
              </Text>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(false)}
                style={{
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="x" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f0f0f0",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Poppins-Regular",
                      color: "#000",
                    }}
                  >
                    {cat}
                  </Text>
                  <Feather name="chevron-right" size={16} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Source Selection Modal */}
      <Modal
        visible={showImageSourceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Add Photos
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: "#666",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Choose multiple images or take a photo
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {/* Gallery Option */}
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  paddingVertical: 20,
                  paddingHorizontal: 30,
                }}
                onPress={() => handleImageSourceSelection("gallery")}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Feather name="image" size={36} color="#333" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#333",
                  }}
                >
                  Gallery
                </Text>
              </TouchableOpacity>

              {/* Camera Option */}
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  paddingVertical: 20,
                  paddingHorizontal: 30,
                }}
                onPress={() => handleImageSourceSelection("camera")}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Feather name="camera" size={36} color="#333" />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#333",
                  }}
                >
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        visible={showUnsavedChangesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelNavigation}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 320,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                color: "#000",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Unsaved Changes
            </Text>

            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: "#666",
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Your changes will be lost if you leave this page. Do you want to
              continue?
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={handleCancelNavigation}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#ff4444",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
                onPress={handleContinueWithoutSaving}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#fff",
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
