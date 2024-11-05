import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faChartBar, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../../global-class';
import LeaderBoardStyles from './style/LeaderBoardStyles';
import PodiumChart from '../../components/PodiumChartComponent/PodiumChart';
import LeaderBoardCard from '../../components/LeaderBoardCardComponents/LeaderBoardCard';
import DraggableMenu from '../../components/DraggableMenuComponent/DraggableMenu';
import Svg, { Path } from 'react-native-svg';

interface Player {
  name: string;
  position: number;
  points: number;
  countryFlax: string;
  pictureProfile: any; // Cambia a string o ImageSourcePropType según sea necesario
}

const LeaderBoard: React.FC = () => {
  const players: Player[] = [
    {
      name: 'Madekyb Días',
      position: 4,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 5,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 6,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 7,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 8,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 9,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 10,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 11,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 12,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 13,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 14,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 15,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 16,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 17,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 18,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 19,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 20,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 21,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 22,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 23,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 24,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
    {
      name: 'Madekyb Días',
      position: 25,
      points: 590,
      countryFlax: 'https://www.worldometers.info/img/flags/ar-flag.gif',
      pictureProfile: require('../../../img/profile/victorGonzales.png')
    },
  ];

  return (
    <ScrollView style={LeaderBoardStyles.containerScroll}>
      {/* Header */}
      <View style={LeaderBoardStyles.containerTitle}>
        <Text style={LeaderBoardStyles.title}>Leaderboard</Text>
        <View style={LeaderBoardStyles.containerLeaderrboardTime}>
          <Text style={LeaderBoardStyles.timeOption}>MENSUAL</Text>
        </View>
      </View>
      <View style={LeaderBoardStyles.containerPosition}>
        <Text style={LeaderBoardStyles.positionNumber}>#4</Text>
        <Text style={LeaderBoardStyles.positionDescription}>Tu estas entre los 30% de mejores jugadores</Text>
      </View>

      <PodiumChart />

      <DraggableMenu>
        <View>
          {players.map((player, index) => (
            <LeaderBoardCard key={index} player={player} />
          ))}
        </View>
      </DraggableMenu>
    </ScrollView>
  );
};

export default LeaderBoard;
