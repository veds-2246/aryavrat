import React from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

import {
  MainTabParamList,
} from '../../navigation/MainTabs';

const HomeScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>

          <View>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.location}>
              Your morning delivery
            </Text>
          </View>

          <View style={styles.profile}>
            <Text style={styles.profileText}>
              V
            </Text>
          </View>

        </View>

        <View style={styles.hero}>

          <View style={styles.heroContent}>

            <Text style={styles.heroLabel}>
              FRESH EVERY MORNING
            </Text>

            <Text style={styles.heroTitle}>
              Pure milk,{'\n'}
              delivered daily.
            </Text>

            <Text style={styles.heroDescription}>
              Start a subscription and never
              worry about ordering milk again.
            </Text>

            <Pressable
  style={styles.heroButton}
  onPress={() =>
    navigation.navigate('Products')
  }>

              <Text style={styles.heroButtonText}>
                Explore Milk
              </Text>

            </Pressable>

          </View>

          <Text style={styles.heroEmoji}>
            🥛
          </Text>

        </View>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actions}>

          <Pressable
  style={styles.actionCard}
  onPress={() =>
    navigation.navigate('Orders')
  }>
            <Text style={styles.actionIcon}>
              📦
            </Text>

            <Text style={styles.actionTitle}>
              My Orders
            </Text>

            <Text style={styles.actionSubtitle}>
              Track orders
            </Text>
          </Pressable>

          <Pressable style={styles.actionCard}>
            <Text style={styles.actionIcon}>
              📅
            </Text>

            <Text style={styles.actionTitle}>
              Subscription
            </Text>

            <Text style={styles.actionSubtitle}>
              Manage plan
            </Text>
          </Pressable>

        </View>

        <View style={styles.deliveryCard}>

          <View>

            <Text style={styles.deliveryLabel}>
              TOMORROW'S DELIVERY
            </Text>

            <Text style={styles.deliveryTitle}>
              No delivery scheduled
            </Text>

            <Text style={styles.deliveryDescription}>
              Subscribe to milk for automatic
              morning deliveries.
            </Text>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Fresh from Aryavrat
        </Text>

        <View style={styles.productCard}>

          <View style={styles.productImage}>
            <Text style={styles.productEmoji}>
              🥛
            </Text>
          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productTitle}>
              Fresh Cow Milk
            </Text>

            <Text style={styles.productSubtitle}>
              Pure • Fresh • Daily
            </Text>

            <Text style={styles.productPrice}>
              ₹ -- / litre
            </Text>

          </View>

          <Pressable
  style={styles.addButton}
  onPress={() =>
    navigation
      .getParent()
      ?.navigate(
        'ProductDetails' as never,
        {
          productId: 'cow-milk',
        } as never,
      )
  }>
  <Text style={styles.addText}>
    ADD
  </Text>
</Pressable>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  greeting: {
    color: '#17231C',
    fontSize: 22,
    fontWeight: '700',
  },

  location: {
    color: '#77827B',
    marginTop: 4,
    fontSize: 13,
  },

  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#16794B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  hero: {
    minHeight: 220,
    backgroundColor: '#DDEFE5',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  heroContent: {
    flex: 1,
    zIndex: 2,
  },

  heroLabel: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#153523',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 9,
  },

  heroDescription: {
    color: '#547061',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 210,
  },

  heroButton: {
    backgroundColor: '#16794B',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 16,
  },

  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  heroEmoji: {
    position: 'absolute',
    right: 15,
    bottom: 30,
    fontSize: 75,
    opacity: 0.85,
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 14,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6ECE8',
  },

  actionIcon: {
    fontSize: 27,
    marginBottom: 15,
  },

  actionTitle: {
    color: '#17231C',
    fontWeight: '700',
    fontSize: 15,
  },

  actionSubtitle: {
    color: '#8A958E',
    marginTop: 4,
    fontSize: 12,
  },

  deliveryCard: {
    marginTop: 18,
    padding: 19,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6ECE8',
  },

  deliveryLabel: {
    color: '#16794B',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '800',
  },

  deliveryTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 7,
  },

  deliveryDescription: {
    color: '#7B867F',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECE8',
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 13,
    backgroundColor: '#EEF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  productEmoji: {
    fontSize: 38,
  },

  productInfo: {
    flex: 1,
    marginLeft: 13,
  },

  productTitle: {
    color: '#17231C',
    fontSize: 15,
    fontWeight: '700',
  },

  productSubtitle: {
    color: '#89938D',
    fontSize: 11,
    marginTop: 4,
  },

  productPrice: {
    color: '#16794B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 7,
  },

  addButton: {
    borderWidth: 1,
    borderColor: '#16794B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addText: {
    color: '#16794B',
    fontWeight: '800',
    fontSize: 12,
  },
});