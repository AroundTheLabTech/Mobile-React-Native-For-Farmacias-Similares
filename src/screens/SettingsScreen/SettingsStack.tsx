import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
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
      <Stack.Screen name="ReportProblem" component={ReportProblem} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
