import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, StatusBar } from 'react-native';
import { faArrowLeft, faMobileScreenButton, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Orientation from 'react-native-orientation-locker';
import GameDetailsStyles from './style/GameDetailsStyles';
import { useUser } from '@services/UserContext';
import { darkTheme } from '../../theme/colors';
import GameDetailsSkeleton from '@components/Skeleton/GameDetailsSkeleton';


const GameDetails = ({ navigation, route }) => {

  const { title, description, imageUrl, score, score_given_per_game, id } = route.params;

  const { scorePerGame } = useUser();

  const [gameScore, setGameScore] = useState(score);
  const [scoreLoading, setScoreLoading] = useState(!scorePerGame);

  useEffect(() => {
    if (scorePerGame?.score_per_game) {
      const newScore = scorePerGame.score_per_game[id];
      setGameScore(newScore);
      setScoreLoading(false);
    }
  }, [id, scorePerGame]);


  if (scoreLoading) {
    return <GameDetailsSkeleton />;
  }

  // Juegos que se juegan en vertical (portrait)
  const VERTICAL_GAMES = ['juego13', 'juego14', 'juego16'];
  const isVertical = VERTICAL_GAMES.includes(id);

  const handleGoToGame = () => {
    if (__DEV__) console.log(`[DEBUG GameDetails] handleGoToGame -> id=${id}, isVertical=${isVertical}, score=${gameScore}`);
    route.params.score = gameScore;
    navigation.navigate('GameIframe', route.params);
  };

  return (
    <View style={GameDetailsStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
      <View style={GameDetailsStyles.glowPurple} />
      <View style={GameDetailsStyles.glowCyan} />
      <ScrollView contentContainerStyle={GameDetailsStyles.scrollContent}>
        <View style={GameDetailsStyles.header}>
          <TouchableOpacity style={GameDetailsStyles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} color={darkTheme.textPrimary} size={18} />
          </TouchableOpacity>
        </View>
        <View style={GameDetailsStyles.containerGameDetails}>
          <View style={GameDetailsStyles.containerCoverImage}>
            <Image style={GameDetailsStyles.coverImage} source={imageUrl} />
          </View>
          <View style={GameDetailsStyles.containerGameInformation}>
            <Text style={GameDetailsStyles.gameTile}>{title}</Text>
            <View style={GameDetailsStyles.statPillsRow}>
              <View style={GameDetailsStyles.statPill}>
                <Text style={GameDetailsStyles.statPillLabel}>Tu puntaje</Text>
                <Text style={[GameDetailsStyles.statPillValue, { color: '#06B6D4' }]}>{Math.round(gameScore || 0)}</Text>
              </View>
              <View style={GameDetailsStyles.statPill}>
                <Text style={GameDetailsStyles.statPillLabel}>Puntos por ronda</Text>
                <Text style={[GameDetailsStyles.statPillValue, { color: '#FFD700' }]}>+{score_given_per_game}</Text>
              </View>
            </View>
            <Text style={GameDetailsStyles.gameDescription}>{description}</Text>
            <TouchableOpacity style={GameDetailsStyles.playGameButton} onPress={() => handleGoToGame()}>
              <Text style={GameDetailsStyles.playGameButtonText}>Jugar</Text>
            </TouchableOpacity>

            {/* Rotation hint */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
            }}>
              <FontAwesomeIcon
                icon={isVertical ? faMobileScreenButton : faRotate}
                size={16}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '500' }}>
                {isVertical ? 'Se juega en vertical' : 'Gira tu telefono para jugar'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GameDetails;
