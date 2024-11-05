import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileStyles from './style/ProfileStyle';
import { TabView, SceneMap } from 'react-native-tab-view';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faGlobe, faCube } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth

//Services
import { useTranslation } from 'react-i18next';

import TabBarMenuStyle from './style/TabBarMenuStyle';

const ProfileScreen = () => {

  const { t } = useTranslation();

  return (
    <View style={ProfileStyles.containerNavBar}>
      <TouchableOpacity onPress={() => setSelectedView('insignias')}>
        <Text>{t('badges')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSelectedView('estadisticas')}>
        <Text>{t('stadistics')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
