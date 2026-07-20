export type OrderType =
  | 'buyOnce'
  | 'subscription';

export type OrderStatus =
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type SubscriptionSchedule =
  | 'daily'
  | 'alternate'
  | 'custom';

export type SubscriptionStatus =
  | 'active'
  | 'paused'
  | 'cancelled';

export type AppOrder = {
  id: string;

  type: OrderType;

  productId: string;
  productName: string;

  quantity: number;

  status: OrderStatus;

  createdAt: string;

  // Buy Once
  deliveryDate?: string;

  // Subscription
  schedule?: SubscriptionSchedule;
  selectedDays?: string[];
  startDate?: string;

  subscriptionStatus?: SubscriptionStatus;

  nextDeliverySkipped?: boolean;

  pricePerDelivery: number;

  estimatedMonthlyCost?: number;
};