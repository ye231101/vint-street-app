import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpCenterScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const popularTopics = [
    {
      icon: 'truck',
      title: 'Orders & Shipping',
      subtitle: 'Track orders, shipping info, returns',
      onPress: () => {
        Alert.alert('Orders & Shipping', 'Navigate to Orders & Shipping help section');
      },
    },
    {
      icon: 'credit-card',
      title: 'Payments & Refunds',
      subtitle: 'Payment methods, refund process',
      onPress: () => {
        Alert.alert('Payments & Refunds', 'Navigate to Payments & Refunds help section');
      },
    },
    {
      icon: 'user',
      title: 'Account & Profile',
      subtitle: 'Account settings, profile management',
      onPress: () => {
        Alert.alert('Account & Profile', 'Navigate to Account & Profile help section');
      },
    },
  ];

  const faqItems = [
    {
      question: 'How do I return an item?',
      answer:
        "You can initiate a return within 14 days of delivery. Go to Orders, select the item, and click 'Return Item' to start the process.",
    },
    {
      question: 'When will I receive my refund?',
      answer:
        'Refunds are typically processed within 5-7 business days after we receive your return.',
    },
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order in the Orders section of your account. Click on the specific order to view its current status and tracking information.',
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Search', `Searching for: ${searchQuery}`);
    }
  };

  const handleContactSupport = () => {
    router.push('/other/contact-support' as any);
  };

  const toggleFAQ = (question: string) => {
    setExpandedFAQ(expandedFAQ === question ? null : question);
  };

  const HelpTopic = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
      }}
    >
      <Feather name={icon as any} color="#fff" size={24} />
      <View style={{ marginLeft: 16, flex: 1 }}>
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
      <Feather name="chevron-right" size={16} color="#999" />
    </TouchableOpacity>
  );

  const FAQItem = ({
    question,
    answer,
    isExpanded,
    onToggle,
  }: {
    question: string;
    answer: string;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <View>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontFamily: 'Poppins-Regular',
            flex: 1,
          }}
        >
          {question}
        </Text>
        <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#999" />
      </TouchableOpacity>
      {isExpanded && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 12,
          }}
        >
          <Text
            style={{
              color: '#999',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              lineHeight: 20,
            }}
          >
            {answer}
          </Text>
        </View>
      )}
    </View>
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
            fontFamily: 'Poppins-Bold',
            color: '#fff',
          }}
        >
          Help Center
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Search Bar */}
          <View
            style={{
              backgroundColor: '#333',
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              marginBottom: 24,
            }}
          >
            <Feather name="search" size={20} color="#999" />
            <TextInput
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                paddingVertical: 16,
                paddingHorizontal: 12,
              }}
              placeholder="Search help articles..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          {/* Popular Topics Section */}
          <Text
            style={{
              color: '#999',
              fontSize: 12,
              fontFamily: 'Poppins-Bold',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            POPULAR TOPICS
          </Text>

          {popularTopics.map((topic, index) => (
            <HelpTopic
              key={index}
              icon={topic.icon}
              title={topic.title}
              subtitle={topic.subtitle}
              onPress={topic.onPress}
            />
          ))}

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333',
              marginVertical: 24,
            }}
          />

          {/* FAQ Section */}
          <Text
            style={{
              color: '#999',
              fontSize: 12,
              fontFamily: 'Poppins-Bold',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            FREQUENTLY ASKED QUESTIONS
          </Text>

          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={expandedFAQ === item.question}
              onToggle={() => toggleFAQ(item.question)}
            />
          ))}

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#333',
              marginVertical: 24,
            }}
          />
        </View>
      </ScrollView>

      {/* Contact Support Button */}
      <View
        style={{
          padding: 16,
          backgroundColor: '#000',
        }}
      >
        <TouchableOpacity
          onPress={handleContactSupport}
          style={{
            backgroundColor: '#007AFF',
            borderRadius: 12,
            paddingVertical: 16,
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
            Contact Support
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
