import React, {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({navigation}: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#16794B"
      />

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🥛</Text>

        <Text style={styles.title}>
          Aryavrat
        </Text>

        <Text style={styles.tagline}>
          Freshness delivered every morning
        </Text>
      </View>

      <Text style={styles.footer}>
        Fresh • Pure • Everyday
      </Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16794B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    fontSize: 72,
    marginBottom: 16,
  },

  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 10,
    fontSize: 16,
    color: '#E7F5EE',
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 45,
    color: '#D4EDE1',
    fontSize: 13,
    letterSpacing: 1,
  },
});