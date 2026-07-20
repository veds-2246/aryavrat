import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

import {
  AppOrder,
  OrderStatus,
  SubscriptionSchedule,
} from '../types/orders';

type OrderContextType = {
  orders: AppOrder[];

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
  const [orders, setOrders] =
    useState<AppOrder[]>([]);

  // Add new order/subscription
  const addOrder = (
    order: AppOrder,
  ) => {
    setOrders(previousOrders => [
      order,
      ...previousOrders,
    ]);
  };

  // Find order/subscription by ID
  const getOrderById = (
    id: string,
  ) => {
    return orders.find(
      order => order.id === id,
    );
  };

  // Update normal order status
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

  // Pause, resume, or cancel subscription
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

  // Change milk quantity
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

  // Skip/unskip next delivery
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

  // Change subscription schedule
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