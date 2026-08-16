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

import QuantitySelectorModal from '../../components/subscription/QuantitySelectorModal';

import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAddresses } from '../../context/AddressContext';
import { RootStackParamList } from '../../navigation/types';
import { useNotifications } from '../../context/NotificationContext';

import {
  fetchSubscriptionById,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  updateSubscriptionQuantity,
  UISubscription,
} from '../../services/SubscriptionService';

type RouteParams = RouteProp<RootStackParamList, 'SubscriptionDetails'>;

const SubscriptionDetailsScreen: React.FC = () => {
  const route = useRoute<RouteParams>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { subscriptionId } = route.params;

  const { addNotification } = useNotifications();

  const { getAddressById } = useAddresses();

  const [loading, setLoading] = React.useState(true);
  const [subscription, setSubscription] = React.useState<UISubscription | null>(
    null,
  );
  const [showQuantityModal, setShowQuantityModal] = React.useState(false);

  const loadSubscription = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchSubscriptionById(subscriptionId);
      console.log('SUBSCRIPTION DETAILS:', {
        schedule: data.schedule,
        selectedDays: data.selectedDays,
        nextDeliveryDate: data.nextDeliveryDate,
      });
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [subscriptionId]);

  React.useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  useFocusEffect(
    React.useCallback(() => {
      loadSubscription();
    }, [loadSubscription]),
  );

  React.useEffect(() => {
    const returnedAddressId = route.params?.addressId;
    if (!returnedAddressId) {
      return;
    }

    setSubscription(current =>
      current
        ? {
            ...current,
            addressId: returnedAddressId,
          }
        : current,
    );
  }, [route.params?.addressId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Loading subscription...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🥛</Text>
          <Text style={styles.notFoundTitle}>Subscription not found</Text>
          <Pressable
            style={styles.backHomeButton}
            onPress={() => navigation.goBack()}
          >
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

  const formatNextDelivery = (dateString?: string) => {
    if (!dateString) {
      return 'Scheduled';
    }

    const [year, month, day] = dateString.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    return `${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })} Morning`;
  };

  const handlePauseResume = () => {
    if (isPaused) {
      Alert.alert(
        'Resume subscription?',
        'Your scheduled milk deliveries will resume.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
          },
          {
            text: 'Resume',
            onPress: async () => {
              try {
                await resumeSubscription(subscription.id);
                await loadSubscription();

                addNotification({
                  id: Date.now().toString(),
                  title: '▶ Subscription Resumed',
                  message: `${subscription.productName} subscription resumed.`,
                  type: 'subscription',
                  createdAt: new Date().toLocaleString(),
                  isRead: false,
                });

                navigation.goBack();
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to resume subscription. Please try again.',
                );
              }
            },
          },
        ],
      );

      return;
    }

    Alert.alert(
      'Pause subscription?',
      'Upcoming deliveries will be paused until you resume the subscription.',
      [
        {
          text: 'Keep Active',
          style: 'cancel',
        },
        {
          text: 'Pause',
          onPress: async () => {
            try {
              await pauseSubscription(subscription.id);
              await loadSubscription();

              addNotification({
                id: Date.now().toString(),
                title: '⏸ Subscription Paused',
                message: `${subscription.productName} subscription paused.`,
                type: 'subscription',
                createdAt: new Date().toLocaleString(),
                isRead: false,
              });

              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to pause subscription. Please try again.',
              );
            }
          },
        },
      ],
    );
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
        "Tomorrow's delivery will be restored.",
        [
          {
            text: 'Keep Skipped',
            style: 'cancel',
          },
          {
            text: 'Restore',
            onPress: () => {
              setSubscription(current =>
                current
                  ? {
                      ...current,
                      nextDeliverySkipped: false,
                    }
                  : current,
              );

              addNotification({
                id: Date.now().toString(),
                title: '↩ Tomorrow Delivery Restored',
                message: `${subscription.productName} delivery has been restored.`,
                type: 'subscription',
                createdAt: new Date().toLocaleString(),
                isRead: false,
              });
            },
          },
        ],
      );

      return;
    }

    Alert.alert('Skip Tomorrow?', "Tomorrow's milk delivery will be skipped.", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Skip',
        onPress: () => {
          setSubscription(current =>
            current
              ? {
                  ...current,
                  nextDeliverySkipped: true,
                }
              : current,
          );

          addNotification({
            id: Date.now().toString(),
            title: '⏭ Tomorrow Delivery Skipped',
            message: `${subscription.productName} delivery has been skipped for tomorrow.`,
            type: 'subscription',
            createdAt: new Date().toLocaleString(),
            isRead: false,
          });
        },
      },
    ]);
  };

  const handleChangeQuantity = () => {
    setShowQuantityModal(true);
  };

  const handleSaveQuantity = async (quantity: number) => {
    try {
      await updateSubscriptionQuantity(subscription.id, quantity);
      await loadSubscription();

      addNotification({
        id: Date.now().toString(),
        title: '⚖ Quantity Updated',
        message: `${
          subscription.productName
        } quantity changed to ${formatQuantity(quantity)}.`,
        type: 'subscription',
        createdAt: new Date().toLocaleString(),
        isRead: false,
      });

      setShowQuantityModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    }
  };

  const handleChangeSchedule = () => {
    // Reuse existing ChangeSubscriptionScheduleScreen route.
    navigation.navigate('ChangeSubscriptionSchedule', {
      subscriptionId: subscription.id,
    });
  };

  const handleChangeAddress = () => {
    navigation.navigate('Addresses', {
      mode: 'select',
      selectedAddressId: subscription.addressId,
      returnScreen: 'SubscriptionDetails',
      returnSubscriptionId: subscription.id,
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this milk subscription?\n\nFuture deliveries will stop immediately.',
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription(subscription.id);
              await loadSubscription();

              addNotification({
                id: Date.now().toString(),
                title: '❌ Subscription Cancelled',
                message: `${subscription.productName} subscription has been cancelled.`,
                type: 'subscription',
                createdAt: new Date().toLocaleString(),
                isRead: false,
              });
            } catch (error) {
              Alert.alert(
                'Error',
                'Failed to cancel subscription. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>SUBSCRIPTION</Text>

        <View style={styles.headingRow}>
          <View>
            <Text style={styles.title}>{subscription.productName}</Text>
            <Text style={styles.reference}>{subscription.id}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isPaused && styles.pausedBadge,
              isCancelled && styles.cancelledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isPaused && styles.pausedText,
                isCancelled && styles.cancelledText,
              ]}
            >
              {isCancelled ? 'CANCELLED' : isPaused ? 'PAUSED' : 'ACTIVE'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity</Text>
            <Text style={styles.infoValue}>
              {formatQuantity(subscription.quantity)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Schedule</Text>
            <Text style={styles.infoValue}>
              {subscription.schedule === 'daily'
                ? 'Daily'
                : subscription.selectedDays?.join(', ') || 'Custom'}
            </Text>
          </View>

          {subscription.schedule === 'custom' && subscription.selectedDays ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Selected days</Text>
                <Text style={styles.infoValue}>
                  {subscription.selectedDays.join(', ')}
                </Text>
              </View>
            </>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Next delivery</Text>
            <Text style={styles.infoValue}>
              {formatNextDelivery(subscription.nextDeliveryDate)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.deliverySection}>
            <Text style={styles.deliveryTitle}>Delivery Address</Text>

            {subscription.addressId ? (
              (() => {
                const addr = getAddressById(subscription.addressId);
                if (!addr) {
                  return <Text style={styles.infoValue}>No address found</Text>;
                }

                return (
                  <View style={styles.addressCard}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{addr.label}</Text>
                    </View>

                    <Text style={styles.addressName}>{addr.fullName}</Text>

                    <Text style={styles.addressLine}>{addr.house}</Text>
                    <Text style={styles.addressLine}>{addr.area}</Text>
                    {addr.landmark ? (
                      <Text style={styles.addressLine}>{addr.landmark}</Text>
                    ) : null}

                    <Text style={styles.addressLine}>
                      {addr.city} - {addr.pinCode}
                    </Text>

                    <View style={styles.phoneRow}>
                      <Text style={styles.phoneIcon}>📞</Text>
                      <Text style={styles.phoneText}>{addr.phoneNumber}</Text>
                    </View>
                  </View>
                );
              })()
            ) : (
              <Text style={styles.infoValue}>
                No delivery address selected.
              </Text>
            )}
          </View>
        </View>

        {isCancelled && (
          <View style={styles.cancelledContainer}>
            <Text style={styles.cancelledTitle}>Subscription Cancelled</Text>

            <Text style={styles.cancelledMessage}>
              This subscription has been cancelled. You can create a new
              subscription anytime from the Products screen.
            </Text>
          </View>
        )}

        {!isCancelled && (
          <>
            <Text style={styles.sectionTitle}>Actions</Text>

            <View style={styles.actionsContainer}>
              {!isPaused ? (
                <Pressable
                  style={styles.actionButton}
                  onPress={handlePauseResume}
                >
                  <Text style={styles.actionButtonText}>
                    Pause Subscription
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.actionButton}
                  onPress={handlePauseResume}
                >
                  <Text style={styles.actionButtonText}>
                    Resume Subscription
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={styles.actionButton}
                onPress={handleSkipTomorrow}
              >
                <Text style={styles.actionButtonText}>
                  {subscription.nextDeliverySkipped
                    ? 'Restore Tomorrow Delivery'
                    : 'Skip Tomorrow'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={handleChangeQuantity}
              >
                <Text style={styles.actionButtonText}>Change Quantity</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={handleChangeSchedule}
              >
                <Text style={styles.actionButtonText}>Change Schedule</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={handleChangeAddress}
              >
                <Text style={styles.actionButtonText}>Change Address</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      <QuantitySelectorModal
        visible={showQuantityModal}
        currentQuantity={subscription.quantity}
        onClose={() => setShowQuantityModal(false)}
        onSave={handleSaveQuantity}
      />
    </SafeAreaView>
  );
};

export default SubscriptionDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBF9' },
  content: { padding: 20, paddingBottom: 50 },
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
  backText: { fontSize: 34, color: '#17231C', lineHeight: 36 },
  eyebrow: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  title: { color: '#17231C', fontSize: 20, fontWeight: '800' },
  reference: { color: '#929C96', fontSize: 9, marginTop: 5 },
  statusBadge: {
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: { color: '#16794B', fontSize: 10, fontWeight: '800' },
  pausedBadge: { backgroundColor: '#FFF3D9' },
  pausedText: { color: '#9A7019' },
  cancelledBadge: { backgroundColor: '#FDECEC' },
  cancelledText: { color: '#B54545' },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 15,
    padding: 16,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: { color: '#7C8880', fontSize: 11 },
  infoValue: {
    flex: 1,
    color: '#35433A',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 20,
  },
  divider: { height: 1, backgroundColor: '#E7ECE9', marginVertical: 14 },
  sectionTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 8,
  },
  actionsContainer: { marginTop: 6 },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: { color: '#25352B', fontSize: 14, fontWeight: '700' },
  cancelButton: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D85C5C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: { color: '#C94E4E', fontSize: 14, fontWeight: '700' },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  notFoundEmoji: { fontSize: 50 },
  notFoundTitle: {
    color: '#17231C',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 15,
  },
  backHomeButton: {
    backgroundColor: '#16794B',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 13,
    marginTop: 20,
  },
  backHomeText: { color: '#FFFFFF', fontWeight: '700' },
  addressBlock: { flex: 1 },
  address: { color: '#35433A', fontSize: 13, marginTop: 4 },
  phone: { color: '#25352B', fontSize: 13, marginTop: 6, fontWeight: '700' },

  /* New delivery address card styles */
  deliverySection: { marginTop: 12 },
  deliveryTitle: { color: '#7C8880', fontSize: 11, marginBottom: 8 },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E3EAE6',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#16794B', fontSize: 12, fontWeight: '800' },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17231C',
    marginTop: 8,
  },
  addressLine: { color: '#35433A', fontSize: 13, marginTop: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  phoneIcon: { marginRight: 8, fontSize: 14 },
  phoneText: { color: '#25352B', fontSize: 13, fontWeight: '700' },

  cancelledContainer: {
    marginTop: 24,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 18,
  },

  cancelledTitle: {
    color: '#B54545',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelledMessage: {
    color: '#6B6B6B',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
});
