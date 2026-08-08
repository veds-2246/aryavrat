import {DeliveryAddress} from '../types/checkout';
import {NavigatorScreenParams} from '@react-navigation/native';
import {MainTabParamList} from './MainTabs';

export type RootStackParamList = {
  Splash: undefined;

  Login: undefined;

  OTP: {
    phoneNumber: string;
  };

MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
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
    | 'custom';
  selectedDays: string[];
  };

  SubscriptionReview: {
  orderType: 'subscription';
  productId: string;
  quantity: number;

  schedule:
    | 'daily'
    | 'custom';

  selectedDays: string[];

  startOption:
    | 'tomorrow'
    | 'dayAfterTomorrow';

  // Backwards compatible: previously we passed full address; new flow passes addressId
  address?: DeliveryAddress;
  addressId?: string;
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

    // Backwards compatible: allow passing full address or an addressId
    address?: DeliveryAddress;
    addressId?: string;
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
    subscriptionId: string;
  };
 
  ChangeSubscriptionSchedule: {
    subscriptionId: string;
  };

  Addresses: {
  mode?: 'manage' | 'select';
  selectedAddressId?: string;
  returnScreen?: keyof RootStackParamList;
  returnSubscriptionId?: string;
} | undefined;

  AddEditAddress: {
    addressId?: string;
  };

  HelpSupport: undefined;

  SubscriptionDetails: {
    subscriptionId: string;
    // When an addressId is provided in params, screen should update subscription.addressId
    addressId?: string;
  };

  Notifications: undefined;
};