import React from 'react';

import {
    useOrders,
} from '../../context/OrderContext';

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
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../../navigation/types';

import {
  getProduct,
} from '../../data/products';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SubscriptionReview'
>;

const SubscriptionReviewScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    productId,
    quantity,
    schedule,
    selectedDays,
    startOption,
    address,
  } = route.params;

  const {
  addOrder,
} = useOrders();

  const product = getProduct(productId);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>

          <Text style={styles.errorTitle}>
            Product unavailable
          </Text>

          <Pressable
            onPress={() =>
              navigation.goBack()
            }>

            <Text style={styles.backLink}>
              Go back
            </Text>

          </Pressable>

        </View>
      </SafeAreaView>
    );
  }

  const pricePerDelivery =
    product.pricePerLitre * quantity;

  const formatQuantity = (
    litres: number,
  ) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const formatSchedule = () => {
    if (schedule === 'daily') {
      return 'Every day';
    }

    if (schedule === 'alternate') {
      return 'Every alternate day';
    }

    return 'Custom days';
  };

  const getStartDate = () => {
    const date = new Date();

    const daysToAdd =
      startOption === 'tomorrow'
        ? 1
        : 2;

    date.setDate(
      date.getDate() + daysToAdd,
    );

    return date.toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      },
    );
  };

  const getEstimatedDeliveries = () => {
    if (schedule === 'daily') {
      return 30;
    }

    if (schedule === 'alternate') {
      return 15;
    }

    return selectedDays.length * 4;
  };

  const estimatedDeliveries =
    getEstimatedDeliveries();

  const estimatedMonthlyCost =
    pricePerDelivery *
    estimatedDeliveries;

  const handleContinue = () => {
  const referenceId =
    `SUB-${Date.now()}`;

  const startDate =
    getStartDate();

  addOrder({
    id: referenceId,

    type: 'subscription',

    productId,

    productName:
      product.name,

    quantity,

    status: 'confirmed',

subscriptionStatus: 'active',

nextDeliverySkipped: false,

createdAt:
  new Date().toISOString(),

schedule,

    selectedDays,

    startDate,

    pricePerDelivery,

    estimatedMonthlyCost,
  });

  navigation.navigate(
    'Confirmation',
    {
      type: 'subscription',

      productId,

      quantity,

      referenceId,
    },
  );
};

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }>

          <Text style={styles.backText}>
            ‹
          </Text>

        </Pressable>

        <Text style={styles.step}>
          SUBSCRIPTION REVIEW
        </Text>

        <Text style={styles.title}>
          Review your subscription
        </Text>

        <Text style={styles.subtitle}>
          Check your delivery schedule,
          quantity and address before
          continuing.
        </Text>

        <Text style={styles.sectionTitle}>
          Your milk
        </Text>

        <View style={styles.card}>

          <View style={styles.productRow}>

            <View style={styles.productIcon}>

              <Text style={styles.milkEmoji}>
                🥛
              </Text>

            </View>

            <View style={styles.productInfo}>

              <Text style={styles.productName}>
                {product.name}
              </Text>

              <Text style={styles.productDetail}>
                {formatQuantity(quantity)}
                {' per delivery'}
              </Text>

              <Text style={styles.productDetail}>
                ₹{product.pricePerLitre}/L
              </Text>

            </View>

            <View>

              <Text style={styles.price}>
                ₹{pricePerDelivery.toFixed(0)}
              </Text>

              <Text style={styles.perDelivery}>
                per delivery
              </Text>

            </View>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Delivery schedule
        </Text>

        <View style={styles.card}>

          <View style={styles.scheduleRow}>

            <View style={styles.scheduleIcon}>
              <Text style={styles.iconText}>
                🔄
              </Text>
            </View>

            <View style={styles.scheduleInfo}>

              <Text style={styles.smallLabel}>
                Frequency
              </Text>

              <Text style={styles.scheduleValue}>
                {formatSchedule()}
              </Text>

            </View>

          </View>

          {schedule === 'custom' &&
            selectedDays.length > 0 && (
              <>
                <View style={styles.divider} />

                <View style={styles.detailLine}>

                  <Text style={styles.detailLabel}>
                    Delivery days
                  </Text>

                  <Text style={styles.daysValue}>
                    {selectedDays.join(', ')}
                  </Text>

                </View>
              </>
            )}

          <View style={styles.divider} />

          <View style={styles.detailLine}>

            <Text style={styles.detailLabel}>
              First delivery
            </Text>

            <Text style={styles.detailValue}>
              {getStartDate()}
            </Text>

          </View>

          <View style={styles.detailLine}>

            <Text style={styles.detailLabel}>
              Delivery time
            </Text>

            <Text style={styles.morningValue}>
              🌅 Morning
            </Text>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Deliver to
        </Text>

        <View style={styles.card}>

          <View style={styles.addressRow}>

            <Text style={styles.locationIcon}>
              📍
            </Text>

            <View style={styles.addressInfo}>

              <Text style={styles.addressName}>
                {address.fullName}
              </Text>

              <Text style={styles.addressText}>
                {address.house},{' '}
                {address.area}
              </Text>

              {address.landmark !== '' && (
                <Text style={styles.addressText}>
                  Near {address.landmark}
                </Text>
              )}

              <Text style={styles.addressText}>
                {address.city}
                {' - '}
                {address.pincode}
              </Text>

              <Text style={styles.phone}>
                +91 {address.phone}
              </Text>

            </View>

            <Pressable
              onPress={() =>
                navigation.goBack()
              }>

              <Text style={styles.change}>
                Change
              </Text>

            </Pressable>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Cost estimate
        </Text>

        <View style={styles.costCard}>

          <View style={styles.costRow}>

            <Text style={styles.costLabel}>
              Per delivery
            </Text>

            <Text style={styles.costValue}>
              ₹{pricePerDelivery.toFixed(0)}
            </Text>

          </View>

          <View style={styles.costRow}>

            <Text style={styles.costLabel}>
              Est. deliveries / month
            </Text>

            <Text style={styles.costValue}>
              ~{estimatedDeliveries}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.costRow}>

            <View>

              <Text style={styles.totalLabel}>
                Estimated monthly cost
              </Text>

              <Text style={styles.estimateNote}>
                Based on your selected schedule
              </Text>

            </View>

            <Text style={styles.totalValue}>
              ~₹
              {estimatedMonthlyCost.toFixed(0)}
            </Text>

          </View>

        </View>

        <View style={styles.noticeBox}>

          <Text style={styles.noticeIcon}>
            ℹ️
          </Text>

          <Text style={styles.noticeText}>
            This is an estimated monthly
            amount. Your actual amount depends
            on completed deliveries, skipped
            days and subscription changes.
          </Text>

        </View>

        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}>

          <View>

            <Text style={styles.buttonSmall}>
              Estimated
            </Text>

            <Text style={styles.buttonAmount}>
              ~₹
              {estimatedMonthlyCost.toFixed(0)}
              /month
            </Text>

          </View>

          <Text style={styles.buttonText}>
            Continue ›
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
};

