import React, { useState, useEffect, useCallback } from 'react';
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

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation/types';

import { useAuth } from '../../context/AuthContext';

import { fetchAddresses } from '../../services/AddressService';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckoutAddress'>;

type BackendAddress = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

const CheckoutAddressScreen = ({ navigation, route }: Props) => {
  const { userId } = useAuth();

  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState('');

  const loadAddresses = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await fetchAddresses(userId);
      setAddresses(data);

      if (data.length === 0) {
        setSelectedAddressId(null);
      } else {
        const defaultAddress = data.find(
          (a: BackendAddress) => a.is_default === true,
        );

        setSelectedAddressId(defaultAddress ? defaultAddress.id : data[0].id);
      }
    } catch (e) {
      console.error('Failed to load addresses', e);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [loadAddresses]),
  );

  const selectedAddress = addresses.find(
    address => address.id === selectedAddressId,
  );

  const handleAddAddress = () => {
    navigation.navigate('AddEditAddress', {});
  };

  const handleEditAddress = (addressId: string) => {
    navigation.navigate('AddEditAddress', {
      addressId,
    });
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      setError('Please select a delivery address to continue.');
      return;
    }

    setError('');

    if (route.params.orderType === 'buyOnce' && route.params.deliveryOption) {
      navigation.navigate('OrderReview', {
        orderType: 'buyOnce',
        productId: route.params.productId,
        quantity: route.params.quantity,
        deliveryOption: route.params.deliveryOption,
        addressId: selectedAddress.id,
      });

      return;
    }

    if (
      route.params.orderType === 'subscription' &&
      route.params.schedule &&
      route.params.startOption
    ) {
      navigation.navigate('SubscriptionReview', {
        orderType: 'subscription',
        productId: route.params.productId,
        quantity: route.params.quantity,
        schedule: route.params.schedule,
        selectedDays: route.params.selectedDays ?? [],
        startOption: route.params.startOption,
        addressId: selectedAddress.id,
      });

      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.step}>CHECKOUT</Text>

          <Text style={styles.title}>Delivery address</Text>

          <Text style={styles.subtitle}>
            Select where you&apos;d like your fresh milk delivered every
            morning.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🌅</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Morning delivery</Text>

              <Text style={styles.infoText}>
                Please provide an address where morning delivery can be received
                reliably.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Choose delivery address</Text>

          {isLoading ? (
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
                onPress={handleAddAddress}
              >
                <Text style={styles.addAddressButtonText}>+ Add Address</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {addresses.map(address => {
                const isSelected = address.id === selectedAddressId;

                return (
                  <Pressable
                    key={address.id}
                    style={[
                      styles.addressCard,
                      isSelected ? styles.selectedAddressCard : undefined,
                    ]}
                    onPress={() => {
                      setSelectedAddressId(address.id);

                      setError('');
                    }}
                  >
                    <View style={styles.addressCardTop}>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected ? styles.radioOuterSelected : undefined,
                        ]}
                      >
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>

                      <View style={styles.addressDetails}>
                        <View style={styles.addressLabelRow}>
                          <Text style={styles.addressLabel}>
                            {address.label}
                          </Text>

                          {address.is_default ? (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>
                                DEFAULT
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        <Text style={styles.addressName}>
                          {address.full_name}
                        </Text>

                        <Text style={styles.addressText}>
                          {address.address_line}, {address.state}
                        </Text>

                        {address.landmark ? (
                          <Text style={styles.addressText}>
                            {address.landmark}
                          </Text>
                        ) : null}

                        <Text style={styles.addressText}>
                          {address.city} - {address.pincode}
                        </Text>

                        <Text style={styles.addressPhone}>
                          +91 {address.phone}
                        </Text>
                      </View>

                      <Pressable
                        hitSlop={10}
                        onPress={() => handleEditAddress(address.id)}
                      >
                        <Text style={styles.editAddressText}>Edit</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })}

              <Pressable
                style={styles.addAnotherButton}
                onPress={handleAddAddress}
              >
                <Text style={styles.addAnotherText}>+ Add New Address</Text>
              </Pressable>
            </View>
          )}

          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            style={[
              styles.continueButton,
              !selectedAddress ? styles.continueButtonDisabled : undefined,
            ]}
            onPress={handleContinue}
            disabled={isLoading || !selectedAddress}
          >
            <Text style={styles.continueText}>Continue to Review</Text>
          </Pressable>

          <Text style={styles.securityText}>
            🔒 Your delivery information is used only to fulfil your orders.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutAddressScreen;

// Keep all your existing styles below this line.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E4EBE7',
  },

  backText: {
    fontSize: 28,
    lineHeight: 30,
    color: '#26332B',
    marginTop: -2,
  },

  step: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#16794B',
    marginBottom: 6,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#17231C',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: '#718078',
    marginTop: 7,
    maxWidth: 340,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF5EF',
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
    marginBottom: 26,
  },

  infoIcon: {
    fontSize: 22,
    marginTop: 1,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#24543C',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#617168',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#17231C',
    marginBottom: 14,
  },

  addressMessageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1E9E4',
    alignItems: 'center',
  },

  addressMessageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#26332B',
    textAlign: 'center',
  },

  addressMessageText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#7A877F',
    textAlign: 'center',
    marginTop: 6,
  },

  addAddressButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#16794B',
  },

  addAddressButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E9E4',
  },

  selectedAddressCard: {
    backgroundColor: '#F0F8F3',
    borderColor: '#16794B',
    borderWidth: 1.5,
  },

  addressCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B7C4BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  radioOuterSelected: {
    borderColor: '#16794B',
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16794B',
  },

  addressDetails: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 10,
  },

  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  addressLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17231C',
  },

  defaultBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#DDF1E6',
  },

  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#16794B',
  },

  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#26332B',
    marginBottom: 5,
  },

  addressText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#65736B',
  },

  addressPhone: {
    fontSize: 13,
    fontWeight: '600',
    color: '#526159',
    marginTop: 8,
  },

  editAddressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16794B',
    paddingTop: 2,
  },

  addAnotherButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },

  addAnotherText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16794B',
  },

  errorBox: {
    backgroundColor: '#FFF1F0',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3C5C1',
  },

  errorText: {
    fontSize: 13,
    color: '#B03A32',
    textAlign: 'center',
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#16794B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  continueButtonDisabled: {
    backgroundColor: '#BFC8C2',
    shadowOpacity: 0,
    elevation: 0,
  },

  continueText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  securityText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7A877F',
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
  },
});
