import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar las pantallas
import LoginScreen from '@ui/screens/SessionScreen/Login';
import RegisterScreen from '@ui/screens/SessionScreen/Register';
import TabNavigator from '@ui/components/TabNavigatorComponent/TabNavigator';
import SettingsStack from '@ui/screens/SettingsScreen/SettingsStack';
import GamesStack from '@ui/screens/GamesScreen/GamesStack';

// Crear los navegadores
const Stack = createStackNavigator();

export const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MainTab"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsStack}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Games"
      component={GamesStack}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
