import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Address} from '../types/address';
import {useAuth} from './AuthContext';

type AddressContextType = {
  addresses: Address[];
  isHydrated: boolean;

  addAddress: (address: Address) => void;

  updateAddress: (
    id: string,
    updatedAddress: Address,
  ) => void;

  deleteAddress: (
    id: string,
  ) => void;

  setDefaultAddress: (
    id: string,
  ) => void;

  getDefaultAddress: () => Address | undefined;

  getAddressById: (
    id: string,
  ) => Address | undefined;
};

const AddressContext =
  createContext<
    AddressContextType | undefined
  >(undefined);

type Props = {
  children: ReactNode;
};

const getStorageKey = (
  phoneNumber: string,
) =>
  `@aryavrat_addresses_${phoneNumber}`;

export const AddressProvider = ({
  children,
}: Props) => {
  const {
    phoneNumber,
    isAuthLoading,
  } = useAuth();

  const [
    addresses,
    setAddresses,
  ] = useState<Address[]>([]);

  const [
    isHydrated,
    setIsHydrated,
  ] = useState(false);

  /*
   * Load addresses whenever
   * logged in user changes.
   */
  useEffect(() => {
    const loadAddresses =
      async () => {
        if (isAuthLoading) {
          return;
        }

        setAddresses([]);
        setIsHydrated(false);

        if (!phoneNumber) {
          setIsHydrated(true);
          return;
        }

        try {
          const saved =
            await AsyncStorage.getItem(
              getStorageKey(
                phoneNumber,
              ),
            );

          if (saved) {
            const parsed =
              JSON.parse(saved);

            if (
              Array.isArray(
                parsed,
              )
            ) {
              setAddresses(parsed);
            }
          }
        } catch (error) {
          console.error(
            'Failed loading addresses',
            error,
          );
        } finally {
          setIsHydrated(true);
        }
      };

    loadAddresses();
  }, [
    phoneNumber,
    isAuthLoading,
  ]);

  /*
   * Save whenever changed.
   */
  useEffect(() => {
    if (
      !isHydrated ||
      !phoneNumber
    ) {
      return;
    }

    AsyncStorage.setItem(
      getStorageKey(phoneNumber),
      JSON.stringify(addresses),
    );
  }, [
    addresses,
    phoneNumber,
    isHydrated,
  ]);

  const addAddress = (
    address: Address,
  ) => {
    let updated = [...addresses];

    if (
      address.isDefault ||
      updated.length === 0
    ) {
      updated = updated.map(a => ({
        ...a,
        isDefault: false,
      }));
    }

    updated.unshift(address);

    setAddresses(updated);
  };

  const updateAddress = (
    id: string,
    updatedAddress: Address,
  ) => {
    let updated =
      addresses.map(address =>
        address.id === id
          ? updatedAddress
          : address,
      );

    if (
      updatedAddress.isDefault
    ) {
      updated = updated.map(
        address => ({
          ...address,
          isDefault:
            address.id === id,
        }),
      );
    }

    setAddresses(updated);
  };

  const deleteAddress = (
    id: string,
  ) => {
    let updated =
      addresses.filter(
        address =>
          address.id !== id,
      );

    /*
     * If default removed,
     * first address becomes
     * new default.
     */
    if (
      !updated.some(
        a => a.isDefault,
      ) &&
      updated.length > 0
    ) {
      updated[0].isDefault =
        true;
    }

    setAddresses(updated);
  };

  const setDefaultAddress = (
    id: string,
  ) => {
    setAddresses(
      addresses.map(address => ({
        ...address,
        isDefault:
          address.id === id,
      })),
    );
  };

  const getDefaultAddress =
    () => {
      return addresses.find(
        address =>
          address.isDefault,
      );
    };

  const getAddressById = (
    id: string,
  ) => {
    return addresses.find(
      address =>
        address.id === id,
    );
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,

        isHydrated,

        addAddress,

        updateAddress,

        deleteAddress,

        setDefaultAddress,

        getDefaultAddress,

        getAddressById,
      }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses =
  () => {
    const context =
      useContext(
        AddressContext,
      );

    if (!context) {
      throw new Error(
        'useAddresses must be used inside AddressProvider',
      );
    }

    return context;
  };