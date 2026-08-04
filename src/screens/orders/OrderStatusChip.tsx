import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  OrderType,
  OrderStatus,
  SubscriptionStatus,
} from '../../types/orders';

type Props = {
  type: OrderType;
  status: OrderStatus | SubscriptionStatus | string;
};

const OrderStatusChip: React.FC<Props> = ({type, status}) => {
  const s = String(status).toLowerCase();

  let backgroundColor = '#EAF5EF';
  let textColor = '#16794B';
  let label = String(status).toUpperCase();

  if (type === 'buyOnce') {
    if (s === 'confirmed') {
      backgroundColor = '#EAF5EF';
      textColor = '#16794B';
      label = 'CONFIRMED';
    } else if (s === 'preparing') {
      backgroundColor = '#FFF3D9';
      textColor = '#9A7019';
      label = 'PREPARING';
    } else if (s === 'outfordelivery' || s === 'out for delivery' || s === 'outfordelivery') {
      backgroundColor = '#E6F0FF';
      textColor = '#2A76D2';
      label = 'OUT FOR DELIVERY';
    } else if (s === 'completed' || s === 'delivered') {
      backgroundColor = '#EAF5EF';
      textColor = '#0F5C33';
      label = 'DELIVERED';
    } else if (s === 'cancelled') {
      backgroundColor = '#FDECEC';
      textColor = '#B54545';
      label = 'CANCELLED';
    }
  } else {
    if (s === 'active') {
      backgroundColor = '#EAF5EF';
      textColor = '#16794B';
      label = 'ACTIVE';
    } else if (s === 'paused') {
      backgroundColor = '#FFF3D9';
      textColor = '#9A7019';
      label = 'PAUSED';
    } else if (s === 'cancelled') {
      backgroundColor = '#FDECEC';
      textColor = '#B54545';
      label = 'CANCELLED';
    }
  }

  return (
    <View style={[styles.container, {backgroundColor}]}> 
      <Text style={[styles.label, {color: textColor}]}> {label} </Text>
    </View>
  );
};

export default OrderStatusChip;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});