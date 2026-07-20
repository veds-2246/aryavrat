import React from 'react';
import {Text} from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type MainTabParamList = {
  HomeTab: undefined;
  Products: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab =
  createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#16794B',
        tabBarInactiveTintColor: '#89938D',

        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopColor: '#E5EBE7',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>

      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <Text style={{fontSize: focused ? 23 : 21}}>
              🏠
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          title: 'Products',
          tabBarIcon: ({focused}) => (
            <Text style={{fontSize: focused ? 23 : 21}}>
              🥛
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Orders',
          tabBarIcon: ({focused}) => (
            <Text style={{fontSize: focused ? 23 : 21}}>
              📦
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => (
            <Text style={{fontSize: focused ? 23 : 21}}>
              👤
            </Text>
          ),
        }}
      />

    </Tab.Navigator>
  );
};

export default MainTabs;