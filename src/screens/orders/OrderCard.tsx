import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {AppOrder} from '../../types/orders';
import OrderStatusChip from './OrderStatusChip';

type Props = {
  order: AppOrder;
  onPress: (order: AppOrder) => void;
};

const formatQuantity = (litres: number) => {
  if (litres === 0.5) return '500 ml';
  return `${litres} L`;
};

const formatSchedule = (order: AppOrder) => {
  if (order.schedule === 'daily') return 'Daily';
  if (order.schedule === 'custom') return order.selectedDays?.join(', ') || 'Custom Days';
  return 'Not set';
};

const OrderCard: React.FC<Props> = ({order, onPress}) => {
  const isSubscription = order.type === 'subscription';

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => onPress(order)}>

      <View style={styles.header}>

        <View style={styles.iconBox}>
          <Text style={styles.icon}>🥛</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.productName}>{order.productName}</Text>
          <Text style={styles.reference}>{order.id}</Text>
        </View>

        <OrderStatusChip type={order.type} status={order.type === 'subscription' ? (order.subscriptionStatus ?? '') : order.status} />

      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.block}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.value}>{formatQuantity(order.quantity)}</Text>
        </View>

        <View style={[styles.block, styles.rightBlock]}>
          <Text style={styles.label}>{isSubscription ? 'Schedule' : 'Delivery'}</Text>
          <Text style={styles.value}>{isSubscription ? formatSchedule(order) : order.deliveryDate ?? 'Scheduled'}</Text>
        </View>
      </View>

      {isSubscription ? (
        <>
          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.block}>
              <Text style={styles.label}>Starts</Text>
              <Text style={styles.value}>{order.startDate ?? 'Scheduled'}</Text>
            </View>

            <View style={[styles.block, styles.rightBlock]}>
              <Text style={styles.label}>Est. monthly</Text>
              <Text style={styles.price}>₹{order.estimatedMonthlyCost ? order.estimatedMonthlyCost.toFixed(0) : '0'}</Text>
            </View>
          </View>

          {order.nextDeliverySkipped ? (
            <View style={styles.skippedBox}>
              <Text style={styles.skippedText}>✓ Next delivery skipped</Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.label}>Order total</Text>
            <Text style={styles.price}>₹{order.pricePerDelivery.toFixed(0)}</Text>
          </View>
        </>
      )}

      {!(
        order.status === 'cancelled' ||
        (order.type === 'subscription' && order.subscriptionStatus === 'cancelled')
      ) ? (
        <View style={styles.morningBox}>
          <Text style={styles.morningText}>🌅 Morning delivery</Text>
        </View>
      ) : null}

      <View style={styles.chevronBox}>
        <Text style={styles.chevron}>›</Text>
      </View>

    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E9E5',
    borderRadius: 15,
    padding: 16,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 11,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {fontSize: 26},
  info: {flex: 1, marginLeft: 12},
  productName: {color: '#17231C', fontSize: 14, fontWeight: '700'},
  reference: {color: '#929C96', fontSize: 9, marginTop: 4},
  divider: {height: 1, backgroundColor: '#E7ECE9', marginVertical: 14},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  block: {flex: 1},
  rightBlock: {alignItems: 'flex-end', marginLeft: 15},
  label: {color: '#929C96', fontSize: 9},
  value: {color: '#35433A', fontSize: 11, fontWeight: '700', marginTop: 4},
  price: {color: '#16794B', fontSize: 14, fontWeight: '800', marginTop: 3},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  morningBox: {backgroundColor: '#F0F8F4', borderRadius: 8, padding: 9, marginTop: 14},
  morningText: {color: '#16794B', fontSize: 10, fontWeight: '600'},
  skippedBox: {backgroundColor: '#EAF5EF', borderRadius: 8, padding: 9, marginTop: 14},
  skippedText: {color: '#16794B', fontSize: 10, fontWeight: '700'},
  chevronBox: {position: 'absolute', right: 12, top: 12},
  chevron: {fontSize: 20, color: '#9AA6A0'},
});