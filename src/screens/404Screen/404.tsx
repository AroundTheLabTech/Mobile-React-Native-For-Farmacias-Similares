import React, {  } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import _404Styles from './style/404Style';

const _404Page = () => {

  return (
    <ScrollView style={_404Styles.containerMax} contentContainerStyle={_404Styles.container}>
      <View>
        <Text>
          404
        </Text>
      </View>

    </ScrollView>
  );
};

export default _404Page;
