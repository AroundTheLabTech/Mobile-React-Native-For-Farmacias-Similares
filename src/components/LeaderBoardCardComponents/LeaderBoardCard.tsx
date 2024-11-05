import React from 'react';
import { View, Text, Image } from 'react-native';
import LeaderBoardCardStyles from './style/LeaderBoardCardStyles';


const LeaderBoardCard = ({ player }) => {
  return (
    <View style={LeaderBoardCardStyles.container} >
      <View style={LeaderBoardCardStyles.containerPosition} >
        <Text style={LeaderBoardCardStyles.position} >{player.position}</Text>
      </View>
      <View style={LeaderBoardCardStyles.containerInformation} >
        <View style={LeaderBoardCardStyles.containerProfileImages} >
          <Image
            src='https://via.placeholder.com/50'
            style={{ width: 50, height: 50, borderRadius: 100, top: 5 }}
          />
          <Image
            src='https://via.placeholder.com/20'
            style={{ width: 20, height: 20, borderRadius: 100, top: -10, right: -35 }}
          />
        </View>
        <View style={LeaderBoardCardStyles.containerSubInformation} >
          <Text style={LeaderBoardCardStyles.name} >{player.name}</Text>
          <Text style={LeaderBoardCardStyles.points} >{player.points} points</Text>
        </View>
      </View>
    </View>
  );
};

export default LeaderBoardCard;
