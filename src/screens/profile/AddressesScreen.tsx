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

import {useOrders} from '../../context/OrderContext';
import {useAuth} from '../../context/AuthContext';
import {useNotifications} from '../../context/NotificationContext';

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../navigation/types';

import {
  fetchAddresses,
  deleteAddress as deleteAddressApi,
  updateAddress,
} from '../../services/AddressService';

type AddressesScreenNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList,
    'Addresses'
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

const AddressesScreen = () => {
  const navigation =
    useNavigation<AddressesScreenNavigationProp>();


  const route = useRoute();

  const params = (route.params ??
    {}) as {
    mode?: 'manage' | 'select';
    selectedAddressId?: string;
    returnScreen?: keyof RootStackParamList;
    returnSubscriptionId?: string;
  };

  const {userId} = useAuth();

  const [addresses, setAddresses] =
    React.useState<BackendAddress[]>([]);

  const {updateOrder} = useOrders();

  const {addNotification} =
    useNotifications();

  const isSelectMode =
    params.mode === 'select';

  const [selectedId, setSelectedId] =
    React.useState<string | undefined>(
      params.selectedAddressId,
    );

  const loadAddresses =
    React.useCallback(async () => {
      if (!userId) {
        return;
      }

      try {
        const data =
          await fetchAddresses(userId);

        setAddresses(data);
      } catch (error) {
        console.error(
          'Failed to load addresses',
          error,
        );
      }
    }, [userId]);

  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useFocusEffect(
    React.useCallback(() => {
      loadAddresses();
    }, [loadAddresses]),
  );

  const handleSelect = (id: string) => {
    if (!isSelectMode) {
      return;
    }

    setSelectedId(id);
  };

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

              <Text
                style={styles.emptySubtitle}>
                Add your first delivery
                address.
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <Pressable
              onPress={() =>
                isSelectMode
                  ? handleSelect(item.id)
                  : undefined
              }
              style={
                item.id === selectedId &&
                isSelectMode
                  ? [
                      styles.card,
                      styles.selectedCard,
                    ]
                  : styles.card
              }>
              <View style={styles.row}>
                <Text style={styles.label}>
                  {item.label}
                </Text>

                {item.is_default &&
                  !isSelectMode && (
                    <View
                      style={
                        styles.defaultBadge
                      }>
                      <Text
                        style={
                          styles.defaultText
                        }>
                        Default
                      </Text>
                    </View>
                  )}
              </View>

              <Text style={styles.name}>
                {item.full_name}
              </Text>

              <Text style={styles.address}>
                {item.address_line}
              </Text>

              <Text style={styles.address}>
                {item.state}
              </Text>

              {!!item.landmark && (
                <Text style={styles.address}>
                  {item.landmark}
                </Text>
              )}

              <Text style={styles.address}>
                {item.city} - {item.pincode}
              </Text>

              <Text style={styles.phone}>
                {item.phone}
              </Text>

              {!isSelectMode && (
                <View style={styles.actions}>
                  {!item.is_default && (
                    <Pressable
                      onPress={async () => {
                        await updateAddress(
                          item.id,
                          {
                            is_default:
                              true,
                          },
                        );

                        loadAddresses();
                      }}>
                      <Text
                        style={styles.action}>
                        Set Default
                      </Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        'AddEditAddress',
                        {
                          addressId:
                            item.id,
                        },
                      )
                    }>
                    <Text
                      style={styles.action}>
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={async () => {
                      await deleteAddressApi(
                        item.id,
                      );

                      loadAddresses();
                    }}>
                    <Text
                      style={[
                        styles.action,
                        styles.delete,
                      ]}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          )}
        />

        {!isSelectMode && (
          <Pressable
            style={styles.addButton}
            onPress={() =>
              navigation.navigate(
                'AddEditAddress',
                {},
              )
            }>
            <Text style={styles.addText}>
              + Add New Address
            </Text>
          </Pressable>
        )}

        {isSelectMode && (
          <Pressable
            style={[
              styles.addButton,
              !selectedId &&
                styles.disabledButton,
            ]}
            disabled={!selectedId}
            onPress={() => {
              if (
                selectedId &&
                params.returnSubscriptionId
              ) {
                updateOrder(
                  params.returnSubscriptionId,
                  {
                    addressId:
                      selectedId,
                  },
                );

                const address =
                  addresses.find(
                    a =>
                      a.id ===
                      selectedId,
                  );

                addNotification({
                  id: Date.now().toString(),
                  title:
                    '📍 Delivery Address Updated',
                  message: address
                    ? `Delivery address changed to ${address.label}.`
                    : 'Delivery address updated.',
                  type: 'address',
                  createdAt:
                    new Date().toLocaleString(),
                  isRead: false,
                });
              }

              navigation.goBack();
            }}>
            <Text style={styles.addText}>
              Use This Address
            </Text>
          </Pressable>
        )}
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
    justifyContent:
      'space-between',
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

  selectedCard: {
    borderColor: '#16794B',
    backgroundColor: '#EAF5EF',
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

  disabledButton: {
    backgroundColor: '#BFC8C2',
  },

  addText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});