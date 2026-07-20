import React from 'react';

import AppNavigator
  from './src/navigation/AppNavigator';

import {
  OrderProvider,
} from './src/context/OrderContext';

const App = () => {
  return (
    <OrderProvider>
      <AppNavigator />
    </OrderProvider>
  );
};

export default App;