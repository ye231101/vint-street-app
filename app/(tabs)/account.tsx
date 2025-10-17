import { useAuth } from "@/providers/auth-provider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { logout, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  const showLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Profile Header Section */}
        <View style={{ padding: 16, paddingTop: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Profile Avatar */}
            <View style={{
              width: 70,
              height: 70,
              backgroundColor: "#333",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            
            {/* User Info */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontFamily: "Poppins-Bold", 
                  color: "#fff" 
                }}>
                  {user?.firstName || user?.username || "Guest User"}
                </Text>
                <Ionicons name="bag-outline" size={24} color="#fff" />
              </View>
              <Text style={{ 
                fontSize: 14, 
                fontFamily: "Poppins-Regular", 
                color: "#999",
                marginTop: 4 
              }}>
                {user?.email || "Not signed in"}
              </Text>
              <Pressable style={{ marginTop: 4 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontFamily: "Poppins-Regular", 
                  color: "#007AFF" 
                }}>
                  Edit Profile
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#333", marginHorizontal: 16, marginVertical: 16 }} />

        {/* Seller Hub Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Poppins-Bold",
            color: "#999",
            marginLeft: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            SELLER HUB
          </Text>
          
          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="storefront-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Seller Dashboard
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="card-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Payment Setup
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#333", marginHorizontal: 16, marginVertical: 16 }} />

        {/* Shopping Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Poppins-Bold",
            color: "#999",
            marginLeft: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            SHOPPING
          </Text>
          
          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="car-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Orders
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="heart-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Favourites
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="card-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Payment Methods
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="location-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Addresses
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#333", marginHorizontal: 16, marginVertical: 16 }} />

        {/* Support Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Poppins-Bold",
            color: "#999",
            marginLeft: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            SUPPORT
          </Text>
          
          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Help Center
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Contact Support
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#333", marginHorizontal: 16, marginVertical: 16 }} />

        {/* Settings Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            fontFamily: "Poppins-Bold",
            color: "#999",
            marginLeft: 16,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            SETTINGS
          </Text>
          
          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              App Settings
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Privacy & Security
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </Pressable>

          <Pressable 
            onPress={showLogoutConfirmation}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff4444" />
            <Text style={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#fff",
              marginLeft: 16,
              flex: 1,
            }}>
              Logout
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            width: '100%',
            maxWidth: 320,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Poppins-Bold',
              color: '#000',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              Logout
            </Text>
            
            <Text style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: '#666',
              marginBottom: 24,
              textAlign: 'center',
              lineHeight: 22,
            }}>
              Are you sure you want to logout?
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 12,
            }}>
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: '#666',
                }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleLogout}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#ff4444',
                }}>
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
