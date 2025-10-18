import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export interface CategoryWidgetProps {
  title: string;
  hasChildren: boolean;
  onPress?: () => void;
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({ title, hasChildren, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      {hasChildren && <Feather name="chevron-right" size={20} color="#666" />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    flex: 1,
  },
});

export default CategoryWidget;
