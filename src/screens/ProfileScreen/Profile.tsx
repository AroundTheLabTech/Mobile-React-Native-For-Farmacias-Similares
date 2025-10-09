import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileStyles from './style/ProfileStyle';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar, faGlobe, faCube } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth

//Services
import StadisticsScreen from './Stadistics';
import _404Page from '../404Screen/404';
import Badges from './Badges';
import EllipseComponent from '../../components/ElipseComponent/ElipseComponent';
import Spacer from '../../components/SpacerComponent/Spacer';
import Loader from '@components/LoaderComponent/Loader';
import { useUser } from '@services/UserContext';
import { getTopGlobalByUser, getTopMonthlyByUser } from '../../services/backend';


const ProfileScreen = ({ navigation }) => {

  const { uid } = useAuth();

  const [selectedTab, setSelectedTab] = useState('stadistics');

  const [topGlobal, setTopGlobal] = useState<number | null>(null);
  const [topMonthly, setTopMonthly] = useState<number | null>(null);

  const { profilePicture, setUpdateProfilePicture, userPoints, setUpdateUserPoints, userInformation } = useUser();

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
    } else {
      setUpdateUserPoints(false);
    }
  }, [setUpdateUserPoints, userPoints]);

  useEffect(() => {
    async function fetchData() {
      const topGlobalPosition = await getTopGlobalByUser(uid);
      if (topGlobalPosition !== null
        && topGlobalPosition !== undefined
        && !isNaN(topGlobalPosition)
        && topGlobalPosition > 0
      ) {
        setTopGlobal(topGlobalPosition);
      } else {
        setTopGlobal(0);
      }

      const topMonthlyPosition = await getTopMonthlyByUser(uid);
      if (topMonthlyPosition !== null
        && topMonthlyPosition !== undefined
        && !isNaN(topMonthlyPosition)
        && topMonthlyPosition > 0
      ) {
        setTopMonthly(topMonthlyPosition);
      } else {
        setTopMonthly(0);
      }

    }
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

  useEffect(() => {
    function fetchData() {
      if (!profilePicture) {
        setUpdateProfilePicture(true);
      } else {
        setUpdateProfilePicture(false);
      }
    }

    fetchData();
  }, [profilePicture, setUpdateProfilePicture, uid]);

  if (!userInformation || !userInformation.name || !userPoints) {
    return <Loader visible={true} />;
  }

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
      <View style={ProfileStyles.ProfileContainer} >
        {/* Foto de Perfil  */}
        <View style={ProfileStyles.profileImageContainer}>
          <Image
            resizeMode="contain"
            style={ProfileStyles.imageProfile}
            source={{ uri: profilePicture }}
          />
        </View>
        {/* View Dashboard */}
        <View style={ProfileStyles.containerDashboard}>
          <Text style={ProfileStyles.TextProfile}>{userInformation?.name || 'Usuario'}</Text>
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
                Puntos
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
                #{topGlobal !== null ? topGlobal : '...'}
              </Text>
            </View>
            {/* Top Mensual */}
            <View style={ProfileStyles.puntajeBox2}>
              {/* Icono */}
              <View style={ProfileStyles.containerIcono}>
                <FontAwesomeIcon icon={faCube} size={20} color="#fff" />
              </View>
              {/* Title */}
              <Text style={ProfileStyles.titlePuntaje}>
                Top Mensual
              </Text>
              {/* Puntos */}
              <Text style={ProfileStyles.puntajeNumber}>
                #{topMonthly !== null ? topMonthly : '...'}
              </Text>
            </View>
          </View>
          {/* Insignias  */}
          <View style={ProfileStyles.containerPuntaje}>
            {/* NavBar */}
            <View style={ProfileStyles.containerNavBar}>
              {/* Botones para cambiar la vista */}
              <TouchableOpacity /* onPress={() => setSelectedTab('badges')} */ disabled>
                {
                  selectedTab === 'badges' ?
                    (<>
                      <Text style={ProfileStyles.TabNabTitle} >Insignias</Text>
                      <Spacer />
                      <EllipseComponent width={10} height={10} color={'#6A5AE0'} />
                    </>) :
                    (<>
                      <Text style={ProfileStyles.TabNabTitleSelected} >Insignias</Text>
                    </>)
                }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('stadistics')}>
                {
                  selectedTab === 'stadistics' ?
                    (<>
                      <Text style={ProfileStyles.TabNabTitle} >Estadisticas</Text>
                      <Spacer />
                      <EllipseComponent width={10} height={10} color={'#6A5AE0'} />
                    </>) :
                    (<>
                      <Text style={ProfileStyles.TabNabTitleSelected} >Estadisticas</Text>
                    </>)
                }
              </TouchableOpacity>
              {/*
            <TouchableOpacity disabled onPress={() => setSelectedView('estadisticas')}>
              <Text>Detalles</Text>
            </TouchableOpacity>
            */}
            </View>
            <View style={ProfileStyles.containerInsignias}>
              {renderContent()}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
