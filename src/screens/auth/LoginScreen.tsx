import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  'Login'
>;

const LoginScreen = ({navigation}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');

    navigation.navigate('OTP', {
      phoneNumber,
    });
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');

    setPhoneNumber(cleaned);

    if (error) {
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <View style={styles.content}>

        <Text style={styles.logo}>
          🥛
        </Text>

        <Text style={styles.brand}>
          Aryavrat
        </Text>

        <Text style={styles.heading}>
          Welcome
        </Text>

        <Text style={styles.description}>
          Enter your mobile number to continue with fresh
          milk delivered every morning.
        </Text>

        <Text style={styles.label}>
          Mobile Number
        </Text>

        <View
          style={[
            styles.phoneContainer,
            error ? styles.inputError : null,
          ]}>

          <Text style={styles.countryCode}>
            +91
          </Text>

          <View style={styles.divider} />

          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit number"
            placeholderTextColor="#9A9A9A"
            keyboardType="number-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={handlePhoneChange}
          />

        </View>

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSendOTP}>

          <Text style={styles.buttonText}>
            Send OTP
          </Text>

        </Pressable>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service
          and Privacy Policy.
        </Text>

      </View>

    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 52,
    marginBottom: 8,
  },

  brand: {
    color: '#16794B',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 40,
  },

  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#17231C',
  },

  description: {
    marginTop: 10,
    marginBottom: 35,
    color: '#657269',
    fontSize: 15,
    lineHeight: 23,
  },

  label: {
    color: '#29372E',
    fontWeight: '600',
    marginBottom: 9,
  },

  phoneContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: '#D9E3DD',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },

  inputError: {
    borderColor: '#D94A4A',
  },

  countryCode: {
    color: '#17231C',
    fontSize: 16,
    fontWeight: '600',
  },

  divider: {
    height: 25,
    width: 1,
    backgroundColor: '#D9E3DD',
    marginHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#17231C',
  },

  errorText: {
    color: '#D94A4A',
    fontSize: 12,
    marginTop: 7,
  },

  button: {
    height: 56,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  terms: {
    color: '#8A958E',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 22,
  },
});