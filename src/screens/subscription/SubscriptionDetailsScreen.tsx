import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useOrders} from '../../context/OrderContext';
import {RootStackParamList} from '../../navigation/types';

type RouteParams = RouteProp<
  {SubscriptionDetails: {orderId: string}},
  'SubscriptionDetails'
>;

const SubscriptionDetailsScreen: React.FC = () => {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {orderId} = route.params;

  const {
    getOrderById,
    updateSubscriptionStatus,
    updateOrderQuantity,
    setNextDeliverySkipped,
    updateSubscriptionSchedule,
  } = useOrders();

  const subscription = getOrderById(orderId);

  if (!subscription || subscription.type !== 'subscription') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🥛</Text>
          <Text style={styles.notFoundTitle}>Subscription not found</Text>
          <Pressable style={styles.backHomeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backHomeText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const subscriptionStatus = subscription.subscriptionStatus ?? 'active';
  const isPaused = subscriptionStatus === 'paused';
  const isCancelled = subscriptionStatus === 'cancelled';

  const formatQuantity = (litres: number) => {
    if (litres === 0.5) return '500 ml';
    return `${litres} L`;
  };

  const formatSchedule = () => {
    if (subscription.schedule === 'daily') return 'Daily';
    return subscription.selectedDays?.join(', ') || 'Custom Days';
  };

  const handlePauseResume = () => {
    if (isPaused) {
      Alert.alert('Resume subscription?', 'Your scheduled milk deliveries will resume.', [
        {text: 'Not Now', style: 'cancel'},
        {text: 'Resume', onPress: () => updateSubscriptionStatus(subscription.id, 'active')},
      ]);
      return;
    }

    Alert.alert('Pause subscription?', 'Upcoming deliveries will be paused until you resume the subscription.', [
      {text: 'Keep Active', style: 'cancel'},
      {text: 'Pause', onPress: () => updateSubscriptionStatus(subscription.id, 'paused')},
    ]);
  };

  const handleSkipTomorrow = () => {
  if (isCancelled) {
    return;
  }

  if (isPaused) {
    Alert.alert(
      'Subscription Paused',
      'Resume your subscription before skipping a delivery.',
    );
    return;
  }

  if (subscription.nextDeliverySkipped) {
    Alert.alert(
      'Restore Delivery?',
      'Tomorrow\'s delivery will be restored.',
      [
        {
          text: 'Keep Skipped',
          style: 'cancel',
        },
        {
          text: 'Restore',
          onPress: () =>
            setNextDeliverySkipped(
              subscription.id,
              false,
            ),
        },
      ],
    );

    return;
  }

  Alert.alert(
    'Skip Tomorrow?',
    'Tomorrow\'s milk delivery will be skipped.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Skip',
        onPress: () =>
          setNextDeliverySkipped(
            subscription.id,
            true,
          ),
      },
    ],
  );
};

  const handleChangeQuantity = () => {
    Alert.alert('Change quantity', 'Select the milk quantity for each delivery', [
      {text: '500 ml', onPress: () => updateOrderQuantity(subscription.id, 0.5)},
      {text: '1 L', onPress: () => updateOrderQuantity(subscription.id, 1)},
      {text: '1.5 L', onPress: () => updateOrderQuantity(subscription.id, 1.5)},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const handleChangeSchedule = () => {
    // Reuse existing ChangeSubscriptionScheduleScreen route.
    navigation.navigate('ChangeSubscriptionSchedule', {subscriptionId: subscription.id});
  };

  const handleChangeAddress = () => {
    navigation.navigate('Addresses');
  };

  const handleCancel = () => {
    Alert.alert('Cancel subscription?', 'This will stop all future deliveries under this subscription.', [
      {text: 'Keep Subscription', style: 'cancel'},
      {
        text: 'Cancel Subscription',
        style: 'destructive',
        onPress: () => {
          updateSubscriptionStatus(subscription.id, 'cancelled');

        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>SUBSCRIPTION</Text>

        <View style={styles.headingRow}>
          <View>
            <Text style={styles.title}>{subscription.productName}</Text>
            <Text style={styles.reference}>{subscription.id}</Text>
          </View>

          <View style={[styles.statusBadge, isPaused && styles.pausedBadge, isCancelled && styles.cancelledBadge]}>
            <Text style={[styles.statusText, isPaused && styles.pausedText, isCancelled && styles.cancelledText]}> 
              {isCancelled ? 'CANCELLED' : isPaused ? 'PAUSED' : 'ACTIVE'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity</Text>
            <Text style={styles.infoValue}>{formatQuantity(subscription.quantity)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Schedule</Text>
            <Text style={styles.infoValue}>{subscription.schedule === 'daily' ? 'Daily' : subscription.selectedDays?.join(', ') || 'Custom'}</Text>
          </View>

          {subscription.schedule === 'custom' && subscription.selectedDays ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Selected days</Text>
                <Text style={styles.infoValue}>{subscription.selectedDays.join(', ')}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Next delivery</Text>
            <Text style={styles.infoValue}>
  {subscription.nextDeliverySkipped
    ? `${subscription.startDate ?? 'Tomorrow'} (Skipped)`
    : subscription.startDate ?? 'Scheduled'}
</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery address</Text>
            <Text style={styles.infoValue}>No address set</Text>
          </View>
        </View>

        {!isCancelled && (
          <>
            <Text style={styles.sectionTitle}>Actions</Text>

            <View style={styles.actionsContainer}>
              {!isPaused ? (
                <Pressable style={styles.actionButton} onPress={handlePauseResume}>
                  <Text style={styles.actionButtonText}>Pause Subscription</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.actionButton} onPress={handlePauseResume}>
                  <Text style={styles.actionButtonText}>Resume Subscription</Text>
                </Pressable>
              )}

              <Pressable style={styles.actionButton} onPress={handleSkipTomorrow}>
                <Text style={styles.actionButtonText}>
  {subscription.nextDeliverySkipped
    ? 'Restore Tomorrow Delivery'
    : 'Skip Tomorrow'}
</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleChangeQuantity}>
                <Text style={styles.actionButtonText}>Change Quantity</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleChangeSchedule}>
                <Text style={styles.actionButtonText}>Change Schedule</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleChangeAddress}>
                <Text style={styles.actionButtonText}>Change Address</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionDetailsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FBF9'},
  content: {padding: 20, paddingBottom: 50},
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
  backText: {fontSize: 34, color: '#17231C', lineHeight: 36},
  eyebrow: {color: '#16794B', fontSize: 10, fontWeight: '800', letterSpacing: 1.3},
  headingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 7},
  title: {color: '#17231C', fontSize: 20, fontWeight: '800'},
  reference: {color: '#929C96', fontSize: 9, marginTop: 5},
  statusBadge: {backgroundColor: '#EAF5EF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6},
  statusText: {color: '#16794B', fontSize: 10, fontWeight: '800'},
  pausedBadge: {backgroundColor: '#FFF3D9'},
  pausedText: {color: '#9A7019'},
  cancelledBadge: {backgroundColor: '#FDECEC'},
  cancelledText: {color: '#B54545'},
  card: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAE6', borderRadius: 15, padding: 16, marginTop: 20},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  infoLabel: {color: '#7C8880', fontSize: 11},
  infoValue: {flex: 1, color: '#35433A', fontSize: 11, fontWeight: '700', textAlign: 'right', marginLeft: 20},
  divider: {height: 1, backgroundColor: '#E7ECE9', marginVertical: 14},
  sectionTitle: {color: '#17231C', fontSize: 16, fontWeight: '700', marginTop: 22, marginBottom: 8},
  actionsContainer: {marginTop: 6},
  actionButton: {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E3EAE6', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10},
  actionButtonText: {color: '#25352B', fontSize: 14, fontWeight: '700'},
  cancelButton: {height: 54, borderWidth: 1, borderColor: '#D85C5C', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8},
  cancelButtonText: {color: '#C94E4E', fontSize: 14, fontWeight: '700'},
  notFound: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30},
  notFoundEmoji: {fontSize: 50},
  notFoundTitle: {color: '#17231C', fontSize: 20, fontWeight: '800', marginTop: 15},
  backHomeButton: {backgroundColor: '#16794B', borderRadius: 10, paddingHorizontal: 25, paddingVertical: 13, marginTop: 20},
  backHomeText: {color: '#FFFFFF', fontWeight: '700'},
});