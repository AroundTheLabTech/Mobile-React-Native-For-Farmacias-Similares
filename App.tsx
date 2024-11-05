import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar las pantallas
import LoginScreen from './src/screens/SessionScreen/Login';
import RegisterScreen from './src/screens/SessionScreen/Register';
import TabNavigator from './src/components/TabNavigatorComponent/TabNavigator';

//Contexto AuthContext
import { AuthProvider } from './src/AuthContext';

import './src/services/i18n';
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
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
