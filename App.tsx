import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faChartBar, faGamepad } from '@fortawesome/free-solid-svg-icons';

// Importar las pantallas
import LoginScreen from './src/screens/SessionScreen/Login';
import RegisterScreen from './src/screens/SessionScreen/Register';
import HomeScreen from './src/screens/HomeScreen/Home';
import ProfileScreen from './src/screens/HomeScreen/Profile';
import StadisticsScreen from './src/screens/HomeScreen/Stadistics';
import GamesScreen from './src/screens/HomeScreen/Games';

//Contexto AuthContext
import { AuthProvider } from './src/AuthContext';


// Importar estilos globales
import { colors } from './global-class';

// Crea los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente del Tab Navigator para las vistas con barra de navegación
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = faHome;

          if (route.name === 'Home') {
            iconName = faHome;
          } else if (route.name === 'Profile') {
            iconName = faUser;
          } else if (route.name === 'Stadistics') {
            iconName = faChartBar;
          } else if (route.name === 'Games') {
            iconName = faGamepad;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.third, // Color cuando está activo
        tabBarInactiveTintColor: colors.secondary, // Color cuando está inactivo
      })}
    >
      <Tab.Screen 
      name="Home"
       component={HomeScreen} 
       options={{headerShown:false}}
       />
      <Tab.Screen name="Profile"
      component={ProfileScreen}
      options ={{headerShown:false}}
      />
      <Tab.Screen name="Stadistics" 
      component={StadisticsScreen} 
      options={{headerShown: false}}
      />
      <Tab.Screen name="Games" 
      component={GamesScreen} 
      options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

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
