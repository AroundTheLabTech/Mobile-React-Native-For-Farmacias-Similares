import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Games from './Games';
import GameDetails from './GameDetails';
import GameIframe from './GameIframe';


const Stack = createStackNavigator();

const GamesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="GamesMain" component={Games} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="GameIframe" component={GameIframe} />
    </Stack.Navigator>
  );
};

export default GamesStack;
