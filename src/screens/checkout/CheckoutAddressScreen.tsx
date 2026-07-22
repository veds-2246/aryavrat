import React, {useState, useEffect} from 'react';

import {
  KeyboardAvoidingView,
  Platform,
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
  useAddresses,
} from '../../context/AddressContext';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CheckoutAddress'
>;

const CheckoutAddressScreen = ({
  navigation,
  route,
}: Props) => {
  const {
  addresses,
  isHydrated,
  getDefaultAddress,
} = useAddresses();

const [
  selectedAddressId,
  setSelectedAddressId,
] = useState<string | null>(null);

useEffect(() => {
  if (!isHydrated) {
    return;
  }

  /*
   * Keep the currently selected address
   * if it still exists.
   */
  if (
    selectedAddressId &&
    addresses.some(
      address =>
        address.id === selectedAddressId,
    )
  ) {
    return;
  }

  /*
   * Otherwise select the default address.
   */
  const defaultAddress =
    getDefaultAddress();

  if (defaultAddress) {
    setSelectedAddressId(
      defaultAddress.id,
    );

    return;
  }

  /*
   * Fallback to the first saved address
   * if no default exists.
   */
  if (addresses.length > 0) {
    setSelectedAddressId(
      addresses[0].id,
    );

    return;
  }

  setSelectedAddressId(null);
}, [
  addresses,
  getDefaultAddress,
  isHydrated,
  selectedAddressId,
]);

const selectedAddress =
  addresses.find(
    address =>
      address.id === selectedAddressId,
  );

const handleAddAddress = () => {
  navigation.navigate(
    'AddEditAddress',
    {},
  );
};

const handleEditAddress = (
  addressId: string,
) => {
  navigation.navigate(
    'AddEditAddress',
    {
      addressId,
    },
  );
};

  const [error, setError] =
    useState('');

  const handleContinue = () => {
    if (!selectedAddress) {
      setError(
        'Please select a delivery address to continue.',
      );
      return;
    }

    setError('');

    const address = {
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phoneNumber,
      house: selectedAddress.house,
      area: selectedAddress.area,
      landmark: selectedAddress.landmark,
      city: selectedAddress.city,
      pincode: selectedAddress.pinCode,
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

          <Text style={styles.sectionTitle}>
  Choose delivery address
</Text>

{!isHydrated ? (
  <View style={styles.addressMessageBox}>
    <Text style={styles.addressMessageTitle}>
      Loading addresses...
    </Text>
  </View>
) : addresses.length === 0 ? (
  <View style={styles.addressMessageBox}>

    <Text style={styles.addressMessageTitle}>
      No delivery address yet
    </Text>

    <Text style={styles.addressMessageText}>
      Add an address to continue with your order.
    </Text>

    <Pressable
      style={styles.addAddressButton}
      onPress={handleAddAddress}>

      <Text style={styles.addAddressButtonText}>
        + Add Address
      </Text>

    </Pressable>

  </View>
) : (
  <View>

    {addresses.map(address => {
      const isSelected =
        address.id === selectedAddressId;

      return (
        <Pressable
          key={address.id}
          style={[
            styles.addressCard,
            isSelected
              ? styles.selectedAddressCard
              : undefined,
          ]}
          onPress={() =>
            setSelectedAddressId(
              address.id,
            )
          }>

          <View style={styles.addressCardTop}>

            <View
              style={[
                styles.radioOuter,
                isSelected
                  ? styles.radioOuterSelected
                  : undefined,
              ]}>

              {isSelected ? (
                <View
                  style={styles.radioInner}
                />
              ) : null}

            </View>

            <View style={styles.addressDetails}>

              <View style={styles.addressLabelRow}>

                <Text style={styles.addressLabel}>
                  {address.label}
                </Text>

                {address.isDefault ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>
                      DEFAULT
                    </Text>
                  </View>
                ) : null}

              </View>

              <Text style={styles.addressName}>
                {address.fullName}
              </Text>

              <Text style={styles.addressText}>
                {address.house}, {address.area}
              </Text>

              {address.landmark ? (
                <Text style={styles.addressText}>
                  {address.landmark}
                </Text>
              ) : null}

              <Text style={styles.addressText}>
                {address.city} - {address.pinCode}
              </Text>

              <Text style={styles.addressPhone}>
                +91 {address.phoneNumber}
              </Text>

            </View>

            <Pressable
              hitSlop={10}
              onPress={() =>
                handleEditAddress(
                  address.id,
                )
              }>

              <Text style={styles.editAddressText}>
                Edit
              </Text>

            </Pressable>

          </View>

        </Pressable>
      );
    })}

    <Pressable
      style={styles.addAnotherButton}
      onPress={handleAddAddress}>

      <Text style={styles.addAnotherText}>
        + Add New Address
      </Text>

    </Pressable>

  </View>
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
            style={[
              styles.continueButton,
              !selectedAddress
                ? styles.continueButtonDisabled
                : undefined,
            ]}
            onPress={handleContinue}
            disabled={
              !isHydrated || !selectedAddress
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

  continueButtonDisabled: {
    opacity: 0.5,
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

  addressMessageBox: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E2E9E5',
  borderRadius: 14,
  padding: 20,
},

addressMessageTitle: {
  color: '#17231C',
  fontSize: 15,
  fontWeight: '700',
},

addressMessageText: {
  color: '#748078',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 6,
},

addAddressButton: {
  height: 48,
  backgroundColor: '#16794B',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 18,
},

addAddressButtonText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '700',
},

addressCard: {
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E2E9E5',
  borderRadius: 14,
  padding: 16,
  marginBottom: 12,
},

selectedAddressCard: {
  borderColor: '#16794B',
  borderWidth: 1.5,
  backgroundColor: '#F7FCF9',
},

addressCardTop: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

radioOuter: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#AAB4AE',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 2,
},

radioOuterSelected: {
  borderColor: '#16794B',
},

radioInner: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#16794B',
},

addressDetails: {
  flex: 1,
  marginLeft: 12,
  marginRight: 10,
},

addressLabelRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

addressLabel: {
  color: '#17231C',
  fontSize: 14,
  fontWeight: '800',
},

defaultBadge: {
  backgroundColor: '#EAF5EF',
  paddingHorizontal: 7,
  paddingVertical: 3,
  borderRadius: 5,
  marginLeft: 8,
},

defaultBadgeText: {
  color: '#16794B',
  fontSize: 8,
  fontWeight: '800',
},

addressName: {
  color: '#35433A',
  fontSize: 13,
  fontWeight: '700',
  marginTop: 9,
},

addressText: {
  color: '#6F7B73',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 2,
},

addressPhone: {
  color: '#35433A',
  fontSize: 12,
  fontWeight: '600',
  marginTop: 7,
},

editAddressText: {
  color: '#16794B',
  fontSize: 12,
  fontWeight: '700',
},

addAnotherButton: {
  height: 48,
  borderWidth: 1,
  borderColor: '#16794B',
  borderRadius: 11,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 2,
},

addAnotherText: {
  color: '#16794B',
  fontSize: 13,
  fontWeight: '700',
},

});