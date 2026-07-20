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
  'SubscriptionSetup'
>;

type ScheduleType =
  | 'daily'
  | 'custom';

const DAYS = [
  {short: 'M', name: 'Mon'},
  {short: 'T', name: 'Tue'},
  {short: 'W', name: 'Wed'},
  {short: 'T', name: 'Thu'},
  {short: 'F', name: 'Fri'},
  {short: 'S', name: 'Sat'},
  {short: 'S', name: 'Sun'},
];

const SubscriptionSetupScreen = ({
  navigation,
  route,
}: Props) => {
  const {quantity} = route.params;

  const [schedule, setSchedule] =
    useState<ScheduleType>('daily');

  const [selectedDays, setSelectedDays] =
    useState<string[]>([]);

  const formatQuantity = (litres: number) => {
    if (litres === 0.5) {
      return '500 ml';
    }

    return `${litres} L`;
  };

  const toggleDay = (day: string) => {
    setSelectedDays(previous => {
      if (previous.includes(day)) {
        return previous.filter(
          selectedDay => selectedDay !== day,
        );
      }

      return [...previous, day];
    });
  };

  const handleContinue = () => {
  if (
    schedule === 'custom' &&
    selectedDays.length === 0
  ) {
    return;
  }

  navigation.navigate(
    'SubscriptionStart',
    {
      productId:
        route.params.productId,

      quantity,

      schedule,

      selectedDays,
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
          onPress={() => navigation.goBack()}>

          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.step}>
          SUBSCRIPTION SETUP
        </Text>

        <Text style={styles.title}>
          Choose your schedule
        </Text>

        <Text style={styles.subtitle}>
          Tell us how often you'd like fresh milk
          delivered every morning.
        </Text>

        <View style={styles.productSummary}>
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
              {formatQuantity(quantity)} per delivery
            </Text>
          </View>

          <Text style={styles.check}>
            ✓
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Delivery frequency
        </Text>

        <Pressable
          style={[
            styles.scheduleCard,
            schedule === 'daily' &&
              styles.selectedCard,
          ]}
          onPress={() => setSchedule('daily')}>

          <View
            style={[
              styles.radio,
              schedule === 'daily' &&
                styles.radioSelected,
            ]}>

            {schedule === 'daily' && (
              <View style={styles.radioDot} />
            )}
          </View>

          <View style={styles.scheduleContent}>
            <View style={styles.titleRow}>
              <Text style={styles.scheduleTitle}>
                Daily
              </Text>

              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>
                  POPULAR
                </Text>
              </View>
            </View>

            <Text style={styles.scheduleDescription}>
              Fresh milk delivered every morning.
            </Text>

            <Text style={styles.example}>
              Mon • Tue • Wed • Thu • Fri • Sat • Sun
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[
            styles.scheduleCard,
            schedule === 'custom' &&
              styles.selectedCard,
          ]}
          onPress={() => setSchedule('custom')}>

          <View
            style={[
              styles.radio,
              schedule === 'custom' &&
                styles.radioSelected,
            ]}>

            {schedule === 'custom' && (
              <View style={styles.radioDot} />
            )}
          </View>

          <View style={styles.scheduleContent}>
            <Text style={styles.scheduleTitle}>
              Custom Days
            </Text>

            <Text style={styles.scheduleDescription}>
              Choose specific weekdays that work
              best for you.
            </Text>
          </View>
        </Pressable>

        {schedule === 'custom' && (
          <View style={styles.customSection}>
            <Text style={styles.customTitle}>
              Select delivery days
            </Text>

            <View style={styles.daysRow}>
              {DAYS.map((day, index) => {
                const selected =
                  selectedDays.includes(day.name);

                return (
                  <Pressable
                    key={day.name}
                    style={[
                      styles.dayButton,
                      selected &&
                        styles.dayButtonSelected,
                    ]}
                    onPress={() =>
                      toggleDay(day.name)
                    }>

                    <Text
                      style={[
                        styles.dayLetter,
                        selected &&
                          styles.dayLetterSelected,
                      ]}>
                      {day.short}
                    </Text>

                    <Text
                      style={[
                        styles.dayName,
                        selected &&
                          styles.dayNameSelected,
                      ]}>
                      {day.name}
                    </Text>

                  </Pressable>
                );
              })}
            </View>

            {selectedDays.length === 0 && (
              <Text style={styles.dayHint}>
                Select at least one delivery day.
              </Text>
            )}
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>
            💡
          </Text>

          <Text style={styles.infoText}>
            You can skip or modify an upcoming
            delivery before the daily cutoff time.
          </Text>
        </View>

        <Pressable
          style={[
            styles.continueButton,
            schedule === 'custom' &&
              selectedDays.length === 0 &&
              styles.continueDisabled,
          ]}
          onPress={handleContinue}>

          <Text style={styles.continueText}>
            Continue
          </Text>

        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionSetupScreen;

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

  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    padding: 13,
    marginTop: 24,
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

  check: {
    color: '#16794B',
    fontSize: 20,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 13,
  },

  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8E4',
    borderRadius: 15,
    padding: 16,
    marginBottom: 11,
  },

  selectedCard: {
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
    marginTop: 1,
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

  scheduleContent: {
    flex: 1,
    marginLeft: 13,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
  },

  popularBadge: {
    backgroundColor: '#16794B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },

  popularText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  scheduleDescription: {
    color: '#77847C',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  example: {
    color: '#16794B',
    fontSize: 10,
    marginTop: 7,
    fontWeight: '600',
  },

  customSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E3EAE6',
    marginBottom: 12,
  },

  customTitle: {
    color: '#17231C',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayButton: {
    width: 42,
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE5E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FBFA',
  },

  dayButtonSelected: {
    backgroundColor: '#16794B',
    borderColor: '#16794B',
  },

  dayLetter: {
    color: '#35433A',
    fontWeight: '700',
    fontSize: 14,
  },

  dayLetterSelected: {
    color: '#FFFFFF',
  },

  dayName: {
    color: '#8A958E',
    fontSize: 8,
    marginTop: 3,
  },

  dayNameSelected: {
    color: '#E5F4EC',
  },

  dayHint: {
    color: '#B26A3C',
    fontSize: 11,
    marginTop: 10,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E9',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  infoEmoji: {
    fontSize: 17,
    marginRight: 9,
  },

  infoText: {
    flex: 1,
    color: '#756C50',
    fontSize: 11,
    lineHeight: 17,
  },

  continueButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  continueDisabled: {
    opacity: 0.45,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});