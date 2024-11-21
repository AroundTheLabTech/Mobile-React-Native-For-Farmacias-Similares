import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

// Styles
import HomeStyles from './style/HomeStyle';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth
import CompetitionModal from '../../components/CompetitionComponent/CompetitionModal';
import Loader from '@components/LoaderComponent/Loader';
import Virus1 from '@img/personajes/virus-1.svg';
import Game1 from '@img/games/portada/game-1.png';
import { getUserLast3MonthsInfo } from '@services/backend';
import { TUserLast3MonthInfo } from '../../types/user';
import { getMaxScorePerMonth, groupSessionsByMonth } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

type Last3MonthHomeData = {
  label: string,
  value: number,
}

const HomeScreen = ({ navigation }) => {
  // Obtener la variable del usuario
  const { uid, displayName } = useAuth();

  const gameInformation = {
    'imageUrl': Game1,
    'title': 'Dr. Simi Invide',
    'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha . Acumula puntos por cada Rosca de Reyes que logres cortar.',
    'gameUrl': 'https://simijuegos-game2.web.app/',
  };

  useEffect(() => {
    if (uid) {
      console.log('El UID del usuario es:', uid);
      console.log('El nombre de usuario es:', displayName);
    }
  }, [displayName, uid]);

  const [scoresLats3Months, setScoresLast3Months] = useState<Last3MonthHomeData[]>();

  useEffect(() => {
    async function fetchData() {
      const result: TUserLast3MonthInfo = await getUserLast3MonthsInfo(uid);
      const resultGroupByMonth = groupSessionsByMonth(result.sessions);
      const last3MonthsScores = getMaxScorePerMonth(resultGroupByMonth);
      const keys = Object.keys(last3MonthsScores);

      console.log(last3MonthsScores, keys);
      const month1 = keys[keys.length - 1];
      const month2 = keys[keys.length - 2];
      const month3 = keys[keys.length - 3];
      setScoresLast3Months([
        {
          label: month1,
          value: last3MonthsScores[month1],
        },
        {
          label: month2,
          value: last3MonthsScores[month2],
        },
        {
          label: month3,
          value: last3MonthsScores[month3],
        },
      ]);
    }

    fetchData();
  }, [uid]);

  if (!displayName) {
    return <Loader visible={true} />;
  }

  return (

    <ScrollView style={HomeStyles.containerScroll}>
      <View style={HomeStyles.container}>
        {/* Header Profile */}
        <View style={HomeStyles.containerHeaderProfile}>
          <View style={HomeStyles.containerInfo}>
            <Text style={HomeStyles.textSaludo}>¡Hola!</Text>
            <Text style={HomeStyles.textUsuario}>{displayName || 'Usuario'}</Text>
          </View>
          <View style={HomeStyles.containerImage}>
            <Image
              style={HomeStyles.PerfilImage}
              resizeMode="contain"
              source={require('../../../img/profile/profilePicture.png')}

            />
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
                source={require('../../../img/iconos/play.png')}
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
