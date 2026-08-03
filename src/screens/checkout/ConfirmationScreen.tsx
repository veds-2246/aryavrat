import React from 'react';

import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  CommonActions,
} from '@react-navigation/native';

import {
  RootStackParamList,
} from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Confirmation'
>;

const ConfirmationScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    type,
    quantity,
    referenceId,
  } = route.params;

  const isSubscription = type === 'subscription';

  const formatQuantity = (litres: number) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
          },
        ],
      }),
    );
  };

  const viewOrders = () => {
    // Reset to Home then open Orders tab
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            state: {
              routes: [{ name: 'Orders' }],
            },
          },
        ],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <View style={styles.content}>

        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.successLabel}>
          SUCCESS
        </Text>

        <Text style={styles.title}>
          {isSubscription
            ? 'Subscription Started Successfully'
            : 'Order Placed Successfully'}
        </Text>

        <Text style={styles.subtitle}>
          {isSubscription
            ? 'Your subscription is active. You will receive your deliveries automatically.'
            : 'Your order has been placed and is being prepared for delivery.'}
        </Text>

        <View style={styles.card}>

          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.reference}>{referenceId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Estimated delivery</Text>
            <Text style={styles.value}>Tomorrow Morning</Text>
          </View>

        </View>

        <View style={styles.infoBox}>

          <Text style={styles.infoIcon}>📦</Text>

          <Text style={styles.infoText}>
            You can view or manage your orders from the Orders screen.
          </Text>

        </View>

        <View style={styles.bottomArea}>

          <Pressable
            style={styles.ordersButton}
            onPress={viewOrders}>

            <Text style={styles.ordersButtonText}>
              View Orders
            </Text>

          </Pressable>

          <Pressable
            style={styles.homeButton}
            onPress={goHome}>

            <Text style={styles.homeButtonText}>
              Continue Shopping
            </Text>

          </Pressable>

        </View>

      </View>
    </SafeAreaView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 65,
    alignItems: 'center',
  },

  successCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '700',
  },

  successLabel: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 25,
  },

  title: {
    color: '#17231C',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },

  subtitle: {
    color: '#748078',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 9,
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 15,
    padding: 17,
    marginTop: 30,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#7C8880',
    fontSize: 12,
  },

  value: {
    color: '#25352B',
    fontSize: 12,
    fontWeight: '700',
  },

  reference: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7ECE9',
    marginVertical: 13,
  },

  infoBox: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#EAF5EF',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },

  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    color: '#60776A',
    fontSize: 11,
    lineHeight: 17,
  },

  bottomArea: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 30,
  },

  ordersButton: {
    height: 56,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ordersButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  homeButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  homeButtonText: {
    color: '#16794B',
    fontSize: 14,
    fontWeight: '700',
  },
});