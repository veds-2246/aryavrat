import React, {useState, useEffect} from 'react';   

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';

import {useAddresses} from '../../context/AddressContext';
import {Address} from '../../types/address';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../../navigation/types';

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type RouteProps =
  RouteProp<
    RootStackParamList,
    'AddEditAddress'
  >;

const AddEditAddressScreen = () => {

  const navigation =
    useNavigation<NavigationProp>();

  const route = useRoute<RouteProps>();

  const {
    addAddress,
    updateAddress,
    getAddressById,
  } = useAddresses();

  const editingAddress = 
    route.params?.addressId
    ? getAddressById(route.params.addressId)
    : undefined;


  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [label, setLabel] = useState<
    'Home' | 'Office' | 'Other'
  >('Home');

  const [isDefault, setIsDefault] =
    useState(true);

  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [houseError, setHouseError] = useState('');
  const [areaError, setAreaError] = useState('');
  const [cityError, setCityError] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  useEffect(() => {

    if (!editingAddress) {
        return;
    }

    setFullName(editingAddress.fullName);
    setPhoneNumber(editingAddress.phoneNumber);
    setHouse(editingAddress.house);
    setArea(editingAddress.area);
    setLandmark(editingAddress.landmark ?? '');
    setCity(editingAddress.city);
    setPinCode(editingAddress.pinCode);
    setLabel(editingAddress.label);
    setIsDefault(editingAddress.isDefault);

}, [editingAddress]);

const AddressTypeButton = ({
    title,
    }: {
    title: 'Home' | 'Office' | 'Other';
  }) => (
    <Pressable
      style={[
      styles.typeButton,
        label === title &&
          styles.selectedType,
      ]}
      onPress={() =>
        setLabel(title)
      }>

      <Text
        style={[
          styles.typeText,
          label === title &&
            styles.selectedTypeText,
        ]}>
        {title}
      </Text>

    </Pressable>
  );

  const validateForm = () => {
      let valid = true;

      // Full name
      if (!fullName.trim()) {
        setFullNameError('Full name is required.');
        valid = false;
      } else {
        setFullNameError('');
      }

      // Phone: required, 10 digits, digits only
      if (!phoneNumber) {
        setPhoneError('Phone number is required.');
        valid = false;
      } else if (!/^\d{10}$/.test(phoneNumber)) {
        setPhoneError('Enter a valid 10-digit mobile number.');
        valid = false;
      } else {
        setPhoneError('');
    }

      // House
      if (!house.trim()) {
        setHouseError('House / Flat number is required.');
        valid = false;
      } else {
        setHouseError('');
    }

      // Area
      if (!area.trim()) {
        setAreaError('Area / Locality is required.');
        valid = false;
      } else {
        setAreaError('');
      }

      // City
      if (!city.trim()) {
        setCityError('City is required.');
        valid = false;
      } else {
        setCityError('');
      }

      // PIN
      if (!pinCode) {
        setPinCodeError('PIN code is required.');
        valid = false;
      } else if (!/^\d{6}$/.test(pinCode)) {
        setPinCodeError('Enter a valid 6-digit PIN code.');
        valid = false;
      } else {
        setPinCodeError('');
      }

      return valid;
    };

const handleSave = () => {

    if (!validateForm()) {
    return;
  }

  const address: Address = {
      id: editingAddress?.id ?? Date.now().toString(),

      fullName: fullName.trim(),
      phoneNumber,
      house: house.trim(),
      area: area.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pinCode,
      label,
      isDefault,
    };

    if (editingAddress) {
      updateAddress(address.id, address);
    } else {
      addAddress(address);
    }

    navigation.goBack();
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
        keyboardShouldPersistTaps="handled">

        <Text style={styles.heading}>
          Delivery Address
        </Text>

        <Text style={styles.label}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
<TextInput
  value={fullName}
  onChangeText={text => {
    setFullName(text);

    if (fullNameError) {
      const error = text.trim().length > 0 ? '' : 'Full name is required.';
      setFullNameError(error);
    }
  }}
  placeholder="Enter full name"
  style={[
    styles.input,
    fullNameError && styles.inputError,
  ]}
/>

{fullNameError ? (
  <Text style={styles.errorText}>{fullNameError}</Text>
) : null}

        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          value={phoneNumber}
          onChangeText={text => {
            const value = text.replace(/\D/g, '');

            setPhoneNumber(value);

            if (phoneError) {
              const error = /^\d{10}$/.test(value) ? '' : 'Enter a valid 10-digit mobile number.';
              setPhoneError(error);
            }
          }}
          placeholder="10 digit mobile number"
          keyboardType="number-pad"
          maxLength={10}
          style={[
            styles.input,
            phoneError && styles.inputError,
          ]}
        />

{phoneError ? (
  <Text style={styles.errorText}>{phoneError}</Text>
) : null}

        <Text style={styles.label}>
          House / Flat No. <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
                  value={house}
                  onChangeText={text => {
                    setHouse(text);

                    if (houseError) {
                      const error = text.trim().length > 0 ? '' : 'House / Flat number is required.';
                      setHouseError(error);
                    }
                  }}
                  placeholder="Flat, House, Building"
                  style={[
                    styles.input,
                    houseError && styles.inputError,
                  ]}
                />

                {houseError ? (
                  <Text style={styles.errorText}>{houseError}</Text>
                ) : null}

        <Text style={styles.label}>
          Area / Locality <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
                  value={area}
                 onChangeText={text => {
                    setArea(text);

                    if (areaError) {
                      const error = text.trim().length > 0 ? '' : 'Area / Locality is required.';
                      setAreaError(error);
                    }
                  }}
                  placeholder="Area"
                  style={[
                    styles.input,
                    areaError && styles.inputError,
                  ]}
                />

                {areaError ? (
                  <Text style={styles.errorText}>{areaError}</Text>
                ) : null}

        <Text style={styles.label}>
          Landmark (Optional)
        </Text>

        <TextInput
          value={landmark}
          onChangeText={setLandmark}
          placeholder="Nearby landmark"
          style={styles.input}
        />

        <Text style={styles.label}>
          City <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
                  value={city}
                  onChangeText={text => {
                    setCity(text);

                    if (cityError) {
                      const error = text.trim().length > 0 ? '' : 'City is required.';
                      setCityError(error);
                    }
                  }}
                  placeholder="City"
                  style={[
                    styles.input,
                    cityError && styles.inputError,
                  ]}
                />

                {cityError ? (
                  <Text style={styles.errorText}>{cityError}</Text>
                        ) : null}

        <Text style={styles.label}>
          PIN Code <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          value={pinCode}
          onChangeText={text => {
            const value = text.replace(/\D/g, '');

            setPinCode(value);

            if (pinCodeError) {
              const error = /^\d{6}$/.test(value) ? '' : 'Enter a valid 6-digit PIN code.';
              setPinCodeError(error);
            }
          }}
          placeholder="6 digit PIN"
          keyboardType="number-pad"
          maxLength={6}
          style={[
            styles.input,
            pinCodeError && styles.inputError,
          ]}
        />

{pinCodeError ? (
  <Text style={styles.errorText}>{pinCodeError}</Text>
) : null}

        <Text style={styles.sectionTitle}>
          Address Type
        </Text>

        <View style={styles.typeContainer}>

          <AddressTypeButton title="Home" />

          <AddressTypeButton title="Office" />

          <AddressTypeButton title="Other" />

        </View>

        <View style={styles.defaultRow}>

          <Text style={styles.defaultText}>
            Set as Default Address
          </Text>

          <Switch
            value={isDefault}
            onValueChange={
              setIsDefault
            }
          />

        </View>

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}>

          <Text style={styles.saveButtonText}>
            Save Address
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

  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#17231C',
    marginTop: 12,
  },

  input: {
    height: 52,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE5DF',
    paddingHorizontal: 15,
    fontSize: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 15,
  },

  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  typeButton: {
    flex: 1,
    height: 46,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDE5DF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  selectedType: {
    backgroundColor: '#16794B',
    borderColor: '#16794B',
  },

  typeText: {
    color: '#17231C',
    fontWeight: '600',
  },

  selectedTypeText: {
    color: '#FFF',
  },

  defaultRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  defaultText: {
    fontSize: 15,
    fontWeight: '600',
  },

  saveButton: {
    marginTop: 35,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  required: {
  color: '#D32F2F',
},

errorText: {
  color: '#D32F2F',
  fontSize: 12,
  marginTop: 5,
  marginLeft: 4,
},

inputError: {
  borderColor: '#D32F2F',
  borderWidth: 1.5,
},

});