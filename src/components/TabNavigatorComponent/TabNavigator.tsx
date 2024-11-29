import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faChartBar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../../global-class';

import HomeScreen from '../../screens/HomeScreen/Home';
import ProfileStack from '../../screens/ProfileScreen/ProfileStack';
import LeaderBoard from '../../screens/LeaderBoard/LeaderBoard';

import { useAuth } from '../../AuthContext';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import NotchBackground from './NotchBackground';
// import _404Page from '../../screens/404Screen/404';

const Tab = createBottomTabNavigator();

const TabBarBackground = () => {
  return <NotchBackground />;
};

const TabNavigation = () => {
  const { uid, displayName } = useAuth();

  useEffect(() => {
    if (uid) {
      console.log('El UID del usuario es:', uid);
      console.log('El nombre de usuario es:', displayName);
    }
  }, [displayName, uid]);

  const tabBarIconOptions = (route: RouteProp<ParamListBase, string>, { color, size }) => {
    let iconName = faHome;
    if (route.name === 'Home') {
      iconName = faHome;
    } else if (route.name === 'Profile') {
      iconName = faUser;
    } else if (route.name === 'Leaderboard') {
      iconName = faChartBar;
    } else if (route.name === 'Search') {
      iconName = faMagnifyingGlass;
    }

    return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (options) => tabBarIconOptions(route, options),
        tabBarActiveTintColor: colors.third,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarBackground: TabBarBackground,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      {/**
      <Tab.Screen name="Search"
        component={HomeScreen}
      />
      */}
      <Tab.Screen name="Leaderboard"
        component={LeaderBoard}
      />
      <Tab.Screen name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    position: 'absolute',
  },
  tabBarBackground: {
    backgroundColor: 'transparent',
  },
});

export default TabNavigation;
