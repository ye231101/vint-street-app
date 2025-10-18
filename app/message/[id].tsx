import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: number;
  content: string;
  senderId: number;
  dateSent: string;
  isSent: boolean;
}

interface DateHeader {
  type: 'date';
  date: string;
  displayText: string;
}

type MessageItem = Message | DateHeader;

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data based on the image
  const mockMessages: Message[] = [
    {
      id: 1,
      content: 'Do you like my shop',
      senderId: 2,
      dateSent: '2025-09-24T14:38:00Z',
      isSent: false,
    },
    {
      id: 2,
      content: 'It will be open soon',
      senderId: 2,
      dateSent: '2025-09-24T14:39:00Z',
      isSent: false,
    },
    {
      id: 3,
      content: '2132',
      senderId: 1,
      dateSent: '2025-09-24T19:39:00Z',
      isSent: true,
    },
    {
      id: 4,
      content: '65456',
      senderId: 1,
      dateSent: '2025-09-24T19:39:00Z',
      isSent: true,
    },
  ];

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]): MessageItem[] => {
    const grouped: MessageItem[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = formatDate(message.dateSent);

      if (messageDate !== currentDate) {
        grouped.push({
          type: 'date',
          date: messageDate,
          displayText: messageDate,
        });
        currentDate = messageDate;
      }

      grouped.push(message);
    });

    return grouped;
  };

  const sendMessage = () => {
    if (messageText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      content: messageText.trim(),
      senderId: 1,
      dateSent: new Date().toISOString(),
      isSent: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText('');

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderDateHeader = (item: DateHeader) => (
    <View
      key={`date-${item.date}`}
      style={{
        alignItems: 'center',
        marginVertical: 16,
      }}
    >
      <View
        style={{
          backgroundColor: '#f0f0f0',
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            color: '#666',
          }}
        >
          {item.displayText}
        </Text>
      </View>
    </View>
  );

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={{
        alignItems: message.isSent ? 'flex-end' : 'flex-start',
        marginVertical: 4,
        marginHorizontal: 8,
      }}
    >
      <View
        style={{
          maxWidth: '75%',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 16,
          backgroundColor: message.isSent ? '#000' : '#f0f0f0',
          borderTopLeftRadius: message.isSent ? 16 : 4,
          borderTopRightRadius: message.isSent ? 16 : 16,
          borderBottomLeftRadius: message.isSent ? 16 : 16,
          borderBottomRightRadius: message.isSent ? 4 : 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Text
          style={{
            color: message.isSent ? '#fff' : '#000',
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {message.content}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 11,
          fontFamily: 'Poppins-Regular',
          color: '#999',
          marginTop: 4,
          marginHorizontal: message.isSent ? 0 : 12,
          marginRight: message.isSent ? 12 : 0,
        }}
      >
        {formatTime(message.dateSent)}
      </Text>
    </View>
  );

  const messageItems = groupMessagesByDate(messages);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <SafeAreaView style={{ backgroundColor: '#000' }}>
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
            Hello
          </Text>

          <TouchableOpacity
            onPress={() => Alert.alert('Refresh', 'Refreshing messages...')}
            style={{
              marginLeft: 16,
            }}
          >
            <Feather name="refresh-cw" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Messages Area */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          ref={scrollViewRef}
          style={{
            flex: 1,
            backgroundColor: '#fff',
          }}
          contentContainerStyle={{
            paddingVertical: 8,
            flexGrow: 1,
          }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: '#666',
                }}
              >
                Loading messages...
              </Text>
            </View>
          ) : (
            messageItems.map((item: MessageItem) => {
              if ('type' in item && item.type === 'date') {
                return renderDateHeader(item as DateHeader);
              } else {
                return renderMessage(item as Message);
              }
            })
          )}
        </ScrollView>
      </View>

      {/* Message Input - Fixed at bottom */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 34 : 12, // Add bottom padding for home indicator
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            minHeight: 60,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 12,
              minHeight: 40,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: '#000',
                maxHeight: 100,
                minHeight: 24,
                textAlignVertical: 'center',
              }}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              textAlignVertical="center"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
              onBlur={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: '#000',
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
              marginBottom: 0,
            }}
          >
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
