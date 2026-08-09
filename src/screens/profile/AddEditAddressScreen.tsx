import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../navigation/types';
import {useAuth} from '../../context/AuthContext';

import {
  createAddress,
  updateAddress,
  fetchAddresses,
} from '../../services/AddressService';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddEditAddress'
>;

type AddEditAddressRouteProp = RouteProp<
  RootStackParamList,
  'AddEditAddress'
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

const AddEditAddressScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddEditAddressRouteProp>();

  const {userId} = useAuth();

  const [editingAddress, setEditingAddress] =
    useState<BackendAddress | null>(null);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [label, setLabel] =
    useState<'Home' | 'Work' | 'Other'>(
      'Home',
    );
  const [isDefault, setIsDefault] =
    useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      if (
        !route.params?.addressId ||
        !userId
      ) {
        return;
      }

      try {
        const addresses =
          await fetchAddresses(userId);

        const address = addresses.find(
          (a: BackendAddress) =>
            a.id === route.params?.addressId,
        );

        if (!address) {
          return;
        }

        setEditingAddress(address);
        setFullName(address.full_name);
        setPhoneNumber(address.phone);
        setHouse(address.address_line);
        setArea(address.state);
        setLandmark(address.landmark ?? '');
        setCity(address.city);
        setPinCode(address.pincode);
        setLabel(
          (address.label as
            | 'Home'
            | 'Work'
            | 'Other') ?? 'Home',
        );
        setIsDefault(address.is_default);
      } catch (error) {
        console.error(
          'Failed to load address',
          error,
        );
      }
    };

    loadAddress();
  }, [route.params?.addressId, userId]);

  const validateForm = () => {
    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !house.trim() ||
      !area.trim() ||
      !city.trim() ||
      !pinCode.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill all required fields.',
      );
      return false;
    }

    if (phoneNumber.length < 10) {
      Alert.alert(
        'Invalid Phone',
        'Enter a valid phone number.',
      );
      return false;
    }

    if (pinCode.length !== 6) {
      Alert.alert(
        'Invalid PIN Code',
        'PIN Code must be 6 digits.',
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userId) {
      Alert.alert(
        'Error',
        'Please login again.',
      );
      return;
    }

    const address = {
      user_id: userId,
      label,
      full_name: fullName.trim(),
      phone: phoneNumber.trim(),
      address_line: house.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: area.trim(),
      pincode: pinCode.trim(),
      is_default: isDefault,
    };

    try {
      if (editingAddress) {
        await updateAddress(
          editingAddress.id,
          address,
        );
      } else {
        await createAddress(address);
      }

      navigation.goBack();
    } catch (error) {
      console.error(
        'Failed to save address',
        error,
      );

      Alert.alert(
        'Error',
        'Failed to save address.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <ScrollView
        contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {editingAddress
            ? 'Edit Address'
            : 'Add New Address'}
        </Text>

        <Text style={styles.section}>
          Address Label
        </Text>

        <View style={styles.labelRow}>
          {(['Home', 'Work', 'Other'] as const).map(
            option => (
              <Pressable
                key={option}
                style={
                  label === option
                    ? [
                        styles.labelChip,
                        styles.labelChipActive,
                      ]
                    : styles.labelChip
                }
                onPress={() =>
                  setLabel(option)
                }>
                <Text
                  style={
                    label === option
                      ? styles.labelTextActive
                      : styles.labelText
                  }>
                  {option}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        <Text style={styles.section}>
          Contact Details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.section}>
          Address
        </Text>

        <TextInput
          style={styles.input}
          placeholder="House / Flat / Building"
          value={house}
          onChangeText={setHouse}
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={area}
          onChangeText={setArea}
        />

        <TextInput
          style={styles.input}
          placeholder="Landmark (optional)"
          value={landmark}
          onChangeText={setLandmark}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />

        <TextInput
          style={styles.input}
          placeholder="PIN Code"
          keyboardType="number-pad"
          value={pinCode}
          onChangeText={setPinCode}
        />

        <View style={styles.defaultRow}>
          <Text style={styles.defaultLabel}>
            Set as default address
          </Text>

          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{
              false: '#D8DEDA',
              true: '#8BD3A8',
            }}
            thumbColor={
              isDefault
                ? '#16794B'
                : '#FFFFFF'
            }
          />
        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveText}>
            {editingAddress
              ? 'Save Changes'
              : 'Save Address'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEditAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginBottom: 24,
  },

  section: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17231C',
    marginTop: 18,
    marginBottom: 10,
  },

  labelRow: {
    flexDirection: 'row',
    gap: 10,
  },

  labelChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D6DFDA',
    backgroundColor: '#FFFFFF',
  },

  labelChipActive: {
    backgroundColor: '#16794B',
    borderColor: '#16794B',
  },

  labelText: {
    color: '#516057',
    fontWeight: '600',
  },

  labelTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  input: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE4E0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },

  defaultRow: {
    marginTop: 22,
    marginBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  defaultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#17231C',
  },

  saveButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});