import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
  onShoppingCartPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onSearch,
  onShoppingCartPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="white" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#b0b0b0"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        {value && value.length > 0 && (
          <Pressable onPress={() => onChangeText?.("")}>
            <Feather name="x" size={20} color="white" />
          </Pressable>
        )}
      </View>
      <Pressable onPress={onShoppingCartPress}>
        <Feather name="shopping-bag" size={20} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#151515",
    gap: 32,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a4a4a",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
});

export default SearchBar;
