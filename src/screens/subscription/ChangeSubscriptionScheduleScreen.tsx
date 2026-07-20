import React, {useState} from 'react';

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

import {
  SubscriptionSchedule,
} from '../../types/orders';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ChangeSubscriptionSchedule'
>;

const DAYS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

const ChangeSubscriptionScheduleScreen = ({
  navigation,
  route,
}: Props) => {
  const {
    getOrderById,
    updateSubscriptionSchedule,
  } = useOrders();

  const subscription =
    getOrderById(
      route.params.subscriptionId,
    );

  const [
    selectedSchedule,
    setSelectedSchedule,
  ] = useState<SubscriptionSchedule>(
    subscription?.schedule ?? 'daily',
  );

  const [
    selectedDays,
    setSelectedDays,
  ] = useState<string[]>(
    subscription?.selectedDays ?? [],
  );

  if (
    !subscription ||
    subscription.type !== 'subscription'
  ) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.notFound}>

          <Text style={styles.notFoundTitle}>
            Subscription not found
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.goBack()
            }>

            <Text style={styles.primaryButtonText}>
              Go Back
            </Text>

          </Pressable>

        </View>

      </SafeAreaView>
    );
  }

  const selectSchedule = (
    schedule: SubscriptionSchedule,
  ) => {
    setSelectedSchedule(schedule);

    if (schedule !== 'custom') {
      setSelectedDays([]);
    }
  };

  const toggleDay = (
    day: string,
  ) => {
    setSelectedDays(currentDays => {
      if (currentDays.includes(day)) {
        return currentDays.filter(
          selectedDay =>
            selectedDay !== day,
        );
      }

      return [
        ...currentDays,
        day,
      ];
    });
  };

  const handleSave = () => {
    if (
      selectedSchedule === 'custom' &&
      selectedDays.length === 0
    ) {
      Alert.alert(
        'Select delivery days',
        'Choose at least one day for your custom schedule.',
      );

      return;
    }

    updateSubscriptionSchedule(
      subscription.id,
      selectedSchedule,
      selectedSchedule === 'custom'
        ? selectedDays
        : undefined,
    );

    navigation.goBack();
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

        <Text style={styles.eyebrow}>
          SUBSCRIPTION
        </Text>

        <Text style={styles.title}>
          Change schedule
        </Text>

        <Text style={styles.subtitle}>
          Choose how often you want your milk delivered.
        </Text>

        <Text style={styles.sectionTitle}>
          Delivery frequency
        </Text>

        <Pressable
          style={[
            styles.optionCard,
            selectedSchedule === 'daily' &&
              styles.selectedCard,
          ]}
          onPress={() =>
            selectSchedule('daily')
          }>

          <View style={styles.optionContent}>

            <View
              style={[
                styles.radioOuter,
                selectedSchedule ===
                  'daily' &&
                  styles.selectedRadioOuter,
              ]}>

              {selectedSchedule ===
                'daily' && (
                <View
                  style={
                    styles.radioInner
                  }
                />
              )}

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Daily
              </Text>

              <Text style={styles.optionDescription}>
                Milk delivered every morning.
              </Text>

            </View>

          </View>

        </Pressable>

        <Pressable
          style={[
            styles.optionCard,
            selectedSchedule ===
              'alternate' &&
              styles.selectedCard,
          ]}
          onPress={() =>
            selectSchedule('alternate')
          }>

          <View style={styles.optionContent}>

            <View
              style={[
                styles.radioOuter,
                selectedSchedule ===
                  'alternate' &&
                  styles.selectedRadioOuter,
              ]}>

              {selectedSchedule ===
                'alternate' && (
                <View
                  style={
                    styles.radioInner
                  }
                />
              )}

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Alternate Days
              </Text>

              <Text style={styles.optionDescription}>
                Milk delivered every other day.
              </Text>

            </View>

          </View>

        </Pressable>

        <Pressable
          style={[
            styles.optionCard,
            selectedSchedule ===
              'custom' &&
              styles.selectedCard,
          ]}
          onPress={() =>
            selectSchedule('custom')
          }>

          <View style={styles.optionContent}>

            <View
              style={[
                styles.radioOuter,
                selectedSchedule ===
                  'custom' &&
                  styles.selectedRadioOuter,
              ]}>

              {selectedSchedule ===
                'custom' && (
                <View
                  style={
                    styles.radioInner
                  }
                />
              )}

            </View>

            <View style={styles.optionText}>

              <Text style={styles.optionTitle}>
                Custom Days
              </Text>

              <Text style={styles.optionDescription}>
                Choose specific days of the week.
              </Text>

            </View>

          </View>

        </Pressable>

        {selectedSchedule ===
          'custom' && (
          <View style={styles.customSection}>

            <Text style={styles.customTitle}>
              Select delivery days
            </Text>

            <Text style={styles.customSubtitle}>
              Tap the days when you want milk delivered.
            </Text>

            <View style={styles.daysContainer}>

              {DAYS.map(day => {
                const selected =
                  selectedDays.includes(
                    day,
                  );

                return (
                  <Pressable
                    key={day}
                    style={[
                      styles.dayButton,
                      selected &&
                        styles.selectedDayButton,
                    ]}
                    onPress={() =>
                      toggleDay(day)
                    }>

                    <Text
                      style={[
                        styles.dayText,
                        selected &&
                          styles.selectedDayText,
                      ]}>

                      {day}

                    </Text>

                  </Pressable>
                );
              })}

            </View>

          </View>
        )}

        <View style={styles.infoBox}>

          <Text style={styles.infoIcon}>
            ⏰
          </Text>

          <Text style={styles.infoText}>
            Schedule changes affecting the next delivery
            will follow the daily cutoff time.
          </Text>

        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}>

          <Text style={styles.saveButtonText}>
            Save Changes
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
};

export default ChangeSubscriptionScheduleScreen;

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
    color: '#17231C',
    fontSize: 34,
    lineHeight: 36,
  },

  eyebrow: {
    color: '#16794B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  title: {
    color: '#17231C',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 7,
  },

  subtitle: {
    color: '#748078',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 12,
  },

  optionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E9E5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 11,
  },

  selectedCard: {
    borderColor: '#16794B',
    backgroundColor: '#F2F9F5',
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B8C2BC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedRadioOuter: {
    borderColor: '#16794B',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16794B',
  },

  optionText: {
    flex: 1,
    marginLeft: 13,
  },

  optionTitle: {
    color: '#25352B',
    fontSize: 14,
    fontWeight: '700',
  },

  optionDescription: {
    color: '#879189',
    fontSize: 10,
    marginTop: 4,
  },

  customSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E9E5',
    borderRadius: 14,
    padding: 16,
    marginTop: 5,
  },

  customTitle: {
    color: '#25352B',
    fontSize: 14,
    fontWeight: '700',
  },

  customSubtitle: {
    color: '#879189',
    fontSize: 10,
    marginTop: 4,
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },

  dayButton: {
    minWidth: 58,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE5E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },

  selectedDayButton: {
    backgroundColor: '#16794B',
    borderColor: '#16794B',
  },

  dayText: {
    color: '#66736B',
    fontSize: 11,
    fontWeight: '700',
  },

  selectedDayText: {
    color: '#FFFFFF',
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF6E5',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    color: '#81765A',
    fontSize: 10,
    lineHeight: 16,
  },

  saveButton: {
    height: 55,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  notFoundTitle: {
    color: '#17231C',
    fontSize: 20,
    fontWeight: '800',
  },

  primaryButton: {
    backgroundColor: '#16794B',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 20,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});