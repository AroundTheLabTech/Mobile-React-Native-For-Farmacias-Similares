import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Games from './Games';
import GameDetails from './GameDetails';
import GameIframe from './GameIframe';
import AllCompetitions from './AllCompetitions';

const Stack = createStackNavigator();

const GamesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamesMain" component={Games} />
    <Stack.Screen name="GameDetails" component={GameDetails} />
    <Stack.Screen name="GameIframe" component={GameIframe} />
    <Stack.Screen name="AllCompetitionMain" component={AllCompetitions} />
  </Stack.Navigator>
);

export default GamesStack;
