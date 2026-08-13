import React, {useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppOrder } from '../../types/orders';

import { createOrder } from '../../services/OrderService';
import {createSubscription} from '../../services/SubscriptionService';
import { useAuth } from '../../context/AuthContext';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../../navigation/types';

import {
  fetchProductById,
} from '../../services/ProductService';

import {
  useNotifications,
} from '../../context/NotificationContext';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderReview'
>;

const OrderReviewScreen = ({
  navigation,
  route,
}: Props) => {
  const {
  orderType,
  productId,
  quantity,
  deliveryOption,
  address,
  addressId,
} = route.params;

const {userId} = useAuth();

const [loading, setLoading] = useState(true);
const [product, setProduct] = useState<any>(null);

const {addNotification} = useNotifications();

useEffect(() => {
  const loadProduct = async () => {
    try {
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product', error);
    } finally {
      setLoading(false);
    }
  };

  loadProduct();
}, [productId]);


  if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorContainer}>
        <Text>Loading order...</Text>
      </View>
    </SafeAreaView>
  );
}

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.errorContainer}>

          <Text style={styles.errorTitle}>
            Product unavailable
          </Text>

          <Pressable
            onPress={() => navigation.goBack()}>

            <Text style={styles.backLink}>
              Go back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );
  }

  const subtotal = product.price * quantity;

  // Free delivery for now.
  // Later this can come from business settings.
  const deliveryCharge = 0;

  const total =
    subtotal + deliveryCharge;

  const formatQuantity = (
    litres: number,
  ) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const getDeliveryDate = () => {
    const date = new Date();

    const daysToAdd =
      deliveryOption === 'tomorrow'
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

  const handlePayment = async () => {
  if (!userId || !addressId) {
    return;
  }

  try {
    const deliveryDate = new Date().toISOString().split('T')[0];

    if (orderType === 'buyOnce') {
      const createdOrder = await createOrder({
        user_id: userId!,
        address_id: addressId!,
        product_id: product.id,
        product_name: product.name,
        quantity,
        price_per_unit: product.price,
        total_amount: total,
        delivery_date: deliveryDate,
        delivery_address: address
          ? `${address.house}, ${address.area}, ${address.city} - ${address.pincode}`
          : 'Home Address',
        type: 'buyOnce',
      });

      addNotification({
        id: Date.now().toString(),
        title: '📦 Order Confirmed',
        message: `${quantity} L ${product.name} order placed successfully.`,
        type: 'order',
        createdAt: new Date().toLocaleString(),
        isRead: false,
      });

      navigation.navigate('Confirmation', {
        type: 'buyOnce',
        productId,
        quantity,
        referenceId: createdOrder.id,
      });

      return;
    }

    const createdSubscription = await createSubscription({
      user_id: userId!,
      address_id: addressId!,
      product_id: product.id,
      product_name: product.name,
      quantity,
      schedule: 'daily',
      start_date: deliveryDate,
    });

    addNotification({
      id: Date.now().toString(),
      title: '🥛 Subscription Started',
      message: `${quantity} L ${product.name} subscription is now active.`,
      type: 'subscription',
      createdAt: new Date().toLocaleString(),
      isRead: false,
    });

    navigation.navigate('Confirmation', {
      type: 'subscription',
      productId,
      quantity,
      referenceId: createdSubscription.id,
    });
    } catch (error) {
    console.error('Failed to complete checkout', error);
  }
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
          ORDER REVIEW
        </Text>

        <Text style={styles.title}>
          Review your order
        </Text>

        <Text style={styles.subtitle}>
          Check your order and delivery
          details before proceeding to
          payment.
        </Text>

        <Text style={styles.sectionTitle}>
          Your order
        </Text>

        <View style={styles.card}>

          <View style={styles.productRow}>

            <View style={styles.productImage}>
              <Text style={styles.milkEmoji}>🥛</Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>

              <Text style={styles.variantText}>Variant: {formatQuantity(quantity)}</Text>

              <Text style={styles.quantityText}>Quantity: {quantity}</Text>
            </View>

            <View style={styles.priceInfo}>
              <Text style={styles.productPrice}>₹{subtotal.toFixed(0)}</Text>

              <Text style={styles.pricePerLitre}>₹{product.price}/L</Text>
            </View>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Delivery
        </Text>

        <View style={styles.card}>

          <View style={styles.detailRow}>

            <Text
              style={styles.detailIcon}>
              📅
            </Text>

            <View style={styles.detailInfo}>

             <Text style={styles.detailLabel}>
  Delivery
</Text>

              <Text
                style={styles.detailValue}>
                Tomorrow Morning
              </Text>

            </View>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Deliver to
        </Text>

        <View style={styles.card}>

          <View style={styles.detailRow}>

            <Text
              style={styles.detailIcon}>
              📍
            </Text>

            <View style={styles.detailInfo}>

              {address ? (
                <>
                  <Text style={styles.addressName}>{address.fullName}</Text>

                  <Text style={styles.addressText}>{address.house}, {address.area}</Text>

                  {address.landmark !== '' && (<Text style={styles.addressText}>Near {address.landmark}</Text>)}

                  <Text style={styles.addressText}>{address.city} - {address.pincode}</Text>

                  <Text style={styles.phone}>+91 {address.phone}</Text>
                </>
              ) : (
                <Text style={styles.addressText}>No address selected</Text>
              )}

            </View>

            <Pressable
              onPress={() =>
                navigation.navigate('CheckoutAddress', {
  orderType: 'buyOnce',
                  productId,
                  quantity,
                  deliveryOption,
                })
              }>

              <Text style={styles.change}>
                Change
              </Text>

            </Pressable>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Payment summary
        </Text>

        <View style={styles.summaryCard}>

          <View style={styles.summaryRow}>

            <Text
              style={styles.summaryLabel}>
              Milk Total
            </Text>

            <Text
              style={styles.summaryValue}>
              ₹{subtotal.toFixed(0)}
            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text
              style={styles.summaryLabel}>
              Delivery charge
            </Text>

            <Text
              style={styles.freeText}>

              {deliveryCharge === 0
                ? 'FREE'
                : `₹${deliveryCharge}`}

            </Text>

          </View>

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Discount
            </Text>

            <Text style={styles.summaryValue}>
              ₹0
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>

            <View>

              <Text style={styles.totalLabel}>
                Grand Total
              </Text>

              <Text style={styles.taxText}>
                Inclusive of applicable taxes
              </Text>

            </View>

            <Text style={styles.grandTotalValue}>
              ₹{total.toFixed(0)}
            </Text>

          </View>

        </View>

        <View style={styles.paymentMethodCard}>

          <View style={styles.paymentOptionRow}>

            <View style={styles.upiIcon}>
              <Text style={styles.milkEmoji}>🔺</Text>
            </View>

            <View style={styles.paymentOptionInfo}>
              <Text style={styles.paymentOptionTitle}>UPI</Text>
              <Text style={styles.paymentOptionSubtitle}>Pay securely using your UPI app</Text>
            </View>

          </View>

        </View>

        <View style={styles.paymentInfo}>

          <Text
            style={styles.paymentInfoIcon}>
            🔒
          </Text>

          <Text
            style={styles.paymentInfoText}>
            You'll be redirected to your
            preferred UPI app to complete
            payment securely.
          </Text>

        </View>

        <Pressable
          style={styles.paymentButton}
          onPress={handlePayment}>

          <View>

            <Text
              style={
                styles.paymentButtonLabel
              }>
              order total
            </Text>

            <Text
              style={
                styles.paymentButtonAmount
              }>
              ₹{total.toFixed(0)}
            </Text>

          </View>

          <Text style={styles.paymentArrow}>
            place order ›
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
};



export default OrderReviewScreen;

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

  productImage: {
    width: 64,
    height: 64,
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

  variantText: {
    color: '#7C8880',
    fontSize: 12,
    marginTop: 6,
  },

  quantityText: {
    color: '#6F7D74',
    fontSize: 12,
    marginTop: 4,
  },

  priceInfo: {
    alignItems: 'flex-end',
  },

  pricePerLitre: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 6,
  },

  productCalculation: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 5,
  },

  productPrice: {
    color: '#16794B',
    fontSize: 16,
    fontWeight: '800',
  },

  detailRow: {
    flexDirection: 'row',
  },

  detailIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  detailInfo: {
    flex: 1,
  },

  detailLabel: {
    color: '#89938D',
    fontSize: 10,
  },

  detailValue: {
    color: '#25352B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  morning: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
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

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 17,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },

  summaryLabel: {
    color: '#748078',
    fontSize: 13,
  },

  summaryValue: {
    color: '#35433A',
    fontSize: 13,
    fontWeight: '600',
  },

  freeText: {
    color: '#16794B',
    fontSize: 12,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#E4EAE6',
    marginVertical: 10,
  },

  totalLabel: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '800',
  },

  taxText: {
    color: '#9AA29D',
    fontSize: 9,
    marginTop: 3,
  },

  totalValue: {
    color: '#16794B',
    fontSize: 21,
    fontWeight: '800',
  },

  grandTotalValue: {
    color: '#16794B',
    fontSize: 21,
    fontWeight: '800',
  },

  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 12,
    marginTop: 16,
  },

  paymentOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  upiIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F9F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  paymentOptionInfo: {
    flex: 1,
  },

  paymentOptionTitle: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '700',
  },

  paymentOptionSubtitle: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 2,
  },

  paymentInfo: {
    flexDirection: 'row',
    backgroundColor: '#F1F6F3',
    borderRadius: 11,
    padding: 13,
    marginTop: 18,
  },

  paymentInfoIcon: {
    fontSize: 15,
    marginRight: 8,
  },

  paymentInfoText: {
    flex: 1,
    color: '#68776E',
    fontSize: 10,
    lineHeight: 16,
  },

  paymentButton: {
    minHeight: 64,
    backgroundColor: '#16794B',
    borderRadius: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },

  paymentButtonLabel: {
    color: '#DCEDE4',
    fontSize: 10,
  },

  paymentButtonAmount: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 2,
  },

  paymentArrow: {
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