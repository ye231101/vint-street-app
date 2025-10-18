import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySecurityScreen() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  // Modal states
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDownloadDataModal, setShowDownloadDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTwoFactorToggle = (value: boolean) => {
    setTwoFactorAuth(value);
    if (value) {
      setShowTwoFactorModal(true);
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleDownloadData = () => {
    setShowDownloadDataModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const confirmChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setShowChangePasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const confirmDownloadData = () => {
    Alert.alert(
      'Success',
      "Data download request submitted. You'll receive an email within 48 hours."
    );
    setShowDownloadDataModal(false);
  };

  const confirmDeleteAccount = () => {
    Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
    setShowDeleteAccountModal(false);
    // Navigate back to login or home
    router.replace('/(auth)');
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

  const SettingsItem = ({ title, onPress }: { title: string; onPress: () => void }) => (
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
      <Feather name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
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
          Privacy & Security
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Security Section */}
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
            SECURITY
          </Text>

          <SettingsSwitch
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security to your account"
            value={twoFactorAuth}
            onValueChange={handleTwoFactorToggle}
          />

          <SettingsSwitch
            title="Biometric Login"
            subtitle="Use fingerprint or face recognition to log in"
            value={biometricLogin}
            onValueChange={setBiometricLogin}
          />

          <SettingsItem title="Change Password" onPress={handleChangePassword} />
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

        {/* Privacy Section */}
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
            PRIVACY
          </Text>

          <SettingsSwitch
            title="Location Services"
            subtitle="Allow app to access your location"
            value={locationServices}
            onValueChange={setLocationServices}
          />

          <SettingsSwitch
            title="Activity Status"
            subtitle="Show when you're active on the app"
            value={activityStatus}
            onValueChange={setActivityStatus}
          />

          <SettingsSwitch
            title="Profile Visibility"
            subtitle="Make your profile visible to other users"
            value={profileVisibility}
            onValueChange={setProfileVisibility}
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

        {/* Data & Privacy Section */}
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
            DATA & PRIVACY
          </Text>

          <SettingsItem
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content')}
          />

          <SettingsItem
            title="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service content')}
          />

          <SettingsItem title="Download My Data" onPress={handleDownloadData} />
        </View>

        {/* Delete Account Button */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={handleDeleteAccount}
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
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Two-Factor Authentication Modal */}
      <Modal
        visible={showTwoFactorModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTwoFactorModal(false)}
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
              Set Up Two-Factor Authentication
            </Text>
            <Text
              style={{
                color: '#999',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                marginBottom: 20,
              }}
            >
              We'll send you a verification code via SMS when you log in from a new device.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  setTwoFactorAuth(false);
                  setShowTwoFactorModal(false);
                }}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTwoFactorModal(false)}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePasswordModal(false)}
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
                marginBottom: 20,
              }}
            >
              Change Password
            </Text>

            <TextInput
              style={{
                backgroundColor: '#333',
                borderRadius: 8,
                padding: 12,
                color: '#fff',
                marginBottom: 12,
                fontFamily: 'Poppins-Regular',
              }}
              placeholder="Current Password"
              placeholderTextColor="#999"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <TextInput
              style={{
                backgroundColor: '#333',
                borderRadius: 8,
                padding: 12,
                color: '#fff',
                marginBottom: 12,
                fontFamily: 'Poppins-Regular',
              }}
              placeholder="New Password"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <TextInput
              style={{
                backgroundColor: '#333',
                borderRadius: 8,
                padding: 12,
                color: '#fff',
                marginBottom: 20,
                fontFamily: 'Poppins-Regular',
              }}
              placeholder="Confirm New Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setShowChangePasswordModal(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmChangePassword}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Download Data Modal */}
      <Modal
        visible={showDownloadDataModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDownloadDataModal(false)}
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
              Download My Data
            </Text>
            <Text
              style={{
                color: '#999',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                marginBottom: 20,
              }}
            >
              We'll prepare your data and send it to your registered email address. This may take up
              to 48 hours.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setShowDownloadDataModal(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDownloadData}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Request Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteAccountModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteAccountModal(false)}
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
              Delete Account
            </Text>
            <Text
              style={{
                color: '#999',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                marginBottom: 20,
              }}
            >
              This action cannot be undone. All your data will be permanently deleted.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setShowDeleteAccountModal(false)}
                style={{ marginRight: 16 }}
              >
                <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDeleteAccount}>
                <Text style={{ color: '#FF3B30', fontSize: 16 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
