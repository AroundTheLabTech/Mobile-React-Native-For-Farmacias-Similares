import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, StatusBar, ActivityIndicator } from 'react-native';
import { faArrowLeft, faMobileScreenButton, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import GameDetailsStyles from './style/GameDetailsStyles';
import { useUser } from '@services/UserContext';
import { darkTheme } from '../../theme/colors';


const GameDetails = ({ navigation, route }) => {

  const { title, description, imageUrl, score, score_given_per_game, id } = route.params;

  const { scorePerGame, setUpdateScorePerGame } = useUser();

  const [scoreLoading, setScoreLoading] = useState(true);
  const comingFromGameRef = React.useRef(false);

  // [OPCIÓN 2: ACTUALIZACIÓN OPTIMISTA]
  // Si está cargando y regresamos del juego con un puntaje temporal (optimisticScore)
  const showOptimisticScore = scoreLoading && typeof route.params?.optimisticScore !== 'undefined';
  const gameScore = showOptimisticScore
    ? route.params.optimisticScore
    : (scorePerGame?.score_per_game && typeof scorePerGame.score_per_game[id] !== 'undefined')
      ? scorePerGame.score_per_game[id]
      : score;
  // [FIN OPCIÓN 2]

  /*
  // Comportamiento original sin actualización optimista (solo muestra spinner mientras carga del server):
  const gameScore = (scorePerGame?.score_per_game && typeof scorePerGame.score_per_game[id] !== 'undefined')
    ? scorePerGame.score_per_game[id]
    : score;
  */

  useFocusEffect(
    React.useCallback(() => {
      if (comingFromGameRef.current) {
        if (__DEV__) console.log(`[DEBUG GameDetails] useFocusEffect (returning from game) -> id=${id}, score=${score}`);
        setScoreLoading(true);
        // Delay de 600ms para darle tiempo al servidor de procesar
        // el score agregado antes de hacer el fetch
        const delay = setTimeout(() => {
          setUpdateScorePerGame(true);
        }, 600);
        comingFromGameRef.current = false;
        return () => clearTimeout(delay);
      } else {
        // Al entrar por primera vez desde la lista, usamos el score inicial de params
        setScoreLoading(false);
      }
    }, [id, score, setUpdateScorePerGame])
  );

  useEffect(() => {
    if (scorePerGame?.score_per_game) {
      const serverScore = scorePerGame.score_per_game[id];
      const optimistic = route.params?.optimisticScore;
      // [OPCIÓN 2: VALIDACIÓN Y RETRY OPTIMISTA]
      if (typeof optimistic !== 'undefined' && typeof serverScore !== 'undefined') {
        if (serverScore >= optimistic) {
          setScoreLoading(false);
        } else {
          if (__DEV__) console.log(`[DEBUG GameDetails] Servidor retornó score viejo (${serverScore} < optimista ${optimistic}). Reintentando fetch...`);
          const retry = setTimeout(() => {
            setUpdateScorePerGame(true);
          }, 1500);
          return () => clearTimeout(retry);
        }
      } else {
        setScoreLoading(false);
      }
      // [FIN OPCIÓN 2]

      /*
      // Comportamiento original sin reintento:
      setScoreLoading(false);
      */
    }
  }, [scorePerGame, id, route.params?.optimisticScore, setUpdateScorePerGame]);

  // Juegos que se juegan en vertical (portrait)
  const VERTICAL_GAMES = ['juego13', 'juego14', 'juego16'];
  const isVertical = VERTICAL_GAMES.includes(id);

  const handleGoToGame = () => {
    if (__DEV__) console.log(`[DEBUG GameDetails] handleGoToGame -> id=${id}, isVertical=${isVertical}, score=${gameScore}`);
    comingFromGameRef.current = true;
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
                {scoreLoading && !showOptimisticScore ? (
                  <ActivityIndicator size="small" color="#06B6D4" style={{ marginTop: 4 }} />
                ) : (
                  <Text style={[GameDetailsStyles.statPillValue, { color: '#06B6D4' }]}>
                    {Math.round(gameScore || 0)}
                  </Text>
                )}
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

            {/* 
              DEBUG — Botón para recargar el score manualmente
              (Comenta/borra este bloque para quitarlo)
            */}
            {/* {__DEV__ && (
              <TouchableOpacity
                onPress={() => { setScoreLoading(true); setUpdateScorePerGame(true); }}
                style={{ marginTop: 8, padding: 8, backgroundColor: 'rgba(255,255,0,0.15)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,0,0.4)', alignItems: 'center' }}
              >
                <Text style={{ color: '#FFD700', fontSize: 11, fontWeight: '700' }}>🔄 DEBUG: Recargar puntaje</Text>
              </TouchableOpacity>
            )} */}
            {/* FIN DEBUG */}

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
