import React from 'react';

import {
  AuthProvider,
} from './src/context/AuthContext';

import AppNavigator
  from './src/navigation/AppNavigator';

import {
  OrderProvider,
} from './src/context/OrderContext';

const App = () => {
  return (
    <AuthProvider>
      <OrderProvider>
        <AppNavigator />
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;