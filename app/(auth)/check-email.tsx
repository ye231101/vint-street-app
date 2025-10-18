import { authService } from '@/api';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const password = params.password as string; // We'll pass this from registration

  const [resendLoading, setResendLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Poll for email confirmation status
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let attemptCount = 0;
    const MAX_ATTEMPTS = 200; // Poll for ~10 minutes (200 * 3 seconds)

    const checkEmailConfirmation = async () => {
      if (isConfirmed) {
        clearInterval(interval);
        return;
      }

      try {
        setCheckingStatus(true);
        attemptCount++;

        // First, try to get existing session
        const { session: existingSession } = await authService.getSession();

        if (existingSession) {
          // Session exists! User is confirmed
          clearInterval(interval);
          setIsConfirmed(true);

          // Auto redirect after 1 second
          setTimeout(() => router.replace('/(tabs)'), 1000);
          return;
        }

        // If no session, try to sign in (this will work if email is confirmed)
        if (password) {
          const { session: newSession, error } = await authService.signIn({
            email,
            password,
          });

          if (newSession && !error) {
            // Sign in successful! Email must be confirmed
            clearInterval(interval);
            setIsConfirmed(true);

            // Auto redirect after 1 second
            setTimeout(() => router.replace('/(tabs)'), 1000);
            return;
          }
        }

        // Stop polling after max attempts
        if (attemptCount >= MAX_ATTEMPTS) {
          clearInterval(interval);
          setCheckingStatus(false);
        }
      } catch (error) {
        console.log('Error checking email confirmation:', error);
      } finally {
        if (attemptCount < MAX_ATTEMPTS) {
          setCheckingStatus(attemptCount % 2 === 0); // Blink the indicator
        }
      }
    };

    // Check immediately
    checkEmailConfirmation();

    // Then check every 3 seconds
    interval = setInterval(checkEmailConfirmation, 3000);

    // Cleanup on unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [router, email, password, isConfirmed]);

  const handleResendEmail = async () => {
    setResendLoading(true);

    try {
      const { success, error } = await authService.resendOTP(email, 'signup');

      if (error || !success) {
        Alert.alert('Error', error || 'Failed to resend confirmation email');
        return;
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              width: '100%',
              paddingTop: 10,
            }}
          >
            <Pressable onPress={() => router.replace('/(auth)')} hitSlop={8}>
              <Feather name="arrow-left" size={24} color="black" />
            </Pressable>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                flex: 1,
                textAlign: 'center',
                marginRight: 24,
              }}
            >
              Check Your Email
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: '100%', maxWidth: 520, alignItems: 'center' }}>
              {/* Logo */}
              <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <Image
                  source={require('@/assets/images/splash-logo.png')}
                  style={{ width: 160, height: 160, resizeMode: 'contain' }}
                />
              </View>

              {/* Success Icon */}
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#e8f5e9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 32,
                }}
              >
                <Feather name="mail" size={50} color="#4CAF50" />
              </View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: 'Poppins-Bold',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Verify Your Email
              </Text>

              {/* Description */}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',
                  color: '#666',
                  lineHeight: 24,
                  marginBottom: 8,
                }}
              >
                We've sent a confirmation link to
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                  color: '#000',
                  marginBottom: 32,
                }}
              >
                {email}
              </Text>

              {/* Instructions */}
              <View
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: 20,
                  borderRadius: 12,
                  marginBottom: 24,
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                    color: '#333',
                    lineHeight: 22,
                  }}
                >
                  Click the link in the email to confirm your account and get started.
                </Text>
              </View>

              {/* Checking Status Indicator */}
              {!isConfirmed && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    padding: 12,
                    backgroundColor: checkingStatus ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: 8,
                  }}
                >
                  <Feather
                    name="refresh-cw"
                    size={16}
                    color={checkingStatus ? '#1976d2' : '#999'}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: checkingStatus ? '#1976d2' : '#999',
                    }}
                  >
                    Waiting for email confirmation...
                  </Text>
                </View>
              )}

              {/* Confirmed Status Indicator */}
              {isConfirmed && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    padding: 12,
                    backgroundColor: '#e8f5e9',
                    borderRadius: 8,
                  }}
                >
                  <Feather
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      color: '#4CAF50',
                    }}
                  >
                    Email confirmed! Redirecting...
                  </Text>
                </View>
              )}

              {/* Helpful Tips */}
              <View style={{ width: '100%', marginBottom: 32 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <Feather
                    name="info"
                    size={18}
                    color="#666"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: '#666',
                      lineHeight: 20,
                    }}
                  >
                    Check your spam or junk folder if you don't see the email
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <Feather
                    name="info"
                    size={18}
                    color="#666"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: '#666',
                      lineHeight: 20,
                    }}
                  >
                    The confirmation link will expire in 24 hours
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                  }}
                >
                  <Feather
                    name="info"
                    size={18}
                    color="#666"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: '#666',
                      lineHeight: 20,
                    }}
                  >
                    After clicking the link, return to this screen and you'll be automatically
                    signed in
                  </Text>
                </View>
              </View>

              {/* Important Note for Mobile */}
              <View
                style={{
                  backgroundColor: '#fff3e0',
                  padding: 16,
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: '#ff9800',
                  marginBottom: 32,
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#e65100',
                    marginBottom: 8,
                  }}
                >
                  📱 Mobile Users:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    color: '#e65100',
                    lineHeight: 18,
                  }}
                >
                  Click the link in your email, then come back to this app. We'll automatically
                  detect your confirmation and sign you in!
                </Text>
              </View>

              {/* Resend Email Button */}
              <Pressable
                onPress={handleResendEmail}
                disabled={resendLoading}
                style={{
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: resendLoading ? '#9e9e9e' : '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#fff',
                    fontSize: 16,
                  }}
                >
                  {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                </Text>
              </Pressable>

              {/* Return to Login */}
              <Pressable onPress={() => router.replace('/(auth)')}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    color: '#666',
                    fontSize: 15,
                  }}
                >
                  Return to Login
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
