import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import AsyncStorage from
  '@react-native-async-storage/async-storage';

import {
  AppOrder,
  OrderStatus,
  SubscriptionSchedule,
} from '../types/orders';

import {
  useAuth,
} from './AuthContext';

/*
 * Old storage key.
 *
 * We keep this temporarily so existing
 * development orders can be migrated
 * to the currently logged-in user.
 */
const LEGACY_ORDERS_STORAGE_KEY =
  '@aryavrat_orders';

/*
 * Create a unique storage key
 * for each logged-in user.
 */
const getOrdersStorageKey = (
  phoneNumber: string,
) => {
  return `@aryavrat_orders_${phoneNumber}`;
};

type OrderContextType = {
  orders: AppOrder[];

  isHydrated: boolean;

  addOrder: (
    order: AppOrder,
  ) => void;

  getOrderById: (
    id: string,
  ) => AppOrder | undefined;

  updateOrderStatus: (
    id: string,
    status: OrderStatus,
  ) => void;

  updateSubscriptionStatus: (
    id: string,
    status:
      | 'active'
      | 'paused'
      | 'cancelled',
  ) => void;

  updateOrderQuantity: (
    id: string,
    quantity: number,
  ) => void;

  setNextDeliverySkipped: (
    id: string,
    skipped: boolean,
  ) => void;

  updateSubscriptionSchedule: (
    id: string,
    schedule: SubscriptionSchedule,
    selectedDays?: string[],
  ) => void;
};

const OrderContext =
  createContext<
    OrderContextType | undefined
  >(undefined);

type Props = {
  children: ReactNode;
};

