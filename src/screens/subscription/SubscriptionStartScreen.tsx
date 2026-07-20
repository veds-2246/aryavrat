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

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SubscriptionStart'
>;

type StartOption =
  | 'tomorrow'
  | 'dayAfterTomorrow';

const SubscriptionStartScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    productId,
    quantity,
    schedule,
    selectedDays,
  } = route.params;

  const [startOption, setStartOption] =
    useState<StartOption>('tomorrow');

  const formatQuantity = (
    litres: number,
  ) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const formatSchedule = () => {
    if (schedule === 'daily') {
      return 'Daily';
    }

    if (schedule === 'alternate') {
      return 'Alternate Days';
    }

    return 'Custom Days';
  };

  const getDate = (
    daysToAdd: number,
  ) => {
    const date = new Date();

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

  const handleContinue = () => {
  navigation.navigate(
    'CheckoutAddress',
    {
      orderType: 'subscription',

      productId,

      quantity,

      schedule,

      selectedDays,

      startOption,
    },
  );
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
          SUBSCRIPTION SETUP
        </Text>

        <Text style={styles.title}>
          When should we start?
        </Text>

        <Text style={styles.subtitle}>
          Choose when you'd like your first
          milk delivery to begin.
        </Text>

        <View style={styles.summaryCard}>

          <View style={styles.productRow}>

            <View style={styles.productIcon}>

              <Text style={styles.milkEmoji}>
                🥛
              </Text>

            </View>

            <View style={styles.productInfo}>

              <Text style={styles.productName}>
                Fresh Cow Milk
              </Text>

              <Text style={styles.productQuantity}>
                {formatQuantity(quantity)}
                {' per delivery'}
              </Text>

            </View>

          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>

            <Text style={styles.summaryLabel}>
              Schedule
            </Text>

            <Text style={styles.summaryValue}>
              {formatSchedule()}
            </Text>

          </View>

          {schedule === 'custom' &&
            selectedDays.length > 0 && (

            <View style={styles.summaryRow}>

              <Text style={styles.summaryLabel}>
                Delivery days
              </Text>

              <Text
                style={styles.daysValue}>

                {selectedDays.join(', ')}

              </Text>

            </View>
          )}

        </View>

        <Text style={styles.sectionTitle}>
          First delivery
        </Text>

        <Pressable
          style={[
            styles.dateCard,
            startOption === 'tomorrow' &&
              styles.dateCardSelected,
          ]}
          onPress={() =>
            setStartOption('tomorrow')
          }>

          <View
            style={[
              styles.radio,
              startOption === 'tomorrow' &&
                styles.radioSelected,
            ]}>

            {startOption === 'tomorrow' && (
              <View style={styles.radioDot} />
            )}

          </View>

          <View style={styles.dateInfo}>

            <View style={styles.titleRow}>

              <Text style={styles.dateTitle}>
                Tomorrow
              </Text>

              <View style={styles.earliestBadge}>

                <Text style={styles.earliestText}>
                  EARLIEST
                </Text>

              </View>

            </View>

            <Text style={styles.dateText}>
              {getDate(1)}
            </Text>

            <Text style={styles.morningText}>
              🌅 Morning delivery
            </Text>

          </View>

        </Pressable>

        <Pressable
          style={[
            styles.dateCard,
            startOption ===
              'dayAfterTomorrow' &&
              styles.dateCardSelected,
          ]}
          onPress={() =>
            setStartOption(
              'dayAfterTomorrow',
            )
          }>

          <View
            style={[
              styles.radio,
              startOption ===
                'dayAfterTomorrow' &&
                styles.radioSelected,
            ]}>

            {startOption ===
              'dayAfterTomorrow' && (

              <View style={styles.radioDot} />

            )}

          </View>

          <View style={styles.dateInfo}>

            <Text style={styles.dateTitle}>
              Day after tomorrow
            </Text>

            <Text style={styles.dateText}>
              {getDate(2)}
            </Text>

            <Text style={styles.morningText}>
              🌅 Morning delivery
            </Text>

          </View>

        </Pressable>

        {schedule === 'alternate' && (

          <View style={styles.infoBox}>

            <Text style={styles.infoIcon}>
              🔄
            </Text>

            <View style={styles.infoContent}>

              <Text style={styles.infoTitle}>
                Alternate-day schedule
              </Text>

              <Text style={styles.infoText}>
                Your selected first delivery
                becomes the starting point.
                Deliveries will then continue
                every other day.
              </Text>

            </View>

          </View>

        )}

        {schedule === 'custom' && (

          <View style={styles.infoBox}>

            <Text style={styles.infoIcon}>
              📅
            </Text>

            <View style={styles.infoContent}>

              <Text style={styles.infoTitle}>
                Custom schedule
              </Text>

              <Text style={styles.infoText}>
                Deliveries will occur only on
                your selected weekdays starting
                from the chosen start date.
              </Text>

            </View>

          </View>

        )}

        <View style={styles.cutoffBox}>

          <Text style={styles.cutoffIcon}>
            ⏰
          </Text>

          <View style={styles.infoContent}>

            <Text style={styles.cutoffTitle}>
              Daily cutoff applies
            </Text>

            <Text style={styles.cutoffText}>
              If tomorrow's cutoff has already
              passed, the earliest available
              start date will automatically move
              to the next eligible day.
            </Text>

          </View>

        </View>

        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}>

          <Text style={styles.continueText}>
            Continue
          </Text>

        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionStartScreen;

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

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 16,
    marginTop: 24,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productIcon: {
    width: 52,
    height: 52,
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

  productQuantity: {
    color: '#7C8880',
    fontSize: 12,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E4EAE6',
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 5,
  },

  summaryLabel: {
    color: '#7C8880',
    fontSize: 12,
  },

  summaryValue: {
    color: '#16794B',
    fontSize: 12,
    fontWeight: '700',
  },

  daysValue: {
    flex: 1,
    color: '#16794B',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
    marginLeft: 20,
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 13,
  },

  dateCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8E4',
    borderRadius: 15,
    padding: 16,
    marginBottom: 11,
  },

  dateCardSelected: {
    borderColor: '#16794B',
    backgroundColor: '#F0F8F4',
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B7C1BB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },

  radioSelected: {
    borderColor: '#16794B',
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16794B',
  },

  dateInfo: {
    flex: 1,
    marginLeft: 13,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateTitle: {
    color: '#17231C',
    fontSize: 15,
    fontWeight: '700',
  },

  earliestBadge: {
    backgroundColor: '#16794B',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 8,
  },

  earliestText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  dateText: {
    color: '#5F6F65',
    fontSize: 12,
    marginTop: 5,
  },

  morningText: {
    color: '#16794B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF5EF',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: '#285A40',
    fontSize: 12,
    fontWeight: '700',
  },

  infoText: {
    color: '#60776A',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  cutoffBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },

  cutoffIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  cutoffTitle: {
    color: '#665C40',
    fontSize: 12,
    fontWeight: '700',
  },

  cutoffText: {
    color: '#81765A',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  continueButton: {
    height: 56,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});