export default SubscriptionReviewScreen;

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

  sectionTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 16,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  milkEmoji: {
    fontSize: 29,
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

  productDetail: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 4,
  },

  price: {
    color: '#16794B',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },

  perDelivery: {
    color: '#89938D',
    fontSize: 8,
    marginTop: 3,
    textAlign: 'right',
  },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 20,
  },

  scheduleInfo: {
    flex: 1,
    marginLeft: 12,
  },

  smallLabel: {
    color: '#89938D',
    fontSize: 9,
  },

  scheduleValue: {
    color: '#25352B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5EBE7',
    marginVertical: 14,
  },

  detailLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 5,
  },

  detailLabel: {
    color: '#7C8880',
    fontSize: 12,
  },

  detailValue: {
    flex: 1,
    color: '#35433A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    marginLeft: 20,
  },

  daysValue: {
    flex: 1,
    color: '#16794B',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 20,
  },

  morningValue: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '700',
  },

  addressRow: {
    flexDirection: 'row',
  },

  locationIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  addressInfo: {
    flex: 1,
  },

  addressName: {
    color: '#25352B',
    fontSize: 14,
    fontWeight: '700',
  },

  addressText: {
    color: '#6F7D74',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  phone: {
    color: '#526158',
    fontSize: 11,
    marginTop: 7,
  },

  change: {
    color: '#16794B',
    fontSize: 12,
    fontWeight: '700',
  },

  costCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 17,
  },

  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  costLabel: {
    color: '#748078',
    fontSize: 12,
  },

  costValue: {
    color: '#35433A',
    fontSize: 13,
    fontWeight: '600',
  },

  totalLabel: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '800',
  },

  estimateNote: {
    color: '#9AA29D',
    fontSize: 9,
    marginTop: 3,
  },

  totalValue: {
    color: '#16794B',
    fontSize: 19,
    fontWeight: '800',
  },

  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 17,
  },

  noticeIcon: {
    fontSize: 17,
    marginRight: 9,
  },

  noticeText: {
    flex: 1,
    color: '#81765A',
    fontSize: 10,
    lineHeight: 16,
  },

  continueButton: {
    minHeight: 64,
    backgroundColor: '#16794B',
    borderRadius: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },

  buttonSmall: {
    color: '#DCEDE4',
    fontSize: 9,
  },

  buttonAmount: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorTitle: {
    color: '#17231C',
    fontSize: 20,
    fontWeight: '700',
  },

  backLink: {
    color: '#16794B',
    marginTop: 15,
    fontWeight: '700',
  },
});