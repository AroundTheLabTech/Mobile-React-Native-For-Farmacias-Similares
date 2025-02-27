import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Dimensions, PixelRatio } from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GamesStyles from './style/GamesStyles';
import Game1 from '../../../img/games/portada/game-1.png';
import Game2 from '../../../img/games/portada/game-2.png';
import Game3 from '../../../img/games/portada/game-3.png';
import Game4 from '../../../img/games/portada/game-4.png';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { calculateScreenSizeInInches } from '../../utils/helpers';

const Games = ({ navigation, route }) => {

  const { uid } = useAuth();
  const { scorePerGame, setUpdateScorePerGame } = useUser();

  const { params } = route;

  const [listGames, setListGames] = useState(null);

  useEffect(() => {
    if (params) {
      console.log('Parámetros recibidos:', params);
    } else {
      console.log('No se recibieron parámetros');
    }
  }, [params]);

  useEffect(() => {
    async function fetchData() {

      const allGames = [
        {
          'imageUrl': Game1,
          'id': 'juego1',
          'title': 'Dr. Simi Invide',
          'score_given_per_game': 20,
          'description': '¡Defiende el Centro a toda costa! Acumula puntos para mejorar tu ataque, defensa y velocidad. Cada ola de bacterias será más desafiante, ¡prepárate para detenerlas a todas! ¿Tienes lo necesario para proteger a los pacientes y salvar el día? ¡Descúbrelo ahora!',
          'gameUrl': 'https://simijuegos-game2.web.app/',
        },
        {
          'imageUrl': Game2,
          'id': 'juego2',
          'title': 'Simi Run',
          'score_given_per_game': 30,
          'description': '¡Ayuda a Simi a recolectar todas las monedas y a evitar los obstáculos! ¡Diviértete en este emocionante juego de plataformas y demuestra tus habilidades! ¡Juega ahora y desbloquea nuevos niveles!',
          'gameUrl': 'https://simijuegos.com.mx/source-game/game-2/public/index.html',
        },
        {
          'imageUrl': Game3,
          'id': 'juego3',
          'title': 'Simi Smash',
          'score_given_per_game': 10,
          'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha del simi. Acumula puntos por cada Rosca de Reyes que logres cortar. ¿Sabías que tenemos el Record a la Rosca de Reyes más grande del mundo?',
          'gameUrl': 'https://simijuegos.com.mx/source-game/game-3/release/index.html',
        },
        {
          'imageUrl': Game4,
          'id': 'juego4',
          'title': 'Simi Life',
          'score_given_per_game': 10,
          'description': '¡Pilota el avión del SimiFest y lanza Bombas de Vida! Estas bolas de tierra están repletas de semillas listas para transformar el mundo. ¡Conviértete en un héroe ecológico y haz florecer la vida a tu paso!',
          'gameUrl': 'https://simijuegos.com.mx/source-game/game-4/index.html',
        },
        {
          'imageUrl': Game4,
          'id': 'juego5',
          'title': 'Globito Survivor',
          'score_given_per_game': 10,
          'description': 'Usa la tecla para moverte por el cielo y esquivar cada peligro. Inspirado en el día del amor y la amistad, ¡pon a prueba tus reflejos y mantén tu globo intacto!',
          'gameUrl': 'https://simijuegos-webapp.vercel.app/source-game/game-5/index.html',
        },
      ];

      const games = allGames.map(game => {
        return {
          ...game,
          'score': scorePerGame.score_per_game[game.id],
        };
      });

      setListGames(games);
    }

    if (!scorePerGame) {
      setUpdateScorePerGame(true);
      fetchData();
    } else {
      setUpdateScorePerGame(false);
    }

    fetchData();
  }, [scorePerGame, setUpdateScorePerGame, uid]);

  const sizeInInches = calculateScreenSizeInInches(Dimensions, PixelRatio);

  return (
    <ScrollView style={GamesStyles.container} contentContainerStyle={GamesStyles.containerMax} >
      <TouchableOpacity style={GamesStyles.containerGoBack} onPress={() => navigation.goBack()} >
        <FontAwesomeIcon icon={faArrowLeft} color="white" />
      </TouchableOpacity>
      <View style={GamesStyles.containerGames} >
        {listGames && listGames.map((game, index) => {
          if (sizeInInches && Number(sizeInInches) > 9) {
            return (
              <TouchableOpacity key={index} style={GamesStyles.gameCard9Inche} onPress={() => navigation.navigate('GameDetails', game)} >
                <Image style={GamesStyles.coverImage9Inches} source={game.imageUrl} />
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity key={index} style={GamesStyles.gameCard} onPress={() => navigation.navigate('GameDetails', game)} >
              <Image style={GamesStyles.coverImage} source={game.imageUrl} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Games;
