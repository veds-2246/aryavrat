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

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CheckoutAddress'
>;

const CheckoutAddressScreen = ({
  navigation,
  route,
}: Props) => {
  const [fullName, setFullName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [house, setHouse] =
    useState('');

  const [area, setArea] =
    useState('');

  const [landmark, setLandmark] =
    useState('');

  const [city, setCity] =
    useState('');

  const [pincode, setPincode] =
    useState('');

  const [error, setError] =
    useState('');

  const [
    phoneError,
    setPhoneError,
  ] = useState('');

  const [
    pincodeError,
    setPincodeError,
  ] = useState('');

  /*
   * Validate mobile number while typing.
   *
   * Indian mobile numbers:
   * - Exactly 10 digits
   * - Start with 6, 7, 8, or 9
   */
  const handlePhoneChange = (
    text: string,
  ) => {
    const value = text
      .replace(/[^0-9]/g, '')
      .slice(0, 10);

    setPhone(value);
    setError('');

    if (value.length === 0) {
      setPhoneError('');
      return;
    }

    if (value.length < 10) {
      setPhoneError(
        'Enter a valid 10-digit mobile number.',
      );

      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(value)) {
      setPhoneError(
        'Enter a valid Indian mobile number.',
      );

      return;
    }

    setPhoneError('');
  };

  /*
   * Validate PIN code while typing.
   */
  const handlePincodeChange = (
    text: string,
  ) => {
    const value = text
      .replace(/[^0-9]/g, '')
      .slice(0, 6);

    setPincode(value);
    setError('');

    if (value.length === 0) {
      setPincodeError('');
      return;
    }

    if (value.length < 6) {
      setPincodeError(
        'Enter a valid 6-digit PIN code.',
      );

      return;
    }

    if (!/^[0-9]{6}$/.test(value)) {
      setPincodeError(
        'Enter a valid 6-digit PIN code.',
      );

      return;
    }

    setPincodeError('');
  };

  const validateAddress = () => {
    /*
     * Required field validation
     */
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

      /*
       * Also show inline validation
       * if phone/PIN are incomplete.
       */
      if (
        phone.length > 0 &&
        !/^[6-9][0-9]{9}$/.test(phone)
      ) {
        setPhoneError(
          'Enter a valid 10-digit mobile number.',
        );
      }

      if (
        pincode.length > 0 &&
        !/^[0-9]{6}$/.test(pincode)
      ) {
        setPincodeError(
          'Enter a valid 6-digit PIN code.',
        );
      }

      return;
    }

    /*
     * Final phone validation
     */
    if (
      !/^[6-9][0-9]{9}$/.test(phone)
    ) {
      setPhoneError(
        'Enter a valid 10-digit mobile number.',
      );

      setError(
        'Please correct the highlighted fields.',
      );

      return;
    }

    /*
     * Final PIN validation
     */
    if (
      !/^[0-9]{6}$/.test(pincode)
    ) {
      setPincodeError(
        'Enter a valid 6-digit PIN code.',
      );

      setError(
        'Please correct the highlighted fields.',
      );

      return;
    }

    setPhoneError('');
    setPincodeError('');
    setError('');

    const address = {
      fullName: fullName.trim(),
      phone,
      house: house.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pincode,
    };

    /*
     * BUY ONCE
     */
    if (
      route.params.orderType ===
        'buyOnce' &&
      route.params.deliveryOption
    ) {
      navigation.navigate(
        'OrderReview',
        {
          orderType: 'buyOnce',

          productId:
            route.params.productId,

          quantity:
            route.params.quantity,

          deliveryOption:
            route.params
              .deliveryOption,

          address,
        },
      );

      return;
    }

    /*
     * SUBSCRIPTION
     */
    if (
      route.params.orderType ===
        'subscription' &&
      route.params.schedule &&
      route.params.startOption
    ) {
      navigation.navigate(
        'SubscriptionReview',
        {
          orderType:
            'subscription',

          productId:
            route.params.productId,

          quantity:
            route.params.quantity,

          schedule:
            route.params.schedule,

          selectedDays:
            route.params
              .selectedDays ?? [],

          startOption:
            route.params.startOption,

          address,
        },
      );

      return;
    }
  };

  return (
    <SafeAreaView
      style={styles.container}>

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
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }>

            <Text
              style={styles.backText}>
              ‹
            </Text>

          </Pressable>

          <Text style={styles.step}>
            CHECKOUT
          </Text>

          <Text style={styles.title}>
            Delivery address
          </Text>

          <Text
            style={styles.subtitle}>
            Enter the address where you'd
            like your fresh milk delivered
            every morning.
          </Text>

          <View style={styles.infoBox}>

            <Text
              style={styles.infoIcon}>
              🌅
            </Text>

            <View
              style={
                styles.infoContent
              }>

              <Text
                style={
                  styles.infoTitle
                }>
                Morning delivery
              </Text>

              <Text
                style={
                  styles.infoText
                }>
                Please provide an address
                where morning delivery can
                be received reliably.
              </Text>

            </View>

          </View>

          <Text
            style={
              styles.sectionTitle
            }>
            Contact details
          </Text>

          <Text style={styles.label}>
            Full name *
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={text => {
              setFullName(text);
              setError('');
            }}
            placeholder="Enter your full name"
            placeholderTextColor="#A2AAA5"
          />

          <Text style={styles.label}>
            Mobile number *
          </Text>

          <View
            style={[
              styles.phoneContainer,

              phoneError
                ? styles.invalidField
                : null,
            ]}>

            <View
              style={
                styles.countryCode
              }>

              <Text
                style={
                  styles.countryCodeText
                }>
                +91
              </Text>

            </View>

            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={
                handlePhoneChange
              }
              placeholder="10-digit mobile number"
              placeholderTextColor="#A2AAA5"
              keyboardType="number-pad"
              maxLength={10}
            />

          </View>

          {phoneError !== '' && (
            <Text
              style={
                styles.inlineError
              }>
              {phoneError}
            </Text>
          )}

          <Text
            style={
              styles.sectionTitle
            }>
            Address
          </Text>

          <Text style={styles.label}>
            House / Flat / Building *
          </Text>

          <TextInput
            style={styles.input}
            value={house}
            onChangeText={text => {
              setHouse(text);
              setError('');
            }}
            placeholder="House no., flat or building"
            placeholderTextColor="#A2AAA5"
          />

          <Text style={styles.label}>
            Area / Street / Locality *
          </Text>

          <TextInput
            style={styles.input}
            value={area}
            onChangeText={text => {
              setArea(text);
              setError('');
            }}
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
      onChangeText={text => {
        setCity(text);
        setError('');
      }}
      placeholder="City"
      placeholderTextColor="#A2AAA5"
    />
  </View>

  <View style={styles.halfField}>
    <Text style={styles.label}>
      PIN code *
    </Text>

    <TextInput
      style={[
        styles.input,
        pincodeError
          ? styles.invalidField
          : null,
      ]}
      value={pincode}
      onChangeText={handlePincodeChange}
      placeholder="6 digits"
      placeholderTextColor="#A2AAA5"
      keyboardType="number-pad"
      maxLength={6}
    />
  </View>

</View>

{pincodeError !== '' && (
  <Text style={styles.inlineError}>
    {pincodeError}
  </Text>
)}
          {error !== '' && (
            <View
              style={
                styles.errorBox
              }>

              <Text
                style={
                  styles.errorText
                }>
                {error}
              </Text>

            </View>
          )}

          <Pressable
            style={
              styles.continueButton
            }
            onPress={
              validateAddress
            }>

            <Text
              style={
                styles.continueText
              }>
              Continue to Review
            </Text>

          </Pressable>

          <Text
            style={
              styles.securityText
            }>
            🔒 Your delivery information
            is used only to fulfil your
            orders.
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
    marginBottom: 4,
    overflow: 'hidden',
  },

  invalidField: {
    borderColor: '#D94A4A',
    borderWidth: 1.5,
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

inlineError: {
  color: '#D94A4A',
  fontSize: 11,
  marginTop: 4,
  marginBottom: 12,
  minHeight: 16,
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
    marginTop: 8,
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