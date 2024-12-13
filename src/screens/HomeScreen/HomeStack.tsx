import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Home';
import AllCompetitions from './AllCompetitions';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="AllCompetitionMain" component={AllCompetitions} />
    </Stack.Navigator>
  );
};

export default HomeStack;