export const OrderProvider = ({
  children,
}: Props) => {
  const {
    phoneNumber,
    isAuthLoading,
  } = useAuth();

  const [orders, setOrders] =
    useState<AppOrder[]>([]);

  const [
    isHydrated,
    setIsHydrated,
  ] = useState(false);

  /*
   * Prevent an outdated asynchronous
   * load from replacing another user's
   * orders after an account switch.
   */
  const loadVersionRef =
    useRef(0);

  /*
   * Load orders whenever the active
   * logged-in user changes.
   */
  useEffect(() => {
    const currentLoadVersion =
      ++loadVersionRef.current;

    const loadOrders = async () => {
      /*
       * Wait until AuthContext finishes
       * restoring the saved session.
       */
      if (isAuthLoading) {
        return;
      }

      /*
       * Reset immediately so data from
       * the previous account is never
       * displayed for another account.
       */
      setIsHydrated(false);
      setOrders([]);

      /*
       * No logged-in user means there
       * should be no visible orders.
       */
      if (!phoneNumber) {
        setIsHydrated(true);
        return;
      }

      try {
        const storageKey =
          getOrdersStorageKey(
            phoneNumber,
          );

        /*
         * First try the new
         * user-specific storage.
         */
        const savedOrders =
          await AsyncStorage.getItem(
            storageKey,
          );

        if (
          currentLoadVersion !==
          loadVersionRef.current
        ) {
          return;
        }

        if (savedOrders) {
          const parsedOrders =
            JSON.parse(savedOrders);

          if (
            Array.isArray(
              parsedOrders,
            )
          ) {
            setOrders(
              parsedOrders as AppOrder[],
            );

            return;
          }
        }

        /*
         * MIGRATION:
         *
         * If this user does not yet
         * have user-specific storage,
         * check the old global key.
         *
         * This preserves the orders
         * created before we introduced
         * multi-user storage.
         */
        const legacyOrders =
          await AsyncStorage.getItem(
            LEGACY_ORDERS_STORAGE_KEY,
          );

        if (
          currentLoadVersion !==
          loadVersionRef.current
        ) {
          return;
        }

        if (legacyOrders) {
          const parsedLegacyOrders =
            JSON.parse(legacyOrders);

          if (
            Array.isArray(
              parsedLegacyOrders,
            )
          ) {
            const migratedOrders =
              parsedLegacyOrders as AppOrder[];

            /*
             * Save old orders under the
             * current user's new key.
             */
            await AsyncStorage.setItem(
              storageKey,
              JSON.stringify(
                migratedOrders,
              ),
            );

            if (
              currentLoadVersion !==
              loadVersionRef.current
            ) {
              return;
            }

            setOrders(
              migratedOrders,
            );

            /*
             * Remove the old global key
             * after successful migration.
             *
             * This is important so a
             * second user cannot inherit
             * the same legacy orders.
             */
            await AsyncStorage.removeItem(
              LEGACY_ORDERS_STORAGE_KEY,
            );
          }
        }
      } catch (error) {
        console.error(
          'Failed to load saved orders:',
          error,
        );
      } finally {
        if (
          currentLoadVersion ===
          loadVersionRef.current
        ) {
          setIsHydrated(true);
        }
      }
    };

    loadOrders();
  }, [
    phoneNumber,
    isAuthLoading,
  ]);

  /*
   * Save orders whenever they change,
   * but only for the active user and
   * only after hydration finishes.
   */
  useEffect(() => {
    if (
      !isHydrated ||
      !phoneNumber ||
      isAuthLoading
    ) {
      return;
    }

    const saveOrders = async () => {
      try {
        const storageKey =
          getOrdersStorageKey(
            phoneNumber,
          );

        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(orders),
        );
      } catch (error) {
        console.error(
          'Failed to save orders:',
          error,
        );
      }
    };

    saveOrders();
  }, [
    orders,
    isHydrated,
    phoneNumber,
    isAuthLoading,
  ]);

  /*
   * Add new order/subscription.
   */
  const addOrder = (
    order: AppOrder,
  ) => {
    setOrders(previousOrders => [
      order,
      ...previousOrders,
    ]);
  };

  /*
   * Find order/subscription by ID.
   */
  const getOrderById = (
    id: string,
  ) => {
    return orders.find(
      order => order.id === id,
    );
  };

  /*
   * Update Buy Once order status.
   */
  const updateOrderStatus = (
    id: string,
    status: OrderStatus,
  ) => {
    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
  };

  /*
   * Pause, resume, or cancel
   * a subscription.
   */
  const updateSubscriptionStatus = (
    id: string,
    status:
      | 'active'
      | 'paused'
      | 'cancelled',
  ) => {
    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === id
          ? {
              ...order,

              subscriptionStatus:
                status,
            }
          : order,
      ),
    );
  };

  /*
   * Change milk quantity.
   */
  const updateOrderQuantity = (
    id: string,
    quantity: number,
  ) => {
    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === id
          ? {
              ...order,
              quantity,
            }
          : order,
      ),
    );
  };

  /*
   * Skip or restore the next
   * subscription delivery.
   */
  const setNextDeliverySkipped = (
    id: string,
    skipped: boolean,
  ) => {
    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === id
          ? {
              ...order,

              nextDeliverySkipped:
                skipped,
            }
          : order,
      ),
    );
  };

  /*
   * Change subscription schedule.
   */
  const updateSubscriptionSchedule = (
    id: string,
    schedule: SubscriptionSchedule,
    selectedDays?: string[],
  ) => {
    setOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === id
          ? {
              ...order,

              schedule,

              selectedDays:
                schedule === 'custom'
                  ? selectedDays
                  : undefined,
            }
          : order,
      ),
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,

        isHydrated,

        addOrder,

        getOrderById,

        updateOrderStatus,

        updateSubscriptionStatus,

        updateOrderQuantity,

        setNextDeliverySkipped,

        updateSubscriptionSchedule,
      }}>

      {children}

    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context =
    useContext(OrderContext);

  if (!context) {
    throw new Error(
      'useOrders must be used inside OrderProvider',
    );
  }

  return context;
};