import React, {useState} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CheckoutAddress'
>;

const CheckoutAddressScreen = ({
  navigation,
  route,
}: Props) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');

  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const [error, setError] = useState('');

  const validateAddress = () => {
  if (
    !fullName.trim() ||
    !phone.trim() ||
    !house.trim() ||
    !area.trim() ||
    !city.trim() ||
    !pincode.trim()
  ) {
    setError(
      'Please fill in all required fields.',
    );

    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    setError(
      'Please enter a valid 10-digit mobile number.',
    );

    return;
  }

  if (!/^[0-9]{6}$/.test(pincode)) {
    setError(
      'Please enter a valid 6-digit PIN code.',
    );

    return;
  }

  setError('');

  const address = {
    fullName,
    phone,
    house,
    area,
    landmark,
    city,
    pincode,
  };

  // BUY ONCE
  if (
    route.params.orderType === 'buyOnce' &&
    route.params.deliveryOption
  ) {
    navigation.navigate('OrderReview', {
      orderType: 'buyOnce',
      productId: route.params.productId,
      quantity: route.params.quantity,
      deliveryOption:
        route.params.deliveryOption,
      address,
    });

    return;
  }

  // SUBSCRIPTION
  if (
    route.params.orderType ===
      'subscription' &&
    route.params.schedule &&
    route.params.startOption
  ) {
    navigation.navigate(
      'SubscriptionReview',
      {
        orderType: 'subscription',
        productId:
          route.params.productId,
        quantity:
          route.params.quantity,
        schedule:
          route.params.schedule,
        selectedDays:
          route.params.selectedDays ?? [],
        startOption:
          route.params.startOption,
        address,
      },
    );

    return;
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}>

            <Text style={styles.backText}>
              ‹
            </Text>

          </Pressable>

          <Text style={styles.step}>
            CHECKOUT
          </Text>

          <Text style={styles.title}>
            Delivery address
          </Text>

          <Text style={styles.subtitle}>
            Enter the address where you'd like
            your fresh milk delivered every morning.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>
              🌅
            </Text>

            <View style={styles.infoContent}>

              <Text style={styles.infoTitle}>
                Morning delivery
              </Text>

              <Text style={styles.infoText}>
                Please provide an address where
                morning delivery can be received
                reliably.
              </Text>

            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Contact details
          </Text>

          <Text style={styles.label}>
            Full name *
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#A2AAA5"
          />

          <Text style={styles.label}>
            Mobile number *
          </Text>

          <View style={styles.phoneContainer}>

            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>
                +91
              </Text>
            </View>

            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={text =>
                setPhone(
                  text
                    .replace(/[^0-9]/g, '')
                    .slice(0, 10),
                )
              }
              placeholder="10-digit mobile number"
              placeholderTextColor="#A2AAA5"
              keyboardType="phone-pad"
              maxLength={10}
            />

          </View>

          <Text style={styles.sectionTitle}>
            Address
          </Text>

          <Text style={styles.label}>
            House / Flat / Building *
          </Text>

          <TextInput
            style={styles.input}
            value={house}
            onChangeText={setHouse}
            placeholder="House no., flat or building"
            placeholderTextColor="#A2AAA5"
          />

          <Text style={styles.label}>
            Area / Street / Locality *
          </Text>

          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            placeholder="Area, street or locality"
            placeholderTextColor="#A2AAA5"
          />

          <Text style={styles.label}>
            Landmark
          </Text>

          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Nearby landmark (optional)"
            placeholderTextColor="#A2AAA5"
          />

          <View style={styles.row}>

            <View style={styles.halfField}>

              <Text style={styles.label}>
                City *
              </Text>

              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#A2AAA5"
              />

            </View>

            <View style={styles.halfField}>

              <Text style={styles.label}>
                PIN code *
              </Text>

              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={text =>
                  setPincode(
                    text
                      .replace(/[^0-9]/g, '')
                      .slice(0, 6),
                  )
                }
                placeholder="6 digits"
                placeholderTextColor="#A2AAA5"
                keyboardType="number-pad"
                maxLength={6}
              />

            </View>

          </View>

          {error !== '' && (
            <View style={styles.errorBox}>

              <Text style={styles.errorText}>
                {error}
              </Text>

            </View>
          )}

          <Pressable
            style={styles.continueButton}
            onPress={validateAddress}>

            <Text style={styles.continueText}>
              Continue to Review
            </Text>

          </Pressable>

          <Text style={styles.securityText}>
            🔒 Your delivery information is used
            only to fulfil your orders.
          </Text>

        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutAddressScreen;

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

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF5EF',
    borderRadius: 13,
    padding: 14,
    marginTop: 22,
  },

  infoIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: '#285A40',
    fontSize: 13,
    fontWeight: '700',
  },

  infoText: {
    color: '#60776A',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  sectionTitle: {
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 14,
  },

  label: {
    color: '#445249',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE5E0',
    borderRadius: 11,
    paddingHorizontal: 14,
    color: '#17231C',
    fontSize: 14,
    marginBottom: 17,
  },

  phoneContainer: {
    height: 52,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE5E0',
    borderRadius: 11,
    marginBottom: 17,
    overflow: 'hidden',
  },

  countryCode: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8E4',
    backgroundColor: '#F4F7F5',
  },

  countryCodeText: {
    color: '#35433A',
    fontSize: 14,
    fontWeight: '600',
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 13,
    color: '#17231C',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  halfField: {
    flex: 1,
  },

  errorBox: {
    backgroundColor: '#FFF0EE',
    borderRadius: 10,
    padding: 12,
    marginTop: 3,
  },

  errorText: {
    color: '#B34C42',
    fontSize: 12,
  },

  continueButton: {
    height: 56,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  securityText: {
    color: '#89938D',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 15,
  },
});