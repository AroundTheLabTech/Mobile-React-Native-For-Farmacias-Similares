import React, {  } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import _404Styles from './style/404Style';

//Services
import { useTranslation } from 'react-i18next';



const _404Page = () => {

  const { t } = useTranslation();

  return (
    <ScrollView style={_404Styles.containerMax} contentContainerStyle={_404Styles.container}>
      <View>
        <Text>
          {t('404')}
        </Text>
      </View>

    </ScrollView>
  );
};

export default _404Page;
