import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//Contexto AuthContext
import { AppProviders } from '@app/providers/AppProviders';
import { StackNavigator } from './navigation/StackNavigator';

export default function App() {

  return (
    <GestureHandlerRootView style={styles.containe}>
      <NavigationContainer>
        <AppProviders>
          <StackNavigator />
        </AppProviders>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  containe: {
    flex: 1,
  },
});

