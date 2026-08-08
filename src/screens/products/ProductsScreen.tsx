import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import {fetchProducts} from '../../services/ProductService';

import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';

import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {MainTabParamList} from '../../navigation/MainTabs';
import {RootStackParamList} from '../../navigation/types';

type ProductsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Products'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ProductsScreen = () => {
  const navigation = useNavigation<ProductsScreenNavigationProp>();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openProduct = (id: string) => {
    navigation.navigate('ProductDetails', {
      productId: id,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Fresh Products</Text>

        <Text style={styles.subtitle}>
          Fresh dairy delivered to your doorstep every morning.
        </Text>

        {products.map(product => (
          <Pressable
            key={product.id}
            style={styles.card}
            onPress={() => openProduct(product.id)}>

            <View style={styles.imageBox}>
              <Text style={styles.emoji}>🥛</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text style={styles.description}>
                {product.description}
              </Text>

              <Text style={styles.price}>
                ₹ {product.price} / {product.unit}
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={styles.viewButton}
                  onPress={() => openProduct(product.id)}>

                  <Text style={styles.viewButtonText}>
                    View Product
                  </Text>

                </Pressable>
              </View>
            </View>

          </Pressable>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#758078',
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EBE7',
    marginBottom: 18,
  },

  imageBox: {
    height: 170,
    borderRadius: 15,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emoji: {
    fontSize: 80,
  },

  info: {
    marginTop: 17,
  },

  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17231C',
  },

  description: {
    color: '#7B867F',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  price: {
    color: '#16794B',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 13,
  },

  actions: {
    marginTop: 18,
  },

  viewButton: {
    height: 50,
    backgroundColor: '#16794B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});