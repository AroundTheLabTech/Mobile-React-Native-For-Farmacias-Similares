import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad, faUser, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { darkTheme } from '../../theme/colors';

import GamesStack from '../../screens/GamesScreen/GamesStack';
import ProfileStack from '../../screens/ProfileScreen/ProfileStack';
import LeaderBoard from '../../screens/LeaderBoard/LeaderBoard';

import { ParamListBase, RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const tabBarIconOptions = (
    route: RouteProp<ParamListBase, string>,
    { color, size }: { color: string; size: number },
  ) => {
    let iconName = faGamepad;
    if (route.name === 'Games') iconName = faGamepad;
    else if (route.name === 'Leaderboard') iconName = faChartBar;
    else if (route.name === 'Profile') iconName = faUser;
    return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (options) => tabBarIconOptions(route, options),
        tabBarActiveTintColor: darkTheme.purple,
        tabBarInactiveTintColor: darkTheme.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Leaderboard" component={LeaderBoard} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: darkTheme.bg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    elevation: 0,
    shadowOpacity: 0,
    position: 'absolute',
  },
});

export default TabNavigation;
