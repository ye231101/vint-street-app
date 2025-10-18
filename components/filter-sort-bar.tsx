import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface FilterSortBarProps {
  filterCount?: number;
  sortBy?: string;
  onFilterPress?: () => void;
  onSortPress?: () => void;
}

const FilterSortBar: React.FC<FilterSortBarProps> = ({
  filterCount = 0,
  sortBy = 'Most Relevant',
  onFilterPress,
  onSortPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onFilterPress}>
        <Text style={styles.buttonText}>Filter by {filterCount > 0 && `| ${filterCount}`}</Text>
        <Feather name="chevron-down" size={16} color="#666" />
      </Pressable>

      <Pressable style={styles.button} onPress={onSortPress}>
        <Text style={styles.buttonText}>Sort by | {sortBy}</Text>
        <Feather name="chevron-down" size={16} color="#666" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
});

export default FilterSortBar;
