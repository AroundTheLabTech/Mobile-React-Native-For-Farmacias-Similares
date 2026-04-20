import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar las pantallas
import LoginScreen from './src/screens/SessionScreen/Login';
import RegisterScreen from './src/screens/SessionScreen/Register';
import ForgotPasswordScreen from './src/screens/SessionScreen/ForgotPassword';
import TabNavigator from './src/components/TabNavigatorComponent/TabNavigator';
import SettingsStack from './src/screens/SettingsScreen/SettingsStack';
//Contexto AuthContext
import { AuthProvider } from './src/AuthContext';

import { UserProvider } from './src/services/UserContext';

// Crea los navegadores
const Stack = createStackNavigator();

export default function App() {

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <AuthProvider>
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

              </Stack.Navigator>
            </UserProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
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

