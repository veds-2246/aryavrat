import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

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
  'OTP'
>;

const OtpScreen = ({
  navigation,
  route,
}: Props) => {
  const {phoneNumber} = route.params;

  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
  ]);

  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState('');

  const inputs =
    useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(previous =>
        previous > 0
          ? previous - 1
          : 0,
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (
    value: string,
    index: number,
  ) => {
    const digit =
      value.replace(/[^0-9]/g, '').slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setError('');

    if (digit && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    key: string,
    index: number,
  ) => {
    if (
      key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      setError(
        'Please enter the complete 4-digit OTP.',
      );
      return;
    }

    // Temporary mock OTP for development.
    if (enteredOtp !== '1234') {
      setError(
        'Incorrect OTP. Use 1234 for testing.',
      );
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const handleResend = () => {
    if (seconds > 0) {
      return;
    }

    setOtp(['', '', '', '']);
    setError('');
    setSeconds(30);

    inputs.current[0]?.focus();
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

        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <Text style={styles.backText}>
            ‹
          </Text>

        </Pressable>

        <Text style={styles.logo}>
          🥛
        </Text>

        <Text style={styles.heading}>
          Verify OTP
        </Text>

        <Text style={styles.description}>
          We've sent a 4-digit verification code to
        </Text>

        <Text style={styles.phone}>
          +91 {phoneNumber}
        </Text>

        <Pressable
          onPress={() => navigation.goBack()}>

          <Text style={styles.changeNumber}>
            Change mobile number
          </Text>

        </Pressable>

        <View style={styles.otpContainer}>

          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                error
                  ? styles.otpInputError
                  : null,
              ]}
              value={digit}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
              onChangeText={value =>
                handleChange(value, index)
              }
              onKeyPress={({nativeEvent}) =>
                handleKeyPress(
                  nativeEvent.key,
                  index,
                )
              }
            />
          ))}

        </View>

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable
          style={({pressed}) => [
            styles.verifyButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}>

          <Text style={styles.verifyText}>
            Verify & Continue
          </Text>

        </Pressable>

        <View style={styles.resendContainer}>

          <Text style={styles.resendLabel}>
            Didn't receive the code?{' '}
          </Text>

          <Pressable
            disabled={seconds > 0}
            onPress={handleResend}>

            <Text
              style={[
                styles.resend,
                seconds > 0 &&
                  styles.resendDisabled,
              ]}>

              {seconds > 0
                ? `Resend in ${seconds}s`
                : 'Resend OTP'}

            </Text>

          </Pressable>

        </View>

        <View style={styles.testBox}>

          <Text style={styles.testText}>
            Development OTP: 1234
          </Text>

        </View>

      </View>

    </KeyboardAvoidingView>
  );
};

export default OtpScreen;

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

  backButton: {
    position: 'absolute',
    top: 55,
    left: 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E8E4',
  },

  backText: {
    fontSize: 34,
    color: '#17231C',
    lineHeight: 36,
  },

  logo: {
    fontSize: 48,
    marginBottom: 20,
  },

  heading: {
    fontSize: 31,
    fontWeight: '700',
    color: '#17231C',
  },

  description: {
    marginTop: 12,
    color: '#657269',
    fontSize: 15,
  },

  phone: {
    marginTop: 5,
    color: '#17231C',
    fontSize: 17,
    fontWeight: '700',
  },

  changeNumber: {
    marginTop: 9,
    color: '#16794B',
    fontWeight: '600',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },

  otpInput: {
    width: 65,
    height: 65,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D6E0DA',
    backgroundColor: '#FFFFFF',
    fontSize: 25,
    fontWeight: '700',
    color: '#17231C',
  },

  otpInputError: {
    borderColor: '#D94A4A',
  },

  error: {
    marginTop: 12,
    color: '#D94A4A',
    fontSize: 13,
  },

  verifyButton: {
    height: 56,
    marginTop: 30,
    borderRadius: 12,
    backgroundColor: '#16794B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.85,
  },

  verifyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  resendContainer: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  resendLabel: {
    color: '#7A867E',
    fontSize: 13,
  },

  resend: {
    color: '#16794B',
    fontWeight: '700',
    fontSize: 13,
  },

  resendDisabled: {
    color: '#98A29C',
  },

  testBox: {
    marginTop: 35,
    backgroundColor: '#EAF5EF',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },

  testText: {
    color: '#397158',
    fontSize: 12,
    fontWeight: '600',
  },
});