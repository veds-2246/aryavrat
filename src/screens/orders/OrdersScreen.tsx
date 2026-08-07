import React, {useEffect, useMemo, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';

import {useNavigation, useRoute, RouteProp, CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../navigation/types';
import {MainTabParamList} from '../../navigation/MainTabs';
import {useOrders} from '../../context/OrderContext';
import {AppOrder} from '../../types/orders';

import OrderCard from './OrderCard';
import OrderFilterTabs from './OrderFilterTabs';
import EmptyOrders from './EmptyOrders';

type Filter = 'all' | 'buyOnce' | 'subscription';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Orders'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type OrdersRouteProp = RouteProp<MainTabParamList, 'Orders'>;

const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrdersRouteProp>();

  const {orders, isHydrated} = useOrders();

  const [filter, setFilter] =
    useState<Filter>('all');

  const requestedFilter =
    route.params?.initialFilter;

  useEffect(() => {
    if (!requestedFilter) {
      return;
    }

    setFilter(requestedFilter);
    navigation.setParams({
      initialFilter: undefined,
    });
  }, [requestedFilter, navigation]);
  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'buyOnce') return orders.filter(o => o.type === 'buyOnce');
    return orders.filter(o => o.type === 'subscription');
  }, [orders, filter]);

  const handlePress = (order: AppOrder) => {
    if (order.type === 'subscription') {
      navigation.navigate('SubscriptionDetails', {
        subscriptionId: order.id,
      });
    } else {
      navigation.navigate('OrderDetails', {
        orderId: order.id,
      });
    }
  };
  const handleContinue = () => {
    navigation.navigate('HomeTab' as never);
  };

  const renderItem = ({item}: ListRenderItemInfo<AppOrder>) => {
    return <OrderCard order={item} onPress={handlePress} />;
  };

  const keyExtractor = (item: AppOrder) => item.id;

  const emptyTitle = filter === 'subscription' ? 'No active subscriptions' : filter === 'buyOnce' ? 'No orders' : 'No orders yet';
  const emptyText = filter === 'subscription' ? 'Your active milk subscriptions will appear here.' : 'Your orders will appear here.';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>ARYAVRAT</Text>
        <Text style={styles.title}>Orders</Text>
      </View>

      <View style={styles.content}>
        <OrderFilterTabs active={filter} onChange={setFilter} />

        {(!isHydrated || (filtered.length === 0 && isHydrated)) ? (
          <View style={styles.emptyWrap}>
            <EmptyOrders title={emptyTitle} subtitle={emptyText} onContinue={handleContinue} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FBF9'},
  header: {paddingTop: 18, paddingHorizontal: 20},
  eyebrow: {color: '#16794B', fontSize: 10, fontWeight: '800', letterSpacing: 1.4},
  title: {color: '#17231C', fontSize: 29, fontWeight: '800', marginTop: 6},
  content: {padding: 20, paddingBottom: 120},
  listContent: {paddingTop: 20, paddingBottom: 40},
  emptyWrap: {paddingTop: 20},
});