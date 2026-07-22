import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
} from 'react-native';

import {useAddresses} from '../../context/AddressContext';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../../navigation/types';

type AddressesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Addresses'>;

const AddressesScreen = () => {
  const navigation = useNavigation<AddressesScreenNavigationProp>();
  const {
    addresses,
    setDefaultAddress,
    deleteAddress,
  } = useAddresses();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBF9"
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Delivery Addresses
        </Text>

        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No addresses added yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Add your first delivery address.
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {item.label}
                </Text>

                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>
                      Default
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.name}>
                {item.fullName}
              </Text>

              <Text style={styles.address}>
                {item.house}
              </Text>

              <Text style={styles.address}>
                {item.area}
              </Text>

              {!!item.landmark && (
                <Text style={styles.address}>
                  {item.landmark}
                </Text>
              )}

              <Text style={styles.address}>
                {item.city} - {item.pinCode}
              </Text>

              <Text style={styles.phone}>
                {item.phoneNumber}
              </Text>

              <View style={styles.actions}>

                {!item.isDefault && (
                  <Pressable
                    onPress={() =>
                      setDefaultAddress(item.id)
                    }>
                    <Text style={styles.action}>
                      Set Default
                    </Text>
                  </Pressable>
                )}

                <Pressable>
                  <Text style={styles.action}>
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    deleteAddress(item.id)
                  }>
                  <Text
                    style={[
                      styles.action,
                      styles.delete,
                    ]}>
                    Delete
                  </Text>
                </Pressable>

              </View>
            </View>
          )}
        />

        <Pressable
  style={styles.addButton}
  onPress={() =>
    navigation.navigate('AddEditAddress')
  }>

  <Text style={styles.addText}>
    + Add New Address
  </Text>

</Pressable>

      </View>
    </SafeAreaView>
  );
};

export default AddressesScreen;

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
    marginBottom: 20,
  },

  empty: {
    marginTop: 100,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptySubtitle: {
    marginTop: 8,
    color: '#7A877F',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E4EBE7',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontWeight: '700',
    fontSize: 16,
  },

  defaultBadge: {
    backgroundColor: '#16794B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  defaultText: {
    color: '#FFF',
    fontSize: 12,
  },

  name: {
    marginTop: 10,
    fontWeight: '700',
    fontSize: 16,
  },

  address: {
    color: '#58645C',
    marginTop: 3,
  },

  phone: {
    marginTop: 8,
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 20,
  },

  action: {
    color: '#16794B',
    fontWeight: '700',
  },

  delete: {
    color: '#C0392B',
  },

  addButton: {
    marginTop: 10,
    backgroundColor: '#16794B',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});