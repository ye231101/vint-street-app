import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppSettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  const handleClearData = () => {
    Alert.alert('Success', 'App data has been cleared successfully.');
    setShowClearDataModal(false);
  };

  const SettingsSwitch = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: '#999',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {subtitle}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#333', true: '#007AFF' }}
          thumbColor={value ? '#fff' : '#999'}
        />
      </View>
    </View>
  );

  const SettingsDropdown = ({
    title,
    value,
    onPress,
  }: {
    title: string;
    value: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          fontFamily: 'Poppins-Bold',
        }}
      >
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#999',
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
            marginRight: 8,
          }}
        >
          {value}
        </Text>
        <Feather name="chevron-down" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );

  const InfoTile = ({ title, value }: { title: string; value: string }) => (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 16,
          fontFamily: 'Poppins-Bold',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: '#999',
          fontSize: 14,
          fontFamily: 'Poppins-Regular',
        }}
      >
        {value}
      </Text>
    </View>
  );

  const InlineDropdown = ({
    items,
    selectedValue,
    onSelect,
    visible,
    onClose,
    topPosition = 200,
  }: {
    items: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    visible: boolean;
    onClose: () => void;
    topPosition?: number;
  }) => {
    if (!visible) return null;

    return (
      <View
        style={{
          position: 'absolute',
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
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
          onPress={onClose}
          activeOpacity={1}
        />
        {/* Dropdown positioned to the right */}
        <View
          style={{
            position: 'absolute',
            top: topPosition,
            right: 16,
            backgroundColor: '#333',
            borderRadius: 8,
            minWidth: 120,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: index < items.length - 1 ? 1 : 0,
                borderBottomColor: '#444',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: selectedValue === item ? '#007AFF' : '#fff',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                {item}
              </Text>
              {selectedValue === item && <Feather name="check" size={16} color="#007AFF" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const DropdownModal = ({
    visible,
    onClose,
    title,
    items,
    selectedValue,
    onSelect,
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    items: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
  }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#1C1C1E',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
              }}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: index < items.length - 1 ? 1 : 0,
                borderBottomColor: '#333',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: selectedValue === item ? '#007AFF' : '#fff',
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                {item}
              </Text>
              {selectedValue === item && <Feather name="check" size={20} color="#007AFF" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#000',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontFamily: 'Poppins-Bold',
            color: '#fff',
          }}
        >
          App Settings
        </Text>
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Notifications Section */}
          <View style={{ marginTop: 16 }}>
            <Text
              style={{
                color: '#999',
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                marginLeft: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              NOTIFICATIONS
            </Text>

            <SettingsSwitch
              title="Push Notifications"
              subtitle="Receive push notifications for updates"
              value={pushNotifications}
              onValueChange={setPushNotifications}
            />

            <SettingsSwitch
              title="Email Notifications"
              subtitle="Receive email updates and newsletters"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
            />
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333',
              marginHorizontal: 16,
              marginVertical: 16,
            }}
          />

          {/* Appearance Section */}
          <View>
            <Text
              style={{
                color: '#999',
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                marginLeft: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              APPEARANCE
            </Text>

            <SettingsSwitch
              title="Dark Mode"
              subtitle="Use dark theme throughout the app"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333',
              marginHorizontal: 16,
              marginVertical: 16,
            }}
          />

          {/* Language & Region Section */}
          <View>
            <Text
              style={{
                color: '#999',
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                marginLeft: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              LANGUAGE & REGION
            </Text>

            <SettingsDropdown
              title="Language"
              value={selectedLanguage}
              onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
            />

            <SettingsDropdown
              title="Currency"
              value={selectedCurrency}
              onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            />
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333',
              marginHorizontal: 16,
              marginVertical: 16,
            }}
          />

          {/* App Info Section */}
          <View>
            <Text
              style={{
                color: '#999',
                fontSize: 12,
                fontFamily: 'Poppins-Bold',
                marginLeft: 16,
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              APP INFO
            </Text>

            <InfoTile title="Version" value="1.0.0 (Build 123)" />

            <InfoTile title="Device ID" value="VS-12345-ABCD" />
          </View>

          {/* Clear Data Button */}
          <View style={{ padding: 16 }}>
            <TouchableOpacity
              onPress={() => setShowClearDataModal(true)}
              style={{
                backgroundColor: '#FF3B30',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                }}
              >
                Clear App Data
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Inline Language Dropdown */}
        <InlineDropdown
          items={languages}
          selectedValue={selectedLanguage}
          onSelect={setSelectedLanguage}
          visible={showLanguageDropdown}
          onClose={() => setShowLanguageDropdown(false)}
          topPosition={200}
        />

        {/* Inline Currency Dropdown */}
        <InlineDropdown
          items={currencies}
          selectedValue={selectedCurrency}
          onSelect={setSelectedCurrency}
          visible={showCurrencyDropdown}
          onClose={() => setShowCurrencyDropdown(false)}
          topPosition={250}
        />
      </View>

      {/* Clear Data Confirmation Modal */}
      <Modal
        visible={showClearDataModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClearDataModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#1C1C1E',
              borderRadius: 12,
              padding: 20,
              margin: 20,
              width: '90%',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
                marginBottom: 12,
              }}
            >
              Clear App Data
            </Text>
            <Text
              style={{
                color: '#999',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                marginBottom: 20,
              }}
            >
              This will clear all app data including saved preferences. This action cannot be
              undone.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setShowClearDataModal(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearData}>
                <Text style={{ color: '#FF3B30', fontSize: 16 }}>Clear Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
