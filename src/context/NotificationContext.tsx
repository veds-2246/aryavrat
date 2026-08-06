import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

import {
  AppNotification,
} from '../types/notifications';

type NotificationContextType = {
  notifications: AppNotification[];

  addNotification: (
    notification: AppNotification,
  ) => void;

  markAsRead: (
    id: string,
  ) => void;

  markAllAsRead: () => void;

  deleteNotification: (
    id: string,
  ) => void;

  clearNotifications: () => void;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined,
  );

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
  notifications,
  setNotifications,
] = useState<AppNotification[]>([
  {
    id: '1',
    title: '🥛 Subscription Created',
    message: 'Your daily milk subscription has been created successfully.',
    type: 'subscription',
    createdAt: 'Today, 8:30 AM',
    isRead: false,
  },
  {
    id: '2',
    title: '📍 Address Updated',
    message: 'Your delivery address has been updated successfully.',
    type: 'address',
    createdAt: 'Yesterday',
    isRead: false,
  },
  {
    id: '3',
    title: '📦 Order Confirmed',
    message: 'Your Buy Once order has been confirmed.',
    type: 'order',
    createdAt: '2 days ago',
    isRead: true,
  },
]);

  const addNotification = (
    notification: AppNotification,
  ) => {
    setNotifications(previous => [
      notification,
      ...previous,
    ]);
  };

  const markAsRead = (
    id: string,
  ) => {
    setNotifications(previous =>
      previous.map(notification =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(previous =>
      previous.map(notification => ({
        ...notification,
        isRead: true,
      })),
    );
  };

  const deleteNotification = (
    id: string,
  ) => {
    setNotifications(previous =>
      previous.filter(
        notification =>
          notification.id !== id,
      ),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used inside NotificationProvider',
    );
  }

  return context;
};