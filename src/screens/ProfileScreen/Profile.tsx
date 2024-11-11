import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileStyles from './style/ProfileStyle';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faGlobe, faCube } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth

//Services
import { useTranslation } from 'react-i18next';


import StadisticsScreen from './Stadistics';
import _404Page from '../404Screen/404';
import Badges from './Badges';
import EllipseComponent from '../../components/ElipseComponent/ElipseComponent';
import Spacer from '../../components/SpacerComponent/Spacer';
import { getUserPoints } from '../../services/backend';
import { TUserPoints } from 'src/types/user';


const ProfileScreen: React.FC = ({ navigation }) => {

  const { displayName, uid } = useAuth();

  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('badges');
  const [userPoints, setUserPoints] = useState<TUserPoints>();

  useEffect(() => {
    const fetchData = async () => {
      const result: TUserPoints = await getUserPoints(uid);
      setUserPoints(result);
    };

    fetchData();
  }, [uid]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'badges':
        return <Badges />;
      case 'stadistics':
        return <StadisticsScreen />;
      default:
        return <_404Page />;
    }
  };

  return (
    <ScrollView style={ProfileStyles.containerMax} contentContainerStyle={ProfileStyles.container}>

      {/* Header Profile */}
      <View style={ProfileStyles.headerProfile}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} >
          <Image
            source={require('../../../img/iconos/config.png')}
          />
        </TouchableOpacity>
      </View>


      {/* Foto de Perfil  */}
      <View style={ProfileStyles.profileImageContainer}>
        <Image
          resizeMode="contain"
          style={ProfileStyles.imageProfile}
          source={require('../../../img/profile/victorGonzales.png')}
        />
      </View>

      {/* View Dashboard */}
      <View style={ProfileStyles.containerDashboard}>
        <Text style={ProfileStyles.TextProfile}>{displayName || 'Usuario'}</Text>

        {/* Puntuacion Global */}
        <View style={ProfileStyles.ContainerPuntaje}>
          {/* Puntos */}
          <View style={ProfileStyles.puntajeBox}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
              <FontAwesomeIcon icon={faStar} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              {t('points')}
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              {userPoints?.score_total}
            </Text>
          </View>

          {/* Top Mundial */}
          <View style={ProfileStyles.puntajeBox}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
              <FontAwesomeIcon icon={faGlobe} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              Top Mundial
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              #1,438
            </Text>
          </View>

          {/* Top Local */}
          <View style={ProfileStyles.puntajeBox2}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
              <FontAwesomeIcon icon={faCube} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              Top Local
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              #56
            </Text>
          </View>
        </View>

        {/* Insignias  */}

        <View style={ProfileStyles.containerPuntaje}>
          {/* NavBar */}
          <View style={ProfileStyles.containerNavBar}>
            {/* Botones para cambiar la vista */}
            <TouchableOpacity onPress={() => setSelectedTab('badges')}>
              {
                selectedTab === 'badges' ?
                  (<>
                    <Text style={ProfileStyles.TabNabTitle} >{t('badges')}</Text>
                    <Spacer />
                    <EllipseComponent width={10} height={10} color={'#6A5AE0'} />
                  </>) :
                  (<>
                    <Text style={ProfileStyles.TabNabTitleSelected} >{t('badges')}</Text>
                  </>)
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('stadistics')}>
              {
                selectedTab === 'stadistics' ?
                  (<>
                    <Text style={ProfileStyles.TabNabTitle} >{t('stadistics')}</Text>
                    <Spacer />
                    <EllipseComponent width={10} height={10} color={'#6A5AE0'} />
                  </>) :
                  (<>
                    <Text style={ProfileStyles.TabNabTitleSelected} >{t('stadistics')}</Text>
                  </>)
              }
            </TouchableOpacity>
            {/*
            <TouchableOpacity disabled onPress={() => setSelectedView('estadisticas')}>
              <Text>{t('details')}</Text>
            </TouchableOpacity>
            */}
          </View>

          <View style={ProfileStyles.containerInsignias}>
            {renderContent()}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
