import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Dimensions, PixelRatio } from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GamesStyles from './style/GamesStyles';
import Game1 from '../../../img/games/portada/game-1.png';
import Game2 from '../../../img/games/portada/game-2.png';
import Game3 from '../../../img/games/portada/game-3.png';
import Game4 from '../../../img/games/portada/game-4.png';
import Game5 from '../../../img/games/portada/game-5.png';
import Game6 from '../../../img/games/portada/game-6.png';
import Game7 from '../../../img/games/portada/game-7.png';
import Game8 from '../../../img/games/portada/game-8.png';
import Game9 from '../../../img/games/portada/game-9.png';
import Game10 from '../../../img/games/portada/game-10.png';
import Game11 from '../../../img/games/portada/game-11.png';
import Game12 from '../../../img/games/portada/game-12.png';
import Game13 from '../../../img/games/portada/game-13.png';
import Game14 from '../../../img/games/portada/game-14.png';
import Game15 from '../../../img/games/portada/game-15.png';
import Game16 from '../../../img/games/portada/game-16.png';
import Game17 from '../../../img/games/portada/game-17.png';
import Game18 from '../../../img/games/portada/game-18.png';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { calculateScreenSizeInInches } from '../../utils/helpers';

type GameId =
  | 'juego1' | 'juego2' | 'juego3' | 'juego4' | 'juego5' | 'juego6'
  | 'juego7' | 'juego8' | 'juego9' | 'juego10' | 'juego11' | 'juego12'
  | 'juego13' | 'juego14' | 'juego15' | 'juego16' | 'juego17' | 'juego18';

type Game = {
  id: GameId;
  title: string;
  imageUrl: any;
  gameUrl: string;
  score_given_per_game: number;
  description: string;
  score?: number;
};

