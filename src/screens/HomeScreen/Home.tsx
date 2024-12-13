import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

// Styles
import HomeStyles from './style/HomeStyle';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth
import { useUser } from '../../services/UserContext';
import CompetitionModal from '../../components/CompetitionComponent/CompetitionModal';
import Loader from '@components/LoaderComponent/Loader';
import Virus1 from '@img/personajes/virus-1.svg';
import Game1 from '@img/games/portada/game-1.png';
import { getMaxScorePerMonth, groupSessionsByMonth } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { SvgUri } from 'react-native-svg';

type Last3MonthHomeData = {
  label: string,
  value: number,
}

const HomeScreen = ({ navigation }) => {
  // Obtener la variable del usuario
  const { uid } = useAuth();
  const {
    profilePicture,
    setUpdateProfilePicture,
    last3MonthsScores,
    updateLast3MonthsScores,
    setUpdateLast3MonthsScores,
    scorePerGame,
    setUpdateScorePerGame,
    userInformation,
    setUpdateUserInformation,
  } = useUser();
  // const [profilePicture, setProfilePicture] = useState<string>();

  const [gameInformation, setGameInformation] = useState(
    {
      'imageUrl': Game1 ? Game1 : 'https://icon-library.com/images/xbox-controller-icon/xbox-controller-icon-26.jpg',
      'id': 'juego1',
      'score': 0,
      'score_given_per_game': 20,
      'title': 'Dr. Simi Invide',
      'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha . Acumula puntos por cada Rosca de Reyes que logres cortar.',
      'gameUrl': 'https://simijuegos-game2.web.app/',
    }
  );

  useEffect(() => {
    async function fetchData() {

      if (scorePerGame && scorePerGame?.score_per_game[gameInformation.id]) {
        const score = scorePerGame.score_per_game[gameInformation.id];
        gameInformation.score = score;

        setGameInformation(gameInformation);
      }
    }

    if (!gameInformation.score || gameInformation.score <= 0) {
      fetchData();
    }

    if (!scorePerGame) {
      fetchData();
      setUpdateScorePerGame(true);
    } else {
      setUpdateScorePerGame(false);
    }

    fetchData();

  }, [gameInformation, scorePerGame, setUpdateScorePerGame, uid]);

  useEffect(() => {
    if (uid) {
      console.log('El UID del usuario es:', uid);
    }
  }, [uid]);

  const [scoresLats3Months, setScoresLast3Months] = useState<Last3MonthHomeData[]>();

  useEffect(() => {
    function fetchData() {
      if (last3MonthsScores && last3MonthsScores?.sessions) {
        const resultGroupByMonth = groupSessionsByMonth(last3MonthsScores.sessions);
        const lastThreeMonthsScores = getMaxScorePerMonth(resultGroupByMonth);
        const keys = Object.keys(lastThreeMonthsScores);

        const month1 = keys[keys.length - 1];
        const month2 = keys[keys.length - 2];
        const month3 = keys[keys.length - 3];

        let month1Value = 0;
        if (resultGroupByMonth[month1] && resultGroupByMonth[month1].length > 0) {
          resultGroupByMonth[month1].forEach(element => {
            month1Value += element;
          });
        }

        let month2Value = 0;
        if (resultGroupByMonth[month2] && resultGroupByMonth[month2].length > 0) {
          resultGroupByMonth[month2].forEach(element => {
            month2Value += element;
          });
        }

        let month3Value = 0;
        if (resultGroupByMonth[month3] && resultGroupByMonth[month3].length > 0) {
          resultGroupByMonth[month3].forEach(element => {
            month3Value += element;
          });
        }

        setScoresLast3Months([
          {
            label: month1,
            value: month1Value,
          },
          {
            label: month2,
            value: month2Value,
          },
          {
            label: month3,
            value: month3Value,
          },
        ]);
      }
    }

    if ((!last3MonthsScores || !scoresLats3Months) || updateLast3MonthsScores) {
      setUpdateLast3MonthsScores(true);
      fetchData();
    } else {
      setUpdateLast3MonthsScores(false);
    }

    //fetchData();
  }, [last3MonthsScores, scoresLats3Months, setUpdateLast3MonthsScores, uid, updateLast3MonthsScores]);

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

  useEffect(() => {
    function fetchData() {
      if (!userInformation) {
        setUpdateUserInformation(true);
      } else {
        setUpdateUserInformation(false);
      }
    }

    fetchData();
  }, [userInformation, setUpdateUserInformation, uid]);

  if ((!userInformation && !userInformation?.name) || (scoresLats3Months && scoresLats3Months.length < 3)) {
    return <Loader visible={true} />;
  }

  return (

    <ScrollView style={HomeStyles.containerScroll}>
      <View style={HomeStyles.container}>
        {/* Header Profile */}
        <View style={HomeStyles.containerHeaderProfile}>
          <View style={HomeStyles.containerInfo}>
            <Text style={HomeStyles.textSaludo}>¡Hola!</Text>
            <Text style={HomeStyles.textUsuario}>{userInformation.name || 'Usuario'}</Text>
          </View>
          <View style={HomeStyles.containerImage}>
            {
              profilePicture &&
              (
                profilePicture.includes('.png') ?
                  <Image
                    style={HomeStyles.PerfilImage}
                    resizeMode="contain"
                    source={{ uri: profilePicture }}
                    width={70}
                  />
                  :
                  <View style={HomeStyles.containerImage} >
                    <SvgUri uri={profilePicture} width={70} height={70} />
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
                source={require('../../../img/iconos/play.png')}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Referidos */}

        <View style={HomeStyles.containerReferidos}>
          <View style={HomeStyles.containerTitleReferidos}>
            {/*
            <Text style={HomeStyles.titleReferidos}>
              REFERIDOS
            </Text>
            */}
            <CompetitionModal navigation={navigation} />
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
