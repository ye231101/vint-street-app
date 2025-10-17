import SearchBar from "@/components/search-bar";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Conversation {
  id: number;
  subject: string;
  lastMessageContent: string;
  lastMessageDate: string;
  unreadCount: number;
  recipients: number[];
  otherParticipantName: string;
}

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data based on the image
  const mockConversations: Conversation[] = [
    {
      id: 1,
      subject: "About Tommy Hilfiger Jeans",
      lastMessageContent: "About Tommy Hilfiger Jeans, hthththththth",
      lastMessageDate: "Oct 17, 5:50 AM",
      unreadCount: 0,
      recipients: [2],
      otherParticipantName: "Matt Scott",
    },
    {
      id: 2,
      subject: "Hello",
      lastMessageContent: "Hello 65456",
      lastMessageDate: "Oct 17, 5:50 AM",
      unreadCount: 0,
      recipients: [2],
      otherParticipantName: "Matt Scott",
    },
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const formatTime = (dateString: string) => {
    return dateString;
  };

  const renderConversationItem = (conversation: Conversation) => (
    <TouchableOpacity
      key={conversation.id}
      onPress={() => router.push(`/message/${conversation.id}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontFamily: "Poppins-Bold",
          }}
        >
          {conversation.otherParticipantName.charAt(0)}
        </Text>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {/* Name */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Bold",
            color: "#000",
            marginBottom: 4,
          }}
        >
          {conversation.otherParticipantName}
        </Text>

        {/* Subject */}
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-Regular",
            color: "#666",
            marginBottom: 2,
          }}
        >
          {conversation.subject}
        </Text>

        {/* Last Message */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins-Regular",
            color: "#999",
            maxWidth: "80%",
          }}
          numberOfLines={1}
        >
          {conversation.lastMessageContent}
        </Text>
      </View>

      {/* Time */}
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins-Regular",
          color: "#999",
        }}
      >
        {formatTime(conversation.lastMessageDate)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with Search */}
      <SearchBar value={searchText} onChangeText={setSearchText} />

      {/* Messages Content */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                color: "#666",
              }}
            >
              Loading conversations...
            </Text>
          </View>
        ) : conversations.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 32,
            }}
          >
            <Feather name="message-circle" size={64} color="#ccc" />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                color: "#666",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No conversations yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: "#999",
                textAlign: "center",
              }}
            >
              Start a conversation with a seller
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000"]}
                tintColor="#000"
              />
            }
          >
            {conversations.map(renderConversationItem)}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
