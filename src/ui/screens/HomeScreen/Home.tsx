import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

// Styles
import HomeStyles from './style/HomeStyle';

import { useAuth } from '@domain/context/AuthContext'; // Importa el hook useAuth
import { useUser } from '@domain/context/UserContext';
import CompetitionModal from '@ui/components/CompetitionComponent/CompetitionModal';
import Loader from '@ui/components/LoaderComponent/Loader';
import Virus1 from '@img/personajes/virus-1.svg';
import Game1 from '@img/games/portada/game-1.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { SvgUri } from 'react-native-svg';

type Last3MonthHomeData = {
  label: string,
  value: number,
}

const HomeScreen = ({ navigation }) => {
  // Obtener la variable del usuario
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  // const [profilePicture, setProfilePicture] = useState<string>();

  const [gameInformation, setGameInformation] = useState(
    {
      'imageUrl': Game1,
      'id': 'juego1',
      'score': 0,
      'score_given_per_game': 20,
      'title': 'Dr. Simi Invide',
      'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha . Acumula puntos por cada Rosca de Reyes que logres cortar.',
      'gameUrl': 'https://simijuegos-game2.web.app/',
    }
  );

  useEffect(() => {
    if (user.id) {
      console.log('El UID del usuario es:', user.id);
      console.log('El nombre de usuario es:', user.personal_info.name);
    }
  }, [user.personal_info.name, user.id]);

  const [scoresLats3Months, setScoresLast3Months] = useState<Last3MonthHomeData[]>();

  useEffect(() => {
    console.log('user', user);
    if (!isAuthenticated) {
      // navigation.navigate('Login');
    }
  }, [isAuthenticated, navigation]);

  return (

    <ScrollView style={HomeStyles.containerScroll}>
      <View style={HomeStyles.container}>
        {/* Header Profile */}
        <View style={HomeStyles.containerHeaderProfile}>
          <View style={HomeStyles.containerInfo}>
            <Text style={HomeStyles.textSaludo}>¡Hola!</Text>
            <Text style={HomeStyles.textUsuario}>{user.personal_info.name.names || 'Usuario'}</Text>
          </View>
          <View style={HomeStyles.containerImage}>
            {
              user.profile_info.profile_picture_id &&
              (
                user.profile_info.profile_picture_id.includes('.png') ?
                  <Image
                    style={HomeStyles.PerfilImage}
                    resizeMode="contain"
                    source={{ uri: user.profile_info.profile_picture_id }}
                    width={70}
                  />
                  :
                  <View style={HomeStyles.containerImage} >
                    <SvgUri uri={user.profile_info.profile_picture_id} width={70} height={70} />
                  </View>
              )
            }
          </View>
        </View>

        {/* Juego Reciente */}

        <TouchableOpacity onPress={() => {
          navigation.navigate('Games', {
            screen: 'GameDetails',
            params: gameInformation,
          });
        }} >
          <View style={HomeStyles.recienteContainer}>
            {/* Left Column */}
            <View style={HomeStyles.columnLeft}>
              <Text style={HomeStyles.nuevoJuego}>Nuevo juego disponible</Text>
              <View style={HomeStyles.containerTitleGameNew}>
                <Virus1 />
                <Text style={HomeStyles.titleJuego}>
                  {gameInformation.title.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={HomeStyles.columnRight}>
              <Image
                source={require('@img/iconos/play.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Referidos */}

        <View style={HomeStyles.containerReferidos}>
          <View style={HomeStyles.containerTitleReferidos}>
            <Text style={HomeStyles.titleReferidos}>
              REFERIDOS
            </Text>
            <CompetitionModal />
            <Text style={HomeStyles.subtitleReferidos}>
              ¡Compite con tus amigos para lograr mayor puntaje!
            </Text>
            {/**
            <TouchableOpacity style={HomeStyles.botonInvitar}>
              <Image
                source={require('../../../img/personajes/doctor-simi-invade.png')}
              />
              <Text style={HomeStyles.textoBoton}>Invitar</Text>
            </TouchableOpacity>
            */}
          </View>
        </View>


      </View>

      {/* Points and games */}
      <View style={HomeStyles.containerGamesSection}>
        <View style={HomeStyles.containerTitleGames}>
          <Text style={HomeStyles.titleSectionGames}>
            ¡Esta es tu puntuacion de los ultimos 3 meses!
          </Text>
        </View>
        {
          scoresLats3Months && scoresLats3Months.map((score, index) => {
            if (score.label && score.value) {
              return (
                <View key={index} style={HomeStyles.containerScores}>
                  <View style={HomeStyles.scoresPerMonth}>
                    <Text style={HomeStyles.monthLabel}>{score.label}:</Text>
                    <Text style={HomeStyles.monthValue}>{score.value}</Text>
                  </View>
                </View>
              );
            } else {
              return null;
            }
          })
        }
        {/* Boton para los juegos */}
        <View style={HomeStyles.containerGameButton}>
          <Text style={HomeStyles.gameButton}>Visita todos los juegos aquí:</Text>
          <TouchableOpacity style={HomeStyles.playIconContainer} onPress={() => navigation.navigate('Games')} >
            <FontAwesomeIcon size={50} icon={faGamepad} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
