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

  const [errors, setErrors] = useState({
  fullName: '',
  phoneNumber: '',
  house: '',
  area: '',
  city: '',
  pinCode: '',
});
  useEffect(() => {

    if (!editingAddress) {
        return;
    }

    setFullName(editingAddress.fullName);
    setPhoneNumber(editingAddress.phoneNumber);
    setHouse(editingAddress.house);
    setArea(editingAddress.area);
    setLandmark(editingAddress.landmark);
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

  const validate = () => {
    const newErrors = {
      fullName: '',
      phoneNumber: '',
      house: '',
      area: '',
      city: '',
      pinCode: '',
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit mobile number.';
    }

    if (!house.trim()) {
      newErrors.house = 'House / Flat number is required.';
    }

    if (!area.trim()) {
      newErrors.area = 'Area / Locality is required.';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!/^\d{6}$/.test(pinCode)) {
      newErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(v => v === '');
  };

const handleSave = () => {

  if (!validate()) {
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
    updateAddress(address);
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

  if (errors.fullName) {
    const error =
      text.trim().length > 0
        ? ''
        : 'Full name is required.';

    setErrors(prev => ({
      ...prev,
      fullName: error,
    }));
  }
}}
  placeholder="Enter full name"
  style={[
    styles.input,
    errors.fullName && styles.inputError,
  ]}
/>

{errors.fullName ? (
  <Text style={styles.errorText}>
    {errors.fullName}
  </Text>
) : null}

        <Text style={styles.label}>
          Phone Number <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
  value={phoneNumber}
  onChangeText={text => {

  const value = text.replace(/\D/g, '');

  setPhoneNumber(value);

  if (errors.phoneNumber) {

    const error =
      /^\d{10}$/.test(value)
        ? ''
        : 'Enter a valid 10-digit mobile number.';

    setErrors(prev => ({
      ...prev,
      phoneNumber: error,
    }));

  }

}}
  placeholder="10 digit mobile number"
  keyboardType="number-pad"
  maxLength={10}
  style={[
    styles.input,
    errors.phoneNumber && styles.inputError,
  ]}
/>

{errors.phoneNumber ? (
  <Text style={styles.errorText}>
    {errors.phoneNumber}
  </Text>
) : null}

        <Text style={styles.label}>
          House / Flat No. <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          value={house}
          onChangeText={text => {
  setHouse(text);

  if (errors.house) {
    const error =
      text.trim().length > 0
        ? ''
        : 'House / Flat number is required.';

    setErrors(prev => ({
      ...prev,
      house: error,
    }));
  }
}}
          placeholder="Flat, House, Building"
          style={[
            styles.input,
            errors.house && styles.inputError,
          ]}
        />

        {errors.house ? (
          <Text style={styles.errorText}>
            {errors.house}
          </Text>
        ) : null}

        <Text style={styles.label}>
          Area / Locality <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          value={area}
         onChangeText={text => {
  setArea(text);

  if (errors.area) {
    const error =
      text.trim().length > 0
        ? ''
        : 'Area / Locality is required.';

    setErrors(prev => ({
      ...prev,
      area: error,
    }));
  }
}}
          placeholder="Area"
          style={[
            styles.input,
            errors.area && styles.inputError,
          ]}
        />

        {errors.area ? (
          <Text style={styles.errorText}>{errors.area}</Text>
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

  if (errors.city) {
    const error =
      text.trim().length > 0
        ? ''
        : 'City is required.';

    setErrors(prev => ({
      ...prev,
      city: error,
    }));
  }
}}
          placeholder="City"
          style={[
            styles.input,
            errors.city && styles.inputError,
          ]}
        />

        {errors.city ? (
          <Text style={styles.errorText}>{errors.city}</Text>
                ) : null}

        <Text style={styles.label}>
          PIN Code <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
  value={pinCode}
  onChangeText={text => {

  const value = text.replace(/\D/g, '');

  setPinCode(value);

  if (errors.pinCode) {

    const error =
      /^\d{6}$/.test(value)
        ? ''
        : 'Enter a valid 6-digit PIN code.';

    setErrors(prev => ({
      ...prev,
      pinCode: error,
    }));

  }

}}
  placeholder="6 digit PIN"
  keyboardType="number-pad"
  maxLength={6}
  style={[
    styles.input,
    errors.pinCode && styles.inputError,
  ]}
/>

{errors.pinCode ? (
  <Text style={styles.errorText}>
    {errors.pinCode}
  </Text>
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