const Games = ({ navigation }) => {

  const { uid } = useAuth();
  const { scorePerGame, setUpdateScorePerGame } = useUser();

  const [listGames, setListGames] = useState(null);

  function orderGames(allGames: Game[]): Game[] {
    const forcedGames: GameId[] = ['juego7', 'juego9'];

    // 1) Orden base por id descendente, considerando números (juego10 > juego2)
    const ordered = [...allGames].sort((a, b) =>
      b.id.localeCompare(a.id, undefined, { numeric: true })
    );

    // 2) Forzar juego7 y juego9 a posiciones 4 y 5 (0-based)
    forcedGames.forEach((gameKey, i) => {
      const idx = ordered.findIndex(g => g.id === gameKey);
      if (idx !== -1) {
        const [item] = ordered.splice(idx, 1);
        ordered.splice(4 + i, 0, item);
      }
    });

    return ordered;
  }

  useEffect(() => {
    async function fetchData() {

      const allGames: Game[] = [
        {
          imageUrl: Game1,
          id: 'juego1',
          title: 'Doctor Simi Invade',
          score_given_per_game: 20,
          description:
            '¡Defiende el Centro como un pro! Mejora ataque, defensa y velocidad mientras enfrentas olas brutales. ¿Listo para salvarlo?',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-1/public-game/index.html',
        },
        {
          imageUrl: Game2,
          id: 'juego2',
          title: 'Doctor Simi Run',
          score_given_per_game: 30,
          description:
            '¡Acompaña a Simi, recolecta monedas, esquiva obstáculos y desbloquea niveles! Demuestra tus habilidades en este épico desafío.',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-2/public/index.html',
        },
        {
          imageUrl: Game3,
          id: 'juego3',
          title: 'Simi Slash',
          score_given_per_game: 10,
          description:
            '¡No dejes caer ni un implemento médico! Corta todo, evita la mecha del Simi y rompe récords con cada jugada épica.',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-3/release/index.html',
        },
        {
          imageUrl: Game4,
          id: 'juego4',
          title: 'Simi Life',
          score_given_per_game: 10,
          description:
            '¡Pilota el avión del SimiFest, lanza Bombas de Vida y siembra esperanza! Conviértete en un héroe ecológico ahora.',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-4/index.html',
        },
        {
          imageUrl: Game5,
          id: 'juego5',
          title: 'Simi Globo',
          score_given_per_game: 10,
          description:
            'Usa el joystick en pantalla para moverte por el cielo y esquivar cada peligro. ¡Pon a prueba tus reflejos y mantén tu globo intacto!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-5/index.html',
        },
        {
          imageUrl: Game6,
          id: 'juego6',
          title: 'Tower Defense',
          score_given_per_game: 10,
          description:
            'Usa el clic o el tap y coloca defensas estratégicas para proteger el hospital de invasores virales. ¡Construye y mejora torres médicas para salvar a los enfermos!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-6/index.html',
        },
        {
          imageUrl: Game7,
          id: 'juego7',
          title: 'Simi Gomitas',
          score_given_per_game: 10,
          description:
            'Usa el clic o el tap y desliza para conectar tres o más gomas y crear combinaciones explosivas. ¡Completa la meta con el menor número de movimientos!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-7/index.html',
        },
        {
          imageUrl: Game8,
          id: 'juego8',
          title: 'Simi Health Blocks',
          score_given_per_game: 10,
          description:
            'Puzzle clásico: ordena las fichas de medicamentos que caen. Acomódalas estratégicamente para completar filas y mantener la farmacia en orden.',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-8/index.html',
        },
        {
          imageUrl: Game9,
          id: 'juego9',
          title: 'Simirama',
          score_given_per_game: 10,
          description:
            'Usa el clic o el tap para girar las cartas y encontrar su pareja. ¡Pon a prueba tu memoria y completa todos los pares!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-9/index.html',
        },
        {
          imageUrl: Game10,
          id: 'juego10',
          title: 'SimiShip',
          score_given_per_game: 10,
          description:
            'Usa los botones en pantalla o el teclado para moverte y saltar. Recoge monedas, evita caer al vacío y lleva al Simi al planeta saltando entre satélites.',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-10/index.html',
        },
        {
          imageUrl: Game11,
          id: 'juego11',
          title: 'SimiPlaneta',
          score_given_per_game: 10,
          description:
            '¡Atrapa erizos y evita los peces! Muévete con flechas o controles en pantalla. ¡No dejes que los peces te toquen o perderás vidas!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-11/index.html',
        },
        {
          imageUrl: Game12,
          id: 'juego12',
          title: 'Simi Brigada Verde',
          score_given_per_game: 10,
          description:
            'Mueve al Simi y apaga las llamas con la manguera. ¡Salva a los animales y recolecta las semillas que dejan al ser rescatados!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-12/index.html',
        },
        {
          imageUrl: Game13,
          id: 'juego13',
          title: 'Simi Desastres Naturales',
          score_given_per_game: 10,
          description:
            'Mueve al Simi para esquivar desastres naturales y recoge suministros. ¡Gana puntos por cada suministro y sobrevive lo más posible!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-13/index.html',
        },
        {
          imageUrl: Game14,
          id: 'juego14',
          title: 'Simi Cross',
          score_given_per_game: 10,
          description:
            'Esquiva los autos y recoge monedas mientras avanzas. ¡Suma puntos por el progreso en el recorrido y sobrevive!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-14/index.html',
        },
        {
          imageUrl: Game15,
          id: 'juego15',
          title: 'Simi Jump',
          score_given_per_game: 10,
          description:
            'Muévete para sortear obstáculos y recoger orbes. ¡Anota por cada orbe y evita los choques!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-15/index.html',
        },
        {
          imageUrl: Game16,
          id: 'juego16',
          title: 'Simi Flyv',
          score_given_per_game: 10,
          description:
            'Toca o haz clic para mover al Simi y esquivar obstáculos. ¡Suma puntos por cada obstáculo superado!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-16/index.html',
        },
        {
          imageUrl: Game17,
          id: 'juego17',
          title: 'Simi Comando Lunar',
          score_given_per_game: 10,
          description:
            'Toca o haz clic para moverte, esquivar y destruir obstáculos. ¡Gana puntos por cada objetivo destruido!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-17/index.html',
        },
        {
          imageUrl: Game18,
          id: 'juego18',
          title: 'Simi Pet',
          score_given_per_game: 10,
          description:
            'Muévete por el mapa, entra a los servicios y completa desafíos. ¡Gana puntos por cada servicio completado!',
          gameUrl: 'https://simijuegos.com.mx/source-game/game-18/index.html',
        },
      ];

      const gamesWithScore  = allGames.map(game => {
        return {
          ...game,
          'score': scorePerGame.score_per_game[game.id],
        };
      });

      const ordered = orderGames(gamesWithScore);
      setListGames(ordered);
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
