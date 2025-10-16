import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: any;
  likes: number;
  size?: string;
  protectionFee?: string;
}

export interface ProductCardProps {
  product: Product;
  showSize?: boolean;
  showProtectionFee?: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showSize = false,
  showProtectionFee = false,
  onPress,
  width = screenWidth / 2 - 20,
  height = width * (4 / 3),
}) => {
  return (
    <Pressable
      style={[styles.container, { width }]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={[styles.image, { height }]}
          resizeMode="cover"
        />
        
        {/* Like Button */}
        <View style={styles.likeButton}>
          <Feather name="heart" size={12} color="white" />
          <Text style={styles.likeText}>{product.likes}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        
        {showSize && product.size && (
          <Text style={styles.size} numberOfLines={1}>
            {product.size}
          </Text>
        )}
        
        <Text style={styles.price}>
          {product.price}
        </Text>
        
        {showProtectionFee && product.protectionFee && (
          <Text style={styles.protectionFee}>
            ({product.protectionFee} Protection Fee)
          </Text>
        )}
        
        <Text style={styles.officialText}>
          (Official Vint Street Product)
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  likeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 2,
  },
  content: {
    padding: 12,
  },
  productName: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
    lineHeight: 16,
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  size: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
    color: '#000',
  },
  protectionFee: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 2,
  },
  officialText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
});

export default ProductCard;
