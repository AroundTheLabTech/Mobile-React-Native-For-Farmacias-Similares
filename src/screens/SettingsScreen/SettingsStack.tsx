import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import AccountCenter from './AccountCenter';
import ProfilePicture from './ProfilePicture';
import ReportProblem from './ReportProblem';

const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="SettingsMain" component={Settings} />
      <Stack.Screen name="AccountCenter" component={AccountCenter} />
      <Stack.Screen name="ProfilePicture" component={ProfilePicture} />
      <Stack.Screen name="ReportProblem" component={ReportProblem} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
