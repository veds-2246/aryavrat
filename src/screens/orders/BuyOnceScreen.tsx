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
  'BuyOnce'
>;

type DeliveryOption = 'tomorrow' | 'dayAfterTomorrow';

const BuyOnceScreen = ({
  navigation,
  route,
}: Props) => {
  const {quantity: initialQuantity} = route.params;

  const [quantity, setQuantity] =
    useState(initialQuantity);

  const [deliveryOption, setDeliveryOption] =
    useState<DeliveryOption>('tomorrow');

  const formatQuantity = (litres: number) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const decreaseQuantity = () => {
    if (quantity > 0.5) {
      setQuantity(previous => previous - 0.5);
    }
  };

  const increaseQuantity = () => {
    setQuantity(previous => previous + 0.5);
  };

  const getDate = (daysToAdd: number) => {
    const date = new Date();

    date.setDate(
      date.getDate() + daysToAdd,
    );

    return date.toLocaleDateString(
      'en-IN',
      {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      },
    );
  };

  const handleContinue = () => {
  navigation.navigate('CheckoutAddress', {
    orderType: 'buyOnce',
    productId: route.params.productId,
    quantity,
    deliveryOption,
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

          <Text style={styles.backText}>
            ‹
          </Text>

        </Pressable>

        <Text style={styles.step}>
          ONE-TIME ORDER
        </Text>

        <Text style={styles.title}>
          Schedule your delivery
        </Text>

        <Text style={styles.subtitle}>
          Choose how much milk you need and when
          you'd like it delivered.
        </Text>

        <View style={styles.productCard}>

          <View style={styles.productIcon}>
            <Text style={styles.milkEmoji}>
              🥛
            </Text>
          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              Fresh Cow Milk
            </Text>

            <Text style={styles.productDescription}>
              One-time morning delivery
            </Text>

          </View>

          <View style={styles.oneTimeBadge}>
            <Text style={styles.oneTimeText}>
              BUY ONCE
            </Text>
          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Quantity
        </Text>

        <View style={styles.quantityCard}>

          <View>

            <Text style={styles.quantityTitle}>
              Milk quantity
            </Text>

            <Text style={styles.quantityDescription}>
              Select in 500 ml increments
            </Text>

          </View>

          <View style={styles.quantitySelector}>

            <Pressable
              style={[
                styles.quantityButton,
                quantity === 0.5 &&
                  styles.quantityButtonDisabled,
              ]}
              onPress={decreaseQuantity}>

              <Text
                style={[
                  styles.quantityButtonText,
                  quantity === 0.5 &&
                    styles.quantityButtonTextDisabled,
                ]}>
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

        <Text style={styles.sectionTitle}>
          Delivery date
        </Text>

        <Pressable
          style={[
            styles.deliveryCard,
            deliveryOption === 'tomorrow' &&
              styles.deliveryCardSelected,
          ]}
          onPress={() =>
            setDeliveryOption('tomorrow')
          }>

          <View
            style={[
              styles.radio,
              deliveryOption === 'tomorrow' &&
                styles.radioSelected,
            ]}>

            {deliveryOption === 'tomorrow' && (
              <View style={styles.radioDot} />
            )}

          </View>

          <View style={styles.deliveryInfo}>

            <View style={styles.deliveryTitleRow}>

              <Text style={styles.deliveryTitle}>
                Tomorrow
              </Text>

              <View style={styles.earliestBadge}>
                <Text style={styles.earliestText}>
                  EARLIEST
                </Text>
              </View>

            </View>

            <Text style={styles.deliveryDate}>
              {getDate(1)}
            </Text>

            <Text style={styles.deliveryTime}>
              🌅 Morning delivery
            </Text>

          </View>

        </Pressable>

        <Pressable
          style={[
            styles.deliveryCard,
            deliveryOption ===
              'dayAfterTomorrow' &&
              styles.deliveryCardSelected,
          ]}
          onPress={() =>
            setDeliveryOption(
              'dayAfterTomorrow',
            )
          }>

          <View
            style={[
              styles.radio,
              deliveryOption ===
                'dayAfterTomorrow' &&
                styles.radioSelected,
            ]}>

            {deliveryOption ===
              'dayAfterTomorrow' && (
              <View style={styles.radioDot} />
            )}

          </View>

          <View style={styles.deliveryInfo}>

            <Text style={styles.deliveryTitle}>
              Day after tomorrow
            </Text>

            <Text style={styles.deliveryDate}>
              {getDate(2)}
            </Text>

            <Text style={styles.deliveryTime}>
              🌅 Morning delivery
            </Text>

          </View>

        </Pressable>

        <View style={styles.cutoffBox}>

          <Text style={styles.cutoffIcon}>
            ⏰
          </Text>

          <View style={styles.cutoffContent}>

            <Text style={styles.cutoffTitle}>
              Order cutoff
            </Text>

            <Text style={styles.cutoffText}>
              Tomorrow's delivery is available only
              when the order is placed before the
              configured daily cutoff time.
            </Text>

          </View>

        </View>

        <View style={styles.summary}>

          <Text style={styles.summaryTitle}>
            Order summary
          </Text>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Product
            </Text>

            <Text style={styles.summaryValue}>
              Fresh Cow Milk
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Quantity
            </Text>

            <Text style={styles.summaryValue}>
              {formatQuantity(quantity)}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Delivery
            </Text>

            <Text style={styles.summaryValue}>
              {deliveryOption === 'tomorrow'
                ? 'Tomorrow'
                : 'Day after tomorrow'}
            </Text>

          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>

            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ₹ --
            </Text>

          </View>

        </View>

        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}>

          <Text style={styles.continueText}>
            Continue
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
};

export default BuyOnceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 45,
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
    marginBottom: 25,
  },

  backText: {
    fontSize: 34,
    color: '#17231C',
    lineHeight: 36,
  },

  step: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  title: {
    color: '#17231C',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 8,
  },

  subtitle: {
    color: '#748078',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 13,
    marginTop: 24,
  },

  productIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  milkEmoji: {
    fontSize: 28,
  },

  productInfo: {
    flex: 1,
    marginLeft: 13,
  },

  productName: {
    color: '#17231C',
    fontSize: 15,
    fontWeight: '700',
  },

  productDescription: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 4,
  },

  oneTimeBadge: {
    backgroundColor: '#EAF5EF',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  oneTimeText: {
    color: '#16794B',
    fontSize: 8,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 13,
  },

  quantityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 16,
  },

  quantityTitle: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '700',
  },

  quantityDescription: {
    color: '#89938D',
    fontSize: 10,
    marginTop: 4,
  },

  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5E0',
    borderRadius: 10,
    overflow: 'hidden',
  },

  quantityButton: {
    width: 40,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonDisabled: {
    backgroundColor: '#F4F6F5',
  },

  quantityButtonText: {
    color: '#16794B',
    fontSize: 22,
    fontWeight: '600',
  },

  quantityButtonTextDisabled: {
    color: '#B8C0BB',
  },

  quantity: {
    minWidth: 62,
    textAlign: 'center',
    color: '#17231C',
    fontSize: 13,
    fontWeight: '700',
  },

  deliveryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8E4',
    borderRadius: 15,
    padding: 16,
    marginBottom: 11,
  },

  deliveryCardSelected: {
    borderColor: '#16794B',
    backgroundColor: '#F0F8F4',
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B7C1BB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  radioSelected: {
    borderColor: '#16794B',
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16794B',
  },

  deliveryInfo: {
    flex: 1,
    marginLeft: 13,
  },

  deliveryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  deliveryTitle: {
    color: '#17231C',
    fontSize: 15,
    fontWeight: '700',
  },

  earliestBadge: {
    backgroundColor: '#16794B',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
  },

  earliestText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  deliveryDate: {
    color: '#5F6F65',
    fontSize: 12,
    marginTop: 5,
  },

  deliveryTime: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  cutoffBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },

  cutoffIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  cutoffContent: {
    flex: 1,
  },

  cutoffTitle: {
    color: '#665C40',
    fontSize: 12,
    fontWeight: '700',
  },

  cutoffText: {
    color: '#81765A',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  summary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 16,
    marginTop: 25,
  },

  summaryTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  summaryLabel: {
    color: '#7E8982',
    fontSize: 12,
  },

  summaryValue: {
    color: '#35433A',
    fontSize: 12,
    fontWeight: '600',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#E5EBE7',
    marginVertical: 10,
  },

  totalLabel: {
    color: '#17231C',
    fontSize: 15,
    fontWeight: '700',
  },

  totalValue: {
    color: '#16794B',
    fontSize: 17,
    fontWeight: '800',
  },

  continueButton: {
    height: 56,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});