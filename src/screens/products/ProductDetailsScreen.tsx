import React, {useState} from 'react';

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

const ProductDetailsScreen = ({navigation}: Props) => {
  const [quantity, setQuantity] = useState(0.5);

  const decreaseQuantity = () => {
    if (quantity > 0.5) {
      setQuantity(previous => previous - 0.5);
    }
  };

  const increaseQuantity = () => {
    setQuantity(previous => previous + 0.5);
  };

  const formatQuantity = (litres: number) => {
  if (litres === 0.5) {
    return '500 ml';
  }

  return `${litres} L`;
};

  const handleBuyOnce = () => {
  navigation.navigate('BuyOnce', {
    productId: 'cow-milk',
    quantity,
  });
};

  const handleSubscribe = () => {
  navigation.navigate('SubscriptionSetup', {
    productId: 'cow-milk',
    quantity,
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <Text style={styles.backText}>‹</Text>

        </Pressable>

        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>
            🥛
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            FRESH EVERY MORNING
          </Text>
        </View>

        <Text style={styles.title}>
          Fresh Cow Milk
        </Text>

        <Text style={styles.subtitle}>
          Pure, fresh cow milk delivered directly
          to your doorstep every morning.
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🥛</Text>
            <Text style={styles.infoTitle}>Pure</Text>
            <Text style={styles.infoSubtitle}>
              Quality milk
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🌅</Text>
            <Text style={styles.infoTitle}>Fresh</Text>
            <Text style={styles.infoSubtitle}>
              Morning delivery
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoTitle}>Flexible</Text>
            <Text style={styles.infoSubtitle}>
              Easy scheduling
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.label}>
              Price
            </Text>

            <Text style={styles.price}>
              ₹ -- / litre
            </Text>
          </View>

          <View>
            <Text style={styles.quantityLabel}>
              Quantity
            </Text>

            <View style={styles.quantitySelector}>
              <Pressable
                style={styles.quantityButton}
                onPress={decreaseQuantity}>

                <Text style={styles.quantityButtonText}>
                  −
                </Text>

              </Pressable>

              <Text style={styles.quantity}>
                {formatQuantity(quantity)}
              </Text>

              <Pressable
                style={styles.quantityButton}
                onPress={increaseQuantity}>

                <Text style={styles.quantityButtonText}>
                  +
                </Text>

              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          How would you like your milk?
        </Text>

        <Pressable
          style={styles.buyCard}
          onPress={handleBuyOnce}>

          <View style={styles.optionIcon}>
            <Text style={styles.optionEmoji}>🛍️</Text>
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>
              Buy Once
            </Text>

            <Text style={styles.optionDescription}>
              Order milk for a single morning delivery.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.subscriptionCard}
          onPress={handleSubscribe}>

          <View style={styles.subscriptionIcon}>
            <Text style={styles.optionEmoji}>🔄</Text>
          </View>

          <View style={styles.optionContent}>
            <View style={styles.recommendedRow}>
              <Text style={styles.subscriptionTitle}>
                Subscribe
              </Text>

              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>
                  RECOMMENDED
                </Text>
              </View>
            </View>

            <Text style={styles.subscriptionDescription}>
              Automatic deliveries on your preferred schedule.
            </Text>

            <Text style={styles.scheduleText}>
              Daily • Alternate days • Custom
            </Text>
          </View>

          <Text style={styles.greenArrow}>›</Text>
        </Pressable>

        <View style={styles.note}>
          <Text style={styles.noteIcon}>💡</Text>

          <Text style={styles.noteText}>
            You can skip, modify or manage upcoming
            subscription deliveries before the daily cutoff time.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E9E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  backText: {
    fontSize: 34,
    color: '#17231C',
    lineHeight: 36,
  },

  productImage: {
    height: 220,
    backgroundColor: '#E5F3EB',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productEmoji: {
    fontSize: 100,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5F3EB',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 22,
  },

  badgeText: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  title: {
    color: '#17231C',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 10,
  },

  subtitle: {
    color: '#748078',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 10,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E5EBE7',
  },

  infoIcon: {
    fontSize: 22,
  },

  infoTitle: {
    color: '#25352B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 7,
  },

  infoSubtitle: {
    color: '#8A958E',
    fontSize: 9,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E9E5',
    marginVertical: 25,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#89938D',
    fontSize: 12,
  },

  price: {
    color: '#16794B',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },

  quantityLabel: {
    color: '#89938D',
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },

  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5E0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  quantityButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    color: '#16794B',
    fontSize: 23,
    fontWeight: '600',
  },

  quantity: {
    minWidth: 55,
    textAlign: 'center',
    color: '#17231C',
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 32,
    marginBottom: 14,
  },

  buyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E9E5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  subscriptionCard: {
    backgroundColor: '#EAF5EF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B9DDC9',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  subscriptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#D4EBDD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionEmoji: {
    fontSize: 23,
  },

  optionContent: {
    flex: 1,
    marginLeft: 13,
  },

  optionTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
  },

  subscriptionTitle: {
    color: '#155D3B',
    fontSize: 16,
    fontWeight: '800',
  },

  optionDescription: {
    color: '#818C85',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  subscriptionDescription: {
    color: '#587063',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  scheduleText: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  arrow: {
    color: '#839087',
    fontSize: 29,
  },

  greenArrow: {
    color: '#16794B',
    fontSize: 29,
  },

  recommendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  recommendedBadge: {
    backgroundColor: '#16794B',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  recommendedText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  note: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E9',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  noteIcon: {
    fontSize: 17,
    marginRight: 9,
  },

  noteText: {
    flex: 1,
    color: '#756C50',
    fontSize: 11,
    lineHeight: 17,
  },
});