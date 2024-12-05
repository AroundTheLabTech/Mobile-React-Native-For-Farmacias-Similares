import React from 'react';
import { View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MainLayoutStyles from './style/MainLayoutStyles';


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <ScrollView style={MainLayoutStyles.containerMax} contentContainerStyle={MainLayoutStyles.container}>
      <View style={MainLayoutStyles.headerProfile}>
        <Image
          source={require('../../../img/iconos/config.png')}
        />
      </View>
      {children}
    </ScrollView>
  );
};

export default MainLayout;
