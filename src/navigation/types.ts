import {DeliveryAddress} from '../types/checkout';

export type RootStackParamList = {
  Splash: undefined;

  Login: undefined;

  OTP: {
    phoneNumber: string;
  };

  Home: undefined;

  ProductDetails: {
    productId: string;
  };

  BuyOnce: {
    productId: string;
    quantity: number;
  };

  SubscriptionSetup: {
    productId: string;
    quantity: number;
  };

  SubscriptionStart: {
  productId: string;
  quantity: number;
  schedule:
    | 'daily'
    | 'alternate'
    | 'custom';
  selectedDays: string[];
  };

  SubscriptionReview: {
  orderType: 'subscription';
  productId: string;
  quantity: number;

  schedule:
    | 'daily'
    | 'alternate'
    | 'custom';

  selectedDays: string[];

  startOption:
    | 'tomorrow'
    | 'dayAfterTomorrow';

  address: DeliveryAddress;
  };

  CheckoutAddress: {
  orderType:
    | 'buyOnce'
    | 'subscription';

  productId: string;

  quantity: number;

  deliveryOption?:
    | 'tomorrow'
    | 'dayAfterTomorrow';

  schedule?:
    | 'daily'
    | 'alternate'
    | 'custom';

  selectedDays?: string[];

  startOption?:
    | 'tomorrow'
    | 'dayAfterTomorrow';
};

  OrderReview: {
    orderType: 'buyOnce';
    productId: string;
    quantity: number;

    deliveryOption:
      | 'tomorrow'
      | 'dayAfterTomorrow';

    address: DeliveryAddress;
  };

  Confirmation: {
    type: 'buyOnce' | 'subscription';
    productId: string;
    quantity: number;
    referenceId: string;
  };

  OrderDetails: {
    orderId: string;
  };

  ManageSubscription: {
    SubscriptionId: string;
  };

  ChangeSubscriptionSchedule: {
    SubscriptionId: string;
  };
};