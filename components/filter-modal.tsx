import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export interface FilterOption {
  id: string;
  name: string;
  count: number;
}

export interface FilterCategory {
  id: string;
  name: string;
  icon: string;
  options: FilterOption[];
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('brand');
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({});

  // Mock filter data
  const filterCategories: FilterCategory[] = [
    {
      id: 'brand',
      name: 'Brand',
      icon: 'check',
      options: [
        { id: 'veefriends', name: 'VeeFriends', count: 856 },
        { id: 'nike', name: 'Nike', count: 357 },
        { id: 'adidas', name: 'adidas', count: 190 },
        { id: 'tommy-hilfiger', name: 'Tommy Hilfiger', count: 167 },
        { id: 'nintendo', name: 'Nintendo', count: 160 },
        { id: 'burberry', name: 'Burberry', count: 91 },
        { id: 'ralph-lauren', name: 'Ralph Lauren', count: 79 },
      ],
    },
    {
      id: 'size',
      name: 'Size',
      icon: 'check',
      options: [
        { id: 'xs', name: 'XS', count: 45 },
        { id: 's', name: 'S', count: 123 },
        { id: 'm', name: 'M', count: 234 },
        { id: 'l', name: 'L', count: 189 },
        { id: 'xl', name: 'XL', count: 98 },
      ],
    },
    {
      id: 'price',
      name: 'Price',
      icon: 'check',
      options: [
        { id: 'under-50', name: 'Under $50', count: 234 },
        { id: '50-100', name: '$50 - $100', count: 456 },
        { id: '100-200', name: '$100 - $200', count: 321 },
        { id: 'over-200', name: 'Over $200', count: 189 },
      ],
    },
  ];

  const currentCategory = filterCategories.find(cat => cat.id === selectedCategory);

  const handleFilterToggle = (optionId: string) => {
    const currentFilters = selectedFilters[selectedCategory] || [];
    const newFilters = currentFilters.includes(optionId)
      ? currentFilters.filter(id => id !== optionId)
      : [...currentFilters, optionId];
    
    setSelectedFilters({
      ...selectedFilters,
      [selectedCategory]: newFilters,
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  const getTotalFilterCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  const renderFilterOption = ({ item }: { item: FilterOption }) => {
    const isSelected = selectedFilters[selectedCategory]?.includes(item.id) || false;
    
    return (
      <Pressable
        style={styles.filterOption}
        onPress={() => handleFilterToggle(item.id)}
      >
        <Text style={styles.filterOptionText}>
          {item.name} ({item.count})
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Feather name="check" size={12} color="#fff" />}
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <Pressable style={styles.browseCategoriesButton}>
              <Feather name="grid" size={16} color="#666" />
              <Text style={styles.browseCategoriesText}>Browse Categories</Text>
            </Pressable>
            <Pressable onPress={handleClearAll} style={styles.clearAllButton}>
              <Feather name="trash-2" size={16} color="#666" />
              <Text style={styles.clearAllText}>Clear all</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Filter Categories */}
            <View style={styles.filterCategories}>
              {filterCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.filterCategoryButton,
                    selectedCategory === category.id && styles.filterCategoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Feather name={category.icon as any} size={16} color="#fff" />
                  <Text style={styles.filterCategoryText}>{category.name}</Text>
                </Pressable>
              ))}
            </View>

            {/* Filter Options */}
            <View style={styles.filterOptions}>
              <FlatList
                data={currentCategory?.options || []}
                renderItem={renderFilterOption}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>

          {/* Apply Button */}
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>
              Apply Filters {getTotalFilterCount() > 0 && `(${getTotalFilterCount()})`}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayPressable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.8, // 80% of screen height
    paddingBottom: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  browseCategoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  browseCategoriesText: {
    fontSize: 14,
    color: '#666',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearAllText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  filterCategories: {
    width: 120,
    backgroundColor: '#f8f8f8',
    paddingVertical: 16,
  },
  filterCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#333',
    borderRadius: 20,
    gap: 8,
  },
  filterCategoryButtonActive: {
    backgroundColor: '#000',
  },
  filterCategoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterOptions: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  applyButton: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
