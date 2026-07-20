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
  'ManageSubscription'
>;

const ManageSubscriptionScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    getOrderById,
    updateSubscriptionStatus,
    updateOrderQuantity,
    setNextDeliverySkipped,
  } = useOrders();

  const subscription =
    getOrderById(
      route.params.subscriptionId,
    );

  if (
    !subscription ||
    subscription.type !== 'subscription'
  ) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.notFound}>

          <Text style={styles.notFoundEmoji}>
            🥛
          </Text>

          <Text style={styles.notFoundTitle}>
            Subscription not found
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

  const subscriptionStatus =
    subscription.subscriptionStatus ??
    'active';

  const isPaused =
    subscriptionStatus === 'paused';

  const isCancelled =
    subscriptionStatus ===
    'cancelled';

  const formatQuantity = (
    litres: number,
  ) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const formatSchedule = () => {
  if (
    subscription.schedule ===
    'daily'
  ) {
    return 'Daily';
  }

  return (
    subscription.selectedDays?.join(
      ', ',
    ) || 'Custom Days'
  );
};
  const calculatePrice = () => {
    /*
     * Current project price:
     * ₹60 per litre.
     *
     * Later this will come from
     * product/backend pricing.
     */
    return (
      subscription.quantity * 60
    );
  };

  const handleSkipDelivery = () => {
    if (
      subscription.nextDeliverySkipped
    ) {
      Alert.alert(
        'Delivery already skipped',
        'Your next delivery is already marked as skipped.',
      );

      return;
    }

    Alert.alert(
      'Skip next delivery?',
      'Your next scheduled milk delivery will be skipped.',
      [
        {
          text: 'Keep Delivery',
          style: 'cancel',
        },

        {
          text: 'Skip Delivery',

          onPress: () => {
            setNextDeliverySkipped(
              subscription.id,
              true,
            );
          },
        },
      ],
    );
  };

  const handleQuantity = () => {
    Alert.alert(
      'Change quantity',
      'Choose the milk quantity for each delivery.',
      [
        {
          text: '500 ml',

          onPress: () =>
            updateOrderQuantity(
              subscription.id,
              0.5,
            ),
        },

        {
          text: '1 L',

          onPress: () =>
            updateOrderQuantity(
              subscription.id,
              1,
            ),
        },

        {
          text: '1.5 L',

          onPress: () =>
            updateOrderQuantity(
              subscription.id,
              1.5,
            ),
        },

        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
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

            onPress: () =>
              updateSubscriptionStatus(
                subscription.id,
                'active',
              ),
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

          onPress: () =>
            updateSubscriptionStatus(
              subscription.id,
              'paused',
            ),
        },
      ],
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel subscription?',
      'This will stop all future deliveries under this subscription.',
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },

        {
          text: 'Cancel Subscription',
          style: 'destructive',

          onPress: () => {
            updateSubscriptionStatus(
              subscription.id,
              'cancelled',
            );

            navigation.goBack();
          },
        },
      ],
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

        <Text style={styles.eyebrow}>
          SUBSCRIPTION
        </Text>

        <View style={styles.headingRow}>

          <View>

            <Text style={styles.title}>
              Manage subscription
            </Text>

            <Text style={styles.reference}>
              {subscription.id}
            </Text>

          </View>

          <View
            style={[
              styles.statusBadge,

              isPaused &&
                styles.pausedBadge,

              isCancelled &&
                styles.cancelledBadge,
            ]}>

            <Text
              style={[
                styles.statusText,

                isPaused &&
                  styles.pausedText,

                isCancelled &&
                  styles.cancelledText,
              ]}>

              {isCancelled
                ? 'CANCELLED'
                : isPaused
                  ? 'PAUSED'
                  : 'ACTIVE'}

            </Text>

          </View>

        </View>

        <View style={styles.productCard}>

          <View style={styles.productIcon}>

            <Text style={styles.milkEmoji}>
              🥛
            </Text>

          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              {subscription.productName}
            </Text>

            <Text style={styles.productMeta}>
              {formatQuantity(
                subscription.quantity,
              )}
              {' per delivery'}
            </Text>

          </View>

          <View>

            <Text style={styles.price}>
              ₹{calculatePrice().toFixed(0)}
            </Text>

            <Text style={styles.perDelivery}>
              per delivery
            </Text>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Delivery plan
        </Text>

        <View style={styles.card}>

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Schedule
            </Text>

            <Text style={styles.infoValue}>
              {formatSchedule()}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Started
            </Text>

            <Text style={styles.infoValue}>
              {subscription.startDate}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
              Delivery slot
            </Text>

            <Text style={styles.greenValue}>
              🌅 Morning
            </Text>

          </View>

        </View>

        {subscription
          .nextDeliverySkipped && (
          <View style={styles.skippedBox}>

            <Text style={styles.skippedIcon}>
              ✓
            </Text>

            <View style={styles.skippedInfo}>

              <Text style={styles.skippedTitle}>
                Next delivery skipped
              </Text>

              <Text style={styles.skippedText}>
                Your next scheduled delivery
                will not be delivered.
              </Text>

            </View>

          </View>
        )}

        {!isCancelled && (
          <>
            <Text style={styles.sectionTitle}>
              Quick actions
            </Text>

            <View
              style={
                styles.actionsContainer
              }>

              <Pressable
                style={styles.actionCard}
                onPress={
                  handleSkipDelivery
                }
                disabled={isPaused}>

                <View
                  style={styles.actionIcon}>

                  <Text
                    style={
                      styles.actionEmoji
                    }>
                    ⏭️
                  </Text>

                </View>

                <Text
                  style={styles.actionTitle}>
                  Skip Next
                </Text>

                <Text
                  style={styles.actionText}>
                  Skip one delivery
                </Text>

              </Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={handleQuantity}>

                <View
                  style={styles.actionIcon}>

                  <Text
                    style={
                      styles.actionEmoji
                    }>
                    🥛
                  </Text>

                </View>

                <Text
                  style={styles.actionTitle}>
                  Quantity
                </Text>

                <Text
                  style={styles.actionText}>
                  Change milk amount
                </Text>

              </Pressable>

              <Pressable
  style={styles.actionCard}
  onPress={() =>
    navigation.navigate(
      'ChangeSubscriptionSchedule',
      {
        subscriptionId: subscription.id,
      },
    )
  }>

  <View style={styles.actionIcon}>

    <Text
      style={
        styles.actionEmoji
      }>
      📅
    </Text>

  </View>

  <Text style={styles.actionTitle}>
    Schedule
  </Text>

  <Text style={styles.actionText}>
    Change delivery days
  </Text>

</Pressable>

              <Pressable
                style={styles.actionCard}
                onPress={
                  handlePauseResume
                }>

                <View
                  style={styles.actionIcon}>

                  <Text
                    style={
                      styles.actionEmoji
                    }>
                    {isPaused
                      ? '▶️'
                      : '⏸️'}
                  </Text>

                </View>

                <Text
                  style={styles.actionTitle}>
                  {isPaused
                    ? 'Resume'
                    : 'Pause'}
                </Text>

                <Text
                  style={styles.actionText}>
                  {isPaused
                    ? 'Restart deliveries'
                    : 'Pause deliveries'}
                </Text>

              </Pressable>

            </View>

            <View style={styles.cutoffBox}>

              <Text style={styles.cutoffIcon}>
                ⏰
              </Text>

              <Text style={styles.cutoffText}>
                Changes affecting the next
                delivery are subject to the
                daily cutoff time. The backend
                will enforce this rule later.
              </Text>

            </View>

            <Pressable
              style={styles.cancelButton}
              onPress={handleCancel}>

              <Text
                style={
                  styles.cancelButtonText
                }>
                Cancel Subscription
              </Text>

            </Pressable>
          </>
        )}

      </ScrollView>

    </SafeAreaView>
  );
};

