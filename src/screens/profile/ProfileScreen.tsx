import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBF9" />

      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>V</Text>
          </View>

          <View>
            <Text style={styles.name}>
              Aryavrat Customer
            </Text>

            <Text style={styles.phone}>
              Customer account
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <Text style={styles.menuItem}>📍  Delivery Address</Text>
          <Text style={styles.menuItem}>📅  My Subscriptions</Text>
          <Text style={styles.menuItem}>📦  Order History</Text>
          <Text style={styles.menuItem}>❓  Help & Support</Text>
        </View>
      </View>
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
    color: '#29372E',
    fontSize: 15,
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EF',
  },
});