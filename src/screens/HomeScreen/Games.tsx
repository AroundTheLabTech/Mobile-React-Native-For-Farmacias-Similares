import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Loader from '@components/LoaderComponent/Loader';

const GamesScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.navigate('Games', { screen: 'GamesMain' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Loader visible={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GamesScreen;