export default ManageSubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 50,
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

  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },

  title: {
    color: '#17231C',
    fontSize: 27,
    fontWeight: '800',
  },

  reference: {
    color: '#929C96',
    fontSize: 9,
    marginTop: 5,
  },

  statusBadge: {
    backgroundColor: '#EAF5EF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  statusText: {
    color: '#16794B',
    fontSize: 8,
    fontWeight: '800',
  },

  pausedBadge: {
    backgroundColor: '#FFF3D9',
  },

  pausedText: {
    color: '#9A7019',
  },

  cancelledBadge: {
    backgroundColor: '#FDECEC',
  },

  cancelledText: {
    color: '#B54545',
  },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 15,
    padding: 16,
    marginTop: 25,
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
    fontSize: 28,
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

  productMeta: {
    color: '#7C8880',
    fontSize: 11,
    marginTop: 5,
  },

  price: {
    color: '#16794B',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },

  perDelivery: {
    color: '#929C96',
    fontSize: 8,
    marginTop: 3,
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
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 20,
  },

  greenValue: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E7ECE9',
    marginVertical: 14,
  },

  skippedBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF5EF',
    borderRadius: 12,
    padding: 14,
    marginTop: 17,
  },

  skippedIcon: {
    color: '#16794B',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
  },

  skippedInfo: {
    flex: 1,
  },

  skippedTitle: {
    color: '#285A40',
    fontSize: 12,
    fontWeight: '700',
  },

  skippedText: {
    color: '#60776A',
    fontSize: 10,
    marginTop: 3,
  },

  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAE6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 11,
  },

  actionIcon: {
    width: 39,
    height: 39,
    borderRadius: 10,
    backgroundColor: '#EAF5EF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionEmoji: {
    fontSize: 18,
  },

  actionTitle: {
    color: '#25352B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 11,
  },

  actionText: {
    color: '#929C96',
    fontSize: 9,
    marginTop: 4,
  },

  cutoffBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
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