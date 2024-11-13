import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './Profile';
import SettingsStack from '../SettingsScreen/SettingsStack';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
        <Stack.Screen name="HomeMain" component={Profile} />
        <Stack.Screen name="SettingsMain" component={SettingsStack} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
