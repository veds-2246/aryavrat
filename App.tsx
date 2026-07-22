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

const App = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <AddressProvider>
          <AppNavigator />
        </AddressProvider>
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;