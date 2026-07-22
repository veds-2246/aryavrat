import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';

import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {MainTabParamList} from '../../navigation/MainTabs';
import {RootStackParamList} from '../../navigation/types';

type ProductsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ProductsScreen = () => {
  const navigation =
  useNavigation<ProductsScreenNavigationProp>();

const openProduct = () => {
  navigation.navigate('ProductDetails', {
    productId: 'cow-milk',
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Fresh Products</Text>

        <Text style={styles.subtitle}>
          Fresh dairy delivered to your doorstep every morning.
        </Text>

        <View style={styles.card}>
          <View style={styles.imageBox}>
            <Text style={styles.emoji}>🥛</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.productName}>
              Fresh Cow Milk
            </Text>

            <Text style={styles.description}>
              Fresh and pure milk for your everyday needs.
            </Text>

            <Text style={styles.price}>
              ₹ -- / litre
            </Text>

            <View style={styles.actions}>
              <Pressable style={styles.orderButton}
              onPress={openProduct}>
                <Text style={styles.orderText}>
                  Buy Once
                </Text>
              </Pressable>

              <Pressable style={styles.subscribeButton}
              onPress={openProduct}>
                <Text style={styles.subscribeText}>
                  Subscribe
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

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
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  orderButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#16794B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  orderText: {
    color: '#16794B',
    fontWeight: '700',
  },

  subscribeButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#16794B',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subscribeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});