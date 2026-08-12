import React, {useState, useEffect, useCallback} from 'react';
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

import {useFocusEffect} from '@react-navigation/native';

import {
  RootStackParamList,
} from '../../navigation/types';

import {useAuth} from '../../context/AuthContext';

import {
  fetchAddresses,
} from '../../services/AddressService';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CheckoutAddress'
>;

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

const CheckoutAddressScreen = ({
  navigation,
  route,
}: Props) => {
  const {userId} = useAuth();

  const [addresses, setAddresses] = useState<BackendAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

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
        const defaultAddress =
          data.find((a: BackendAddress) => a.is_default===true);

        setSelectedAddressId(
          defaultAddress
            ? defaultAddress.id
            : data[0].id,
        );
      }
    } catch (e) {
      console.error(
        'Failed to load addresses',
        e,
      );
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

  const handleContinue = () => {
    if (!selectedAddress) {
      setError(
        'Please select a delivery address to continue.',
      );
      return;
    }

    setError('');

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
          addressId:
            selectedAddress.id,
        },
      );

      return;
    }

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
          addressId:
            selectedAddress.id,
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

          <Text
            style={styles.subtitle}>
            Select where you&apos;d
            like your fresh milk
            delivered every morning.
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
                Please provide an
                address where morning
                delivery can be
                received reliably.
              </Text>
            </View>
          </View>

          <Text
            style={styles.sectionTitle}>
            Choose delivery address
          </Text>

          {isLoading ? (
            <View
              style={
                styles.addressMessageBox
              }>
              <Text
                style={
                  styles.addressMessageTitle
                }>
                Loading addresses...
              </Text>
            </View>
          ) : addresses.length ===
            0 ? (
            <View
              style={
                styles.addressMessageBox
              }>
              <Text
                style={
                  styles.addressMessageTitle
                }>
                No delivery address
                yet
              </Text>

              <Text
                style={
                  styles.addressMessageText
                }>
                Add an address to
                continue with your
                order.
              </Text>

              <Pressable
                style={
                  styles.addAddressButton
                }
                onPress={
                  handleAddAddress
                }>
                <Text
                  style={
                    styles.addAddressButtonText
                  }>
                  + Add Address
                </Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {addresses.map(
                address => {
                  const isSelected =
                    address.id ===
                    selectedAddressId;

                  return (
                    <Pressable
                      key={address.id}
                      style={[
                        styles.addressCard,
                        isSelected
                          ? styles.selectedAddressCard
                          : undefined,
                      ]}
                      onPress={() => {
                        setSelectedAddressId(
                          address.id,
                        );

                        setError('');
                      }}>
                      <View
                        style={
                          styles.addressCardTop
                        }>
                        <View
                          style={[
                            styles.radioOuter,
                            isSelected
                              ? styles.radioOuterSelected
                              : undefined,
                          ]}>
                          {isSelected ? (
                            <View
                              style={
                                styles.radioInner
                              }
                            />
                          ) : null}
                        </View>

                        <View
                          style={
                            styles.addressDetails
                          }>
                          <View
                            style={
                              styles.addressLabelRow
                            }>
                            <Text
                              style={
                                styles.addressLabel
                              }>
                              {
                                address.label
                              }
                            </Text>

                            {address.is_default ? (
                              <View
                                style={
                                  styles.defaultBadge
                                }>
                                <Text
                                  style={
                                    styles.defaultBadgeText
                                  }>
                                  DEFAULT
                                </Text>
                              </View>
                            ) : null}
                          </View>

                          <Text
                            style={
                              styles.addressName
                            }>
                            {
                              address.full_name
                            }
                          </Text>

                          <Text
                            style={
                              styles.addressText
                            }>
                            {
                              address.address_line
                            }
                            ,{' '}
                            {
                              address.state
                            }
                          </Text>

                          {address.landmark ? (
                            <Text
                              style={
                                styles.addressText
                              }>
                              {
                                address.landmark
                              }
                            </Text>
                          ) : null}

                          <Text
                            style={
                              styles.addressText
                            }>
                            {
                              address.city
                            }{' '}
                            -{' '}
                            {
                              address.pincode
                            }
                          </Text>

                          <Text
                            style={
                              styles.addressPhone
                            }>
                            +91{' '}
                            {
                              address.phone
                            }
                          </Text>
                        </View>

                        <Pressable
                          hitSlop={10}
                          onPress={() =>
                            handleEditAddress(
                              address.id,
                            )
                          }>
                          <Text
                            style={
                              styles.editAddressText
                            }>
                            Edit
                          </Text>
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                },
              )}

              <Pressable
                style={
                  styles.addAnotherButton
                }
                onPress={
                  handleAddAddress
                }>
                <Text
                  style={
                    styles.addAnotherText
                  }>
                  + Add New Address
                </Text>
              </Pressable>
            </View>
          )}

          {error !== '' && (
            <View
              style={styles.errorBox}>
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
            onPress={
              handleContinue
            }
            disabled={
              isLoading ||
              !selectedAddress
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
            🔒 Your delivery
            information is used only
            to fulfil your orders.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutAddressScreen;

// Keep all your existing styles below this line.
const styles = StyleSheet.create({
  container: {flex: 1},
  content: {padding: 20},
  backButton: {padding: 8},
  backText: {fontSize: 24},
  step: {fontSize: 12},
  title: {fontSize: 28, fontWeight: '700'},
  subtitle: {fontSize: 14},
  infoBox: {flexDirection: 'row', marginVertical: 16},
  infoIcon: {fontSize: 20},
  infoContent: {marginLeft: 8},
  infoTitle: {fontWeight: '700'},
  infoText: {fontSize: 12},
  sectionTitle: {fontSize: 18, fontWeight: '700', marginVertical: 12},
  addressMessageBox: {padding: 16},
  addressMessageTitle: {fontWeight: '700'},
  addressMessageText: {fontSize: 12},
  addAddressButton: {marginTop: 12},
  addAddressButtonText: {fontWeight: '700'},
  addressCard: {padding: 16, marginBottom: 12},
  selectedAddressCard: {},
  addressCardTop: {flexDirection: 'row'},
  radioOuter: {width: 20, height: 20},
  radioOuterSelected: {},
  radioInner: {width: 10, height: 10},
  addressDetails: {flex: 1, marginLeft: 12},
  addressLabelRow: {flexDirection: 'row', alignItems: 'center'},
  addressLabel: {fontWeight: '700'},
  defaultBadge: {marginLeft: 8},
  defaultBadgeText: {fontSize: 10},
  addressName: {fontWeight: '700'},
  addressText: {},
  addressPhone: {},
  editAddressText: {fontWeight: '700'},
  addAnotherButton: {marginTop: 12},
  addAnotherText: {fontWeight: '700'},
  errorBox: {marginTop: 12},
  errorText: {color: 'red'},
  continueButton: {marginTop: 16},
  continueButtonDisabled: {opacity: 0.5},
  continueText: {fontWeight: '700'},
  securityText: {marginTop: 12, textAlign: 'center'},
});