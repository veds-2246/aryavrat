import React from 'react';

import {
  Alert,
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
  useOrders,
} from '../../context/OrderContext';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'OrderDetails'
>;

const OrderDetailsScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    getOrderById,
    updateOrderStatus,
  } = useOrders();

  const order =
    getOrderById(route.params.orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.notFound}>

          <Text style={styles.notFoundEmoji}>
            🥛
          </Text>

          <Text style={styles.notFoundTitle}>
            Order not found
          </Text>

          <Text style={styles.notFoundText}>
            This order is no longer available.
          </Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() =>
              navigation.goBack()
            }>

            <Text style={styles.backHomeText}>
              Go Back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );
  }

  const formatQuantity = (
    litres: number,
  ) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const formatCreatedAt = () => {
    const date =
      new Date(order.createdAt);

    return date.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel order?',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'Keep Order',
          style: 'cancel',
        },

        {
          text: 'Cancel Order',
          style: 'destructive',

          onPress: () => {
            updateOrderStatus(
              order.id,
              'cancelled',
            );

            navigation.goBack();
          },
        },
      ],
    );
  };

  const isCancelled =
    order.status === 'cancelled';

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

        <Text style={styles.eyebrow}>
          ORDER DETAILS
        </Text>

        <View style={styles.titleRow}>

          <View>

            <Text style={styles.title}>
              Your order
            </Text>

            <Text style={styles.reference}>
              {order.id}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,

              isCancelled &&
                styles.cancelledBadge,
            ]}>

            <Text
              style={[
                styles.statusText,

                isCancelled &&
                  styles.cancelledText,
              ]}>

              {isCancelled
                ? 'CANCELLED'
                : 'CONFIRMED'}

            </Text>

          </View>

        </View>

        <View style={styles.heroCard}>

          <View style={styles.milkIcon}>

            <Text style={styles.milkEmoji}>
              🥛
            </Text>

          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              {order.productName}
            </Text>

            <Text style={styles.quantity}>
              {formatQuantity(
                order.quantity,
              )}
            </Text>

          </View>

          <Text style={styles.price}>
            ₹
            {order.pricePerDelivery.toFixed(
              0,
            )}
          </Text>

        </View>

        <Text style={styles.sectionTitle}>
          Delivery details
        </Text>

        <View style={styles.card}>

          <View style={styles.detailRow}>

            <View style={styles.detailIcon}>

              <Text style={styles.icon}>
                📅
              </Text>

            </View>

            <View style={styles.detailContent}>

              <Text style={styles.label}>
                Delivery date
              </Text>

              <Text style={styles.value}>
                {order.deliveryDate ||
                  'Scheduled'}
              </Text>

            </View>

          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>

            <View style={styles.detailIcon}>

              <Text style={styles.icon}>
                🌅
              </Text>

            </View>

            <View style={styles.detailContent}>

              <Text style={styles.label}>
                Delivery slot
              </Text>

              <Text style={styles.value}>
                Morning
              </Text>

            </View>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Order information
        </Text>

        <View style={styles.card}>

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Order ID
            </Text>

            <Text style={styles.infoValue}>
              {order.id}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Order placed
            </Text>

            <Text style={styles.infoValue}>
              {formatCreatedAt()}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Quantity
            </Text>

            <Text style={styles.infoValue}>
              {formatQuantity(
                order.quantity,
              )}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <Text style={styles.totalLabel}>
              Order total
            </Text>

            <Text style={styles.totalValue}>
              ₹
              {order.pricePerDelivery.toFixed(
                0,
              )}
            </Text>

          </View>

        </View>

        {!isCancelled && (
          <View style={styles.cutoffBox}>

            <Text style={styles.cutoffIcon}>
              ⏰
            </Text>

            <Text style={styles.cutoffText}>
              Orders can only be modified or
              cancelled before the daily cutoff
              time. This rule will be enforced
              by the backend later.
            </Text>

          </View>
        )}

        {isCancelled ? (

          <View style={styles.cancelledBox}>

            <Text style={styles.cancelledIcon}>
              ×
            </Text>

            <View style={styles.cancelledInfo}>

              <Text
                style={
                  styles.cancelledTitle
                }>
                Order cancelled
              </Text>

              <Text
                style={
                  styles.cancelledDescription
                }>
                This delivery has been
                cancelled.
              </Text>

            </View>

          </View>

        ) : (

          <Pressable
            style={styles.cancelButton}
            onPress={handleCancelOrder}>

            <Text style={styles.cancelButtonText}>
              Cancel Order
            </Text>

          </Pressable>

        )}

      </ScrollView>

    </SafeAreaView>
  );
};

export default OrderDetailsScreen;

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

  eyebrow: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },

  title: {
    color: '#17231C',
    fontSize: 28,
    fontWeight: '800',
  },

  reference: {
    color: '#8B9690',
    fontSize: 10,
    marginTop: 5,
  },

  statusBadge: {
    backgroundColor: '#EAF5EF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  statusText: {
    color: '#16794B',
    fontSize: 8,
    fontWeight: '800',
  },

  cancelledBadge: {
    backgroundColor: '#FDECEC',
  },

  cancelledText: {
    color: '#B54545',
  },

  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 15,
    padding: 16,
    marginTop: 25,
  },

  milkIcon: {
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

  quantity: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 5,
  },

  price: {
    color: '#16794B',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 27,
    marginBottom: 11,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 15,
    padding: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 19,
  },

  detailContent: {
    marginLeft: 12,
  },

  label: {
    color: '#929C96',
    fontSize: 9,
  },

  value: {
    color: '#35433A',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E7ECE9',
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    color: '#7C8880',
    fontSize: 11,
  },

  infoValue: {
    flex: 1,
    color: '#35433A',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    marginLeft: 20,
  },

  totalLabel: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '800',
  },

  totalValue: {
    color: '#16794B',
    fontSize: 18,
    fontWeight: '800',
  },

  cutoffBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },

  cutoffIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  cutoffText: {
    flex: 1,
    color: '#81765A',
    fontSize: 10,
    lineHeight: 16,
  },

  cancelButton: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D85C5C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  cancelButtonText: {
    color: '#C94E4E',
    fontSize: 14,
    fontWeight: '700',
  },

  cancelledBox: {
    flexDirection: 'row',
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
  },

  cancelledIcon: {
    color: '#B54545',
    fontSize: 24,
    marginRight: 12,
  },

  cancelledInfo: {
    flex: 1,
  },

  cancelledTitle: {
    color: '#A33E3E',
    fontSize: 13,
    fontWeight: '700',
  },

  cancelledDescription: {
    color: '#A86B6B',
    fontSize: 10,
    marginTop: 4,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  notFoundEmoji: {
    fontSize: 50,
  },

  notFoundTitle: {
    color: '#17231C',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 15,
  },

  notFoundText: {
    color: '#7C8880',
    fontSize: 12,
    marginTop: 7,
  },

  backHomeButton: {
    backgroundColor: '#16794B',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 13,
    marginTop: 20,
  },

  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});