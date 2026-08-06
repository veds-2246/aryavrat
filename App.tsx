import React from 'react';

import {
  AuthProvider,
} from './src/context/AuthContext';

import AppNavigator
  from './src/navigation/AppNavigator';

import {
  OrderProvider,
} from './src/context/OrderContext';

import {
  AddressProvider,
} from './src/context/AddressContext';

import {
  NotificationProvider,
} from './src/context/NotificationContext';

const App = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <AddressProvider>
          <NotificationProvider>
            <AppNavigator />
          </NotificationProvider>
        </AddressProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;