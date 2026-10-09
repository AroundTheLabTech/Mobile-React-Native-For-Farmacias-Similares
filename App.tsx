import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar las pantallas
import LoginScreen from './src/screens/SessionScreen/Login';
import RegisterScreen from './src/screens/SessionScreen/Register';
import ForgotPasswordScreen from './src/screens/SessionScreen/ForgotPassword';
import TabNavigator from './src/components/TabNavigatorComponent/TabNavigator';
import SettingsStack from './src/screens/SettingsScreen/SettingsStack';
import GamesStack from './src/screens/GamesScreen/GamesStack';

//Contexto AuthContext
import { AuthProvider, useAuth } from './src/AuthContext';

import { UserProvider } from './src/services/UserContext';
import { setOnSessionExpiredCallback } from './src/services/backend';
import { darkTheme } from './src/theme/colors';

// Crea los navegadores
const Stack = createStackNavigator();

/** Registra el callback de sesión expirada.
 *  Debe vivir DENTRO del AuthProvider para poder usar useAuth(). */
function SessionExpiredHandler() {
  const { logout } = useAuth();

  useEffect(() => {
    setOnSessionExpiredCallback(() => {
      logout();
    });
  }, [logout]);

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: darkTheme.bg }]}
          edges={['top', 'left', 'right']}>
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            <AuthProvider>
              <SessionExpiredHandler />
              <UserProvider>
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
                    name="ForgotPassword"
                    component={ForgotPasswordScreen}
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
              </UserProvider>
            </AuthProvider>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
