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

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../navigation/types';
import {useOrders} from '../../context/OrderContext';
import {AppOrder} from '../../types/orders';

type TabType = 'upcoming' | 'subscriptions' | 'past';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OrdersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {orders} = useOrders();

  const [activeTab, setActiveTab] =
    useState<TabType>('upcoming');

  const formatQuantity = (litres: number) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const formatSchedule = (order: AppOrder) => {
  if (order.schedule === 'daily') {
    return 'Daily';
  }

  if (order.schedule === 'custom') {
    return (
      order.selectedDays?.join(', ') ||
      'Custom Days'
    );
  }

  return 'Not set';
};

  const isOrderCancelled = (order: AppOrder) => {
    if (order.status === 'cancelled') {
      return true;
    }

    if (
      order.type === 'subscription' &&
      order.subscriptionStatus === 'cancelled'
    ) {
      return true;
    }

    return false;
  };

  const getStatus = (order: AppOrder) => {
    if (isOrderCancelled(order)) {
      return 'CANCELLED';
    }

    if (order.type === 'subscription') {
      if (order.subscriptionStatus === 'paused') {
        return 'PAUSED';
      }

      return 'ACTIVE';
    }

    if (order.status === 'completed') {
      return 'COMPLETED';
    }

    return 'CONFIRMED';
  };

  const getFilteredOrders = () => {
    if (activeTab === 'upcoming') {
      return orders.filter(order => {
        return (
          order.type === 'buyOnce' &&
          order.status === 'confirmed'
        );
      });
    }

    if (activeTab === 'subscriptions') {
      return orders.filter(order => {
        return (
          order.type === 'subscription' &&
          order.subscriptionStatus !== 'cancelled'
        );
      });
    }

    return orders.filter(order => {
      const normalOrderFinished =
        order.status === 'completed' ||
        order.status === 'cancelled';

      const subscriptionCancelled =
        order.type === 'subscription' &&
        order.subscriptionStatus === 'cancelled';

      return normalOrderFinished || subscriptionCancelled;
    });
  };

  const handleOrderPress = (order: AppOrder) => {
    if (order.type === 'buyOnce') {
      navigation.navigate('OrderDetails', {
        orderId: order.id,
      });

      return;
    }

    navigation.navigate('ManageSubscription', {
      subscriptionId: order.id,
    });
  };

  const renderOrder = (order: AppOrder) => {
    const isSubscription =
      order.type === 'subscription';

    const cancelled =
      isOrderCancelled(order);

    const paused =
      isSubscription &&
      order.subscriptionStatus === 'paused';

    return (
      <Pressable
        key={order.id}
        style={styles.orderCard}
        onPress={() => handleOrderPress(order)}>

        <View style={styles.cardHeader}>

          <View style={styles.productIcon}>
            <Text style={styles.milkEmoji}>
              🥛
            </Text>
          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              {order.productName}
            </Text>

            <Text style={styles.orderReference}>
              {order.id}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,
              cancelled
                ? styles.cancelledStatusBadge
                : undefined,
              paused
                ? styles.pausedStatusBadge
                : undefined,
            ]}>

            <Text
              style={[
                styles.statusText,
                cancelled
                  ? styles.cancelledStatusText
                  : undefined,
                paused
                  ? styles.pausedStatusText
                  : undefined,
              ]}>

              {getStatus(order)}

            </Text>

          </View>

        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>

          <View style={styles.detailBlock}>

            <Text style={styles.detailLabel}>
              Quantity
            </Text>

            <Text style={styles.detailValue}>
              {formatQuantity(order.quantity)}
            </Text>

          </View>

          <View style={styles.rightDetail}>

            <Text style={styles.detailLabel}>
              {isSubscription
                ? 'Schedule'
                : 'Delivery'}
            </Text>

            <Text style={styles.detailValue}>
              {isSubscription
                ? formatSchedule(order)
                : order.deliveryDate || 'Scheduled'}
            </Text>

          </View>

        </View>

        {isSubscription ? (
          <View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>

              <View style={styles.detailBlock}>

                <Text style={styles.detailLabel}>
                  Starts
                </Text>

                <Text style={styles.detailValue}>
                  {order.startDate || 'Scheduled'}
                </Text>

              </View>

              <View style={styles.rightDetail}>

                <Text style={styles.detailLabel}>
                  Est. monthly
                </Text>

                <Text style={styles.price}>
                  ₹
                  {order.estimatedMonthlyCost
                    ? order.estimatedMonthlyCost.toFixed(0)
                    : '0'}
                </Text>

              </View>

            </View>

            {order.nextDeliverySkipped ? (
              <View style={styles.skippedBox}>

                <Text style={styles.skippedText}>
                  ✓ Next delivery skipped
                </Text>

              </View>
            ) : null}

          </View>
        ) : (
          <View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>

              <Text style={styles.detailLabel}>
                Order total
              </Text>

              <Text style={styles.price}>
                ₹{order.pricePerDelivery.toFixed(0)}
              </Text>

            </View>

          </View>
        )}

        {!cancelled ? (
          <View style={styles.morningBox}>

            <Text style={styles.morningText}>
              🌅 Morning delivery
            </Text>

          </View>
        ) : null}

      </Pressable>
    );
  };

  const filteredOrders = getFilteredOrders();

  const getEmptyTitle = () => {
    if (activeTab === 'subscriptions') {
      return 'No active subscriptions';
    }

    if (activeTab === 'past') {
      return 'No past orders';
    }

    return 'No upcoming orders';
  };

  const getEmptyText = () => {
    if (activeTab === 'subscriptions') {
      return 'Your active milk subscriptions will appear here.';
    }

    if (activeTab === 'past') {
      return 'Your completed and cancelled orders will appear here.';
    }

    return 'Your upcoming one-time deliveries will appear here.';
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

        <Text style={styles.eyebrow}>
          ARYAVRAT
        </Text>

        <Text style={styles.title}>
          My Orders
        </Text>

        <Text style={styles.subtitle}>
          Track your upcoming milk deliveries and manage your subscriptions.
        </Text>

        <View style={styles.tabsContainer}>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'upcoming'
                ? styles.activeTab
                : undefined,
            ]}
            onPress={() => setActiveTab('upcoming')}>

            <Text
              style={[
                styles.tabText,
                activeTab === 'upcoming'
                  ? styles.activeTabText
                  : undefined,
              ]}>
              Upcoming
            </Text>

          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'subscriptions'
                ? styles.activeTab
                : undefined,
            ]}
            onPress={() => setActiveTab('subscriptions')}>

            <Text
              style={[
                styles.tabText,
                activeTab === 'subscriptions'
                  ? styles.activeTabText
                  : undefined,
              ]}>
              Subscriptions
            </Text>

          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'past'
                ? styles.activeTab
                : undefined,
            ]}
            onPress={() => setActiveTab('past')}>

            <Text
              style={[
                styles.tabText,
                activeTab === 'past'
                  ? styles.activeTabText
                  : undefined,
              ]}>
              Past
            </Text>

          </Pressable>

        </View>

        {filteredOrders.length > 0 ? (
          <View style={styles.ordersContainer}>

            {filteredOrders.map(order =>
              renderOrder(order),
            )}

          </View>
        ) : (
          <View style={styles.emptyState}>

            <View style={styles.emptyIcon}>
              <Text style={styles.emptyEmoji}>
                🥛
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              {getEmptyTitle()}
            </Text>

            <Text style={styles.emptyText}>
              {getEmptyText()}
            </Text>

          </View>
        )}

      </ScrollView>

    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 110,
  },

  eyebrow: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 10,
  },

  title: {
    color: '#17231C',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 6,
  },

  subtitle: {
    color: '#748078',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAF0EC',
    borderRadius: 11,
    padding: 4,
    marginTop: 25,
  },

  tab: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
  },

  tabText: {
    color: '#7A867E',
    fontSize: 11,
    fontWeight: '600',
  },

  activeTabText: {
    color: '#16794B',
    fontWeight: '800',
  },

  ordersContainer: {
    marginTop: 20,
  },

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E9E5',
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 50,
    height: 50,
    borderRadius: 11,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  milkEmoji: {
    fontSize: 26,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '700',
  },

  orderReference: {
    color: '#929C96',
    fontSize: 9,
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  statusText: {
    color: '#16794B',
    fontSize: 8,
    fontWeight: '800',
  },

  cancelledStatusBadge: {
    backgroundColor: '#FDECEC',
  },

  cancelledStatusText: {
    color: '#B54545',
  },

  pausedStatusBadge: {
    backgroundColor: '#FFF3D9',
  },

  pausedStatusText: {
    color: '#9A7019',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7ECE9',
    marginVertical: 14,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailBlock: {
    flex: 1,
  },

  detailLabel: {
    color: '#929C96',
    fontSize: 9,
  },

  detailValue: {
    color: '#35433A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },

  rightDetail: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 15,
  },

  price: {
    color: '#16794B',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  morningBox: {
    backgroundColor: '#F0F8F4',
    borderRadius: 8,
    padding: 9,
    marginTop: 14,
  },

  morningText: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '600',
  },

  skippedBox: {
    backgroundColor: '#EAF5EF',
    borderRadius: 8,
    padding: 9,
    marginTop: 14,
  },

  skippedText: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '700',
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 85,
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 35,
  },

  emptyTitle: {
    color: '#25352B',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },

  emptyText: {
    color: '#89938D',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },
});