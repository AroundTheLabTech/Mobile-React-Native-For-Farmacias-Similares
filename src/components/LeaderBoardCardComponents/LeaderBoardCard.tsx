import React from 'react';
import { View, Text, Image, Animated } from 'react-native';
import LeaderBoardCardStyles from './style/LeaderBoardCardStyles';
import { TLeaderBoard } from 'src/types/user';
import { getAvatarSource } from '../../utils/avatars';
import { useFadeInUp } from '../../utils/animations';

interface LeaderBoardCardProps {
  player: TLeaderBoard;
  isCurrentUser?: boolean;
  index?: number;
}

const MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];

const LeaderBoardCard: React.FC<LeaderBoardCardProps> = ({ player, isCurrentUser, index = 0 }) => {
  const anim = useFadeInUp(index * 60);
  return (
    <Animated.View style={[LeaderBoardCardStyles.container, isCurrentUser && LeaderBoardCardStyles.currentUserContainer, { opacity: anim.opacity, transform: anim.transform }]}>
      <View style={LeaderBoardCardStyles.containerPosition}>
        {player.position <= 3 ? (
          <Text style={LeaderBoardCardStyles.medal}>{MEDALS[player.position - 1]}</Text>
        ) : (
          <Text style={LeaderBoardCardStyles.position}>{player.position}</Text>
        )}
      </View>
      <View style={LeaderBoardCardStyles.avatarWrapper}>
        <Image
          source={getAvatarSource(player.profile_mini_pictures_url)}
          style={LeaderBoardCardStyles.profilePicture}
          resizeMode="cover"
        />
        {player.flag_url ? (
          <Image
            source={{ uri: player.flag_url }}
            style={LeaderBoardCardStyles.flagPicture}
          />
        ) : null}
      </View>
      <Text
        style={[LeaderBoardCardStyles.name, isCurrentUser && LeaderBoardCardStyles.nameHighlight]}
        numberOfLines={1}
      >
        {player?.username ? player?.username : 'Usuario'}
        {isCurrentUser ? ' (Tu)' : ''}
      </Text>
      <Text style={[LeaderBoardCardStyles.points, isCurrentUser && LeaderBoardCardStyles.pointsHighlight]}>
        {(player.total_score || 0).toLocaleString()} pts
      </Text>
    </Animated.View>
  );
};

export default LeaderBoardCard;
