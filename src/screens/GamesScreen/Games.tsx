import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GamesStyles from './style/GamesStyles';
import Game1 from '../../../img/games/portada/game-1.png';
import Game2 from '../../../img/games/portada/game-2.png';

const Games = ({ navigation }) => {

  const listGames = [
    {
      'imageUrl': Game1,
      'title': 'Dr. Simi Invide',
      'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha . Acumula puntos por cada Rosca de Reyes que logres cortar.',
      'gameUrl': 'https://simijuegos-game2.web.app/',
    },
    {
      'imageUrl': Game2,
      'title': 'Dr. Simi Run',
      'description': '¡No dejes caer ninguna Rosca de Reyes! Corta todos los objetos y evita encender la mecha . Acumula puntos por cada Rosca de Reyes que logres cortar.',
      'gameUrl': null,
    },
  ];

  return (
    <ScrollView style={GamesStyles.container} contentContainerStyle={GamesStyles.containerMax} >
      <TouchableOpacity style={GamesStyles.containerGoBack} onPress={() => navigation.goBack()} >
        <FontAwesomeIcon icon={faArrowLeft} color='white' />
      </TouchableOpacity>
      <View style={GamesStyles.containerGames} >
        {listGames && listGames.map((game, index) => {
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
