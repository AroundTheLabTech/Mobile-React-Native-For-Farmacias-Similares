import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar las pantallas
import LoginScreen from './src/screens/SessionScreen/Login';
import RegisterScreen from './src/screens/SessionScreen/Register';
import TabNavigator from './src/components/TabNavigatorComponent/TabNavigator';
import SettingsStack from './src/screens/SettingsScreen/SettingsStack';
import GamesStack from './src/screens/GamesScreen/GamesStack';

//Contexto AuthContext
import { AuthProvider } from './src/AuthContext';

import 'react-native-reanimated';

// Crea los navegadores
const Stack = createStackNavigator();

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }} // Sin Tab Bar
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }} // Sin Tab Bar
            />
            <Stack.Screen
              name="MainTab" // Cambiamos el nombre de "Home" a "MainTab"
              component={TabNavigator} // Muestra la vista con el Tab Navigator
              options={{ headerShown: false }} // Sin header
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
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
