import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ProductDetailsScreen from '../screens/products/ProductDetailsScreen';
import BuyOnceScreen from '../screens/orders/BuyOnceScreen';
import SubscriptionSetupScreen from '../screens/subscription/SubscriptionSetupScreen';
import CheckoutAddressScreen from '../screens/checkout/CheckoutAddressScreen';
import OrderReviewScreen from '../screens/checkout/OrderReviewScreen';
import SubscriptionStartScreen from '../screens/subscription/SubscriptionStartScreen';
import SubscriptionReviewScreen from '../screens/subscription/SubscriptionReviewScreen';
import ConfirmationScreen from '../screens/checkout/ConfirmationScreen';    
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import ManageSubscriptionScreen from '../screens/subscription/ManageSubscriptionScreen';
import ChangeSubscriptionScheduleScreen from '../screens/subscription/ChangeSubscriptionScheduleScreen';    
import MainTabs from './MainTabs';
import AddressesScreen from '../screens/profile/AddressesScreen';
import AddEditAddressScreen from '../screens/profile/AddEditAddressScreen';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}>

        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="OTP"
          component={OtpScreen}
        />

        <Stack.Screen
          name="Home"
          component={MainTabs}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="BuyOnce"
          component={BuyOnceScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="CheckoutAddress"
          component={CheckoutAddressScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="OrderReview"
          component={OrderReviewScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="SubscriptionSetup"
          component={SubscriptionSetupScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="SubscriptionStart"
              component={SubscriptionStartScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="SubscriptionReview"
          component={SubscriptionReviewScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
    
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="OrderDetails"
          component={OrderDetailsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
    
        <Stack.Screen
          name="ManageSubscription"
          component={ManageSubscriptionScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="ChangeSubscriptionSchedule"
          component={ChangeSubscriptionScheduleScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="Addresses"
          component={AddressesScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="AddEditAddress"
          component={AddEditAddressScreen}
          options={{
            title: 'Delivery Address',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;