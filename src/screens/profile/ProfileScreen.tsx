import React, {useState} from 'react';

import {
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../../navigation/types';

import {
  useAuth,
} from '../../context/AuthContext';

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList
  >;

const ProfileScreen = () => {
  const navigation =
    useNavigation<NavigationProp>();

  const {
    phoneNumber,
    logout,
  } = useAuth();

  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      /*
       * Removes only the authentication
       * session.
       *
       * User-specific orders remain
       * saved in AsyncStorage.
       */
      await logout();

      setShowLogoutModal(false);

      /*
       * Remove all authenticated screens
       * from the navigation history.
       */
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',
          },
        ],
      });
    } catch (error) {
      console.error(
        'Failed to logout:',
        error,
      );

      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          Profile
        </Text>

        <View style={styles.profileCard}>

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              A
            </Text>

          </View>

          <View style={styles.profileInfo}>

            <Text style={styles.name}>
              Aryavrat Customer
            </Text>

            <Text style={styles.phone}>
              {phoneNumber
                ? `+91 ${phoneNumber}`
                : 'Customer account'}
            </Text>

          </View>

        </View>

        <View style={styles.menu}>

          <Pressable
            style={styles.menuItem}>

            <Text style={styles.menuText}>
              📍  Delivery Address
            </Text>

            <Text style={styles.chevron}>
              ›
            </Text>

          </Pressable>

          <Pressable
            style={styles.menuItem}>

            <Text style={styles.menuText}>
              📅  My Subscriptions
            </Text>

            <Text style={styles.chevron}>
              ›
            </Text>

          </Pressable>

          <Pressable
            style={styles.menuItem}>

            <Text style={styles.menuText}>
              📦  Order History
            </Text>

            <Text style={styles.chevron}>
              ›
            </Text>

          </Pressable>

          <Pressable
            style={[
              styles.menuItem,
              styles.lastMenuItem,
            ]}>

            <Text style={styles.menuText}>
              ❓  Help & Support
            </Text>

            <Text style={styles.chevron}>
              ›
            </Text>

          </Pressable>

        </View>

        <Pressable
          style={({pressed}) => [
            styles.logoutButton,

            pressed
              ? styles.logoutButtonPressed
              : undefined,
          ]}
          onPress={() =>
            setShowLogoutModal(true)
          }>

          <Text style={styles.logoutText}>
            Log out
          </Text>

        </Pressable>

        <Text style={styles.versionText}>
          Aryavrat
        </Text>

      </View>

      {/* Logout confirmation */}

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isLoggingOut) {
            setShowLogoutModal(false);
          }
        }}>

        <View style={styles.modalOverlay}>

          <View style={styles.modalCard}>

            <View style={styles.modalIcon}>

              <Text
                style={styles.modalIconText}>
                ↪
              </Text>

            </View>

            <Text style={styles.modalTitle}>
              Log out?
            </Text>

            <Text
              style={styles.modalDescription}>
              Are you sure you want to log out
              of your Aryavrat account?
            </Text>

            <View style={styles.modalButtons}>

              <Pressable
                disabled={isLoggingOut}
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                ]}
                onPress={() =>
                  setShowLogoutModal(false)
                }>

                <Text
                  style={styles.cancelText}>
                  Cancel
                </Text>

              </Pressable>

              <Pressable
                disabled={isLoggingOut}
                style={[
                  styles.modalButton,
                  styles.confirmLogoutButton,
                ]}
                onPress={handleLogout}>

                <Text
                  style={
                    styles.confirmLogoutText
                  }>

                  {isLoggingOut
                    ? 'Logging out...'
                    : 'Log out'}

                </Text>

              </Pressable>

            </View>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FBF9',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#17231C',
    marginTop: 10,
  },

  profileCard: {
    marginTop: 25,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EBE7',
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#16794B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#17231C',
  },

  phone: {
    color: '#849087',
    fontSize: 13,
    marginTop: 4,
  },

  menu: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EBE7',
    paddingHorizontal: 18,
  },

  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },

  menuText: {
    color: '#29372E',
    fontSize: 15,
  },

  chevron: {
    color: '#9AA49E',
    fontSize: 25,
  },

  logoutButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7CACA',
    backgroundColor: '#FFF8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  logoutButtonPressed: {
    opacity: 0.75,
  },

  logoutText: {
    color: '#B54545',
    fontSize: 15,
    fontWeight: '700',
  },

  versionText: {
    color: '#A0AAA4',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(20, 30, 24, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },

  modalIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalIconText: {
    color: '#B54545',
    fontSize: 25,
    fontWeight: '700',
  },

  modalTitle: {
    color: '#17231C',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 16,
  },

  modalDescription: {
    color: '#78847C',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },

  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#F1F4F2',
  },

  cancelText: {
    color: '#455249',
    fontSize: 14,
    fontWeight: '700',
  },

  confirmLogoutButton: {
    backgroundColor: '#B54545',
  },

  confirmLogoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});