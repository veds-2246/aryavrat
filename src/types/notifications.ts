export type NotificationType =
  | 'order'
  | 'subscription'
  | 'delivery'
  | 'address'
  | 'system';

export type AppNotification = {
  id: string;

  title: string;

  message: string;

  type: NotificationType;

  createdAt: string;

  isRead: boolean;
};