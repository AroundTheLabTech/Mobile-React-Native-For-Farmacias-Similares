import React from 'react';
import { View, Text, Image } from 'react-native';
import LeaderBoardCardStyles from './style/LeaderBoardCardStyles';
import { TLeaderBoard } from 'src/types/user';

interface LeaderBoardCardProps {
  player: TLeaderBoard
}

const LeaderBoardCard: React.FC<LeaderBoardCardProps> = ({ player }) => {
  return (
    <View style={LeaderBoardCardStyles.container} >
      <View style={LeaderBoardCardStyles.containerPosition} >
        <Text style={LeaderBoardCardStyles.position} >{player.position}</Text>
      </View>
      <View style={LeaderBoardCardStyles.containerInformation} >
        <View style={LeaderBoardCardStyles.containerProfileImages} >
          <Image
            source={{ uri: player.profile_mini_pictures_url }}
            style={LeaderBoardCardStyles.profilePicture}
          />
          <Image
            src={player.flag_url}
            width={20}
            height={20}
            style={LeaderBoardCardStyles.flagPicture}
          />
        </View>
        <View style={LeaderBoardCardStyles.containerSubInformation} >
          <Text style={LeaderBoardCardStyles.name} >{player.username}</Text>
          <Text style={LeaderBoardCardStyles.points} >{player.total_score} points</Text>
        </View>
      </View>
    </View>
  );
};

export default LeaderBoardCard;
