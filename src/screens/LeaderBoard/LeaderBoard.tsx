import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, Dimensions, PixelRatio, TouchableOpacity, StatusBar, Animated } from 'react-native';
import LeaderBoardStyles from './style/LeaderBoardStyles';
import LeaderBoardCard from '@components/LeaderBoardCardComponents/LeaderBoardCard';
import PodiumSvg from '@components/PodiumChartComponent/PodiumSvg';
import { getTopTwentyMonthly } from '@services/backend';
import { TLeaderBoard } from 'src/types/user';
import { calculatePercent, calculateScreenSizeInInches, splitTopTwenty } from '../../utils/helpers';
import Loader from '@components/LoaderComponent/Loader';
import { useAuth } from '../../AuthContext';
import PodiumSvg9Inches from '@components/PodiumChartComponent/PodiumSvg9Inches';
import { darkTheme } from '../../theme/colors';
import { useFadeInUp } from '../../utils/animations';

const LeaderBoard: React.FC = () => {
  const { uid } = useAuth();

  const [orientation, setOrientation] = useState('portrait');
  const [topThree, setTopThree] = useState<TLeaderBoard[]>();
  const [topTwenty, setTopTwenty] = useState<TLeaderBoard[]>();
  const [userPosition, setUserPosition] = useState<TLeaderBoard>();
  const [userPercent, setUserPercent] = useState<number>();
  const [viewMode, setViewMode] = useState<'monthly' | 'general'>('monthly');
  const [loading, setLoading] = useState(true);
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTopTwentyMonthly({
        monthly: viewMode === 'monthly',
        timeoutMs: 10_000,
      });

      if (response && response.length > 0) {
        const tops = splitTopTwenty(response);

        setTopThree(tops.topThree);
        setTopTwenty(tops.topRest);

        const filterUserTop = tops.all.filter((player) => player.uid === uid);

        if (filterUserTop.length > 0) {
          const userTopPercent = calculatePercent(filterUserTop[0].position, 0, tops.all.length);
          setUserPercent(Math.ceil(userTopPercent));
          setUserPosition(filterUserTop[0]);
        } else {
          setUserPercent(0);
          setUserPosition(undefined);
        }
      } else {
        setTopThree([]);
        setTopTwenty([]);
        setUserPercent(0);
        setUserPosition(undefined);
      }
    } catch {
      setTopThree([]);
      setTopTwenty([]);
      setUserPercent(0);
      setUserPosition(undefined);
    } finally {
      setLoading(false);
    }
  }, [viewMode, uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Trigger animations after data loads
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setAnimReady(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const headerAnim = useFadeInUp(0, animReady);
  const podiumAnim = useFadeInUp(150, animReady);
  const listAnim = useFadeInUp(300, animReady);

  if (loading) {
    return (
      <View style={[LeaderBoardStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
        <Loader visible />
      </View>
    );
  }

  const sizeInInches = calculateScreenSizeInInches(Dimensions, PixelRatio);

  const renderPlayersList = () => {
    if (!topTwenty || topTwenty.length === 0) {
      return (
        <View style={LeaderBoardStyles.emptyState}>
          <Text style={LeaderBoardStyles.emptyStateText}>No hay datos de clasificación disponibles</Text>
        </View>
      );
    }

    return topTwenty.map((player: TLeaderBoard, idx: number) => (
      <LeaderBoardCard key={player.uid} player={player} isCurrentUser={player.uid === uid} index={idx} />
    ));
  };

  return (
    <View style={LeaderBoardStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
      <View style={LeaderBoardStyles.glowPurple} />
      <View style={LeaderBoardStyles.glowCyan} />
      <ScrollView style={LeaderBoardStyles.containerScroll}>
        <View style={orientation === 'landscape' ? LeaderBoardStyles.containerFull : null}>
          <View style={orientation === 'landscape' ? LeaderBoardStyles.userLeaderboard : null}>
            <Animated.View style={[LeaderBoardStyles.containerTitle, { opacity: headerAnim.opacity, transform: headerAnim.transform }]}>
              <Text style={LeaderBoardStyles.title}>Leaderboard</Text>
              <View style={LeaderBoardStyles.filterContainer}>
                <TouchableOpacity
                  style={[
                    LeaderBoardStyles.filterButton,
                    viewMode === 'monthly' && LeaderBoardStyles.filterButtonActive,
                  ]}
                  onPress={() => setViewMode('monthly')}
                >
                  <Text style={[
                    LeaderBoardStyles.filterText,
                    viewMode === 'monthly' && LeaderBoardStyles.filterTextActive,
                  ]}>MENSUAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    LeaderBoardStyles.filterButton,
                    viewMode === 'general' && LeaderBoardStyles.filterButtonActive,
                  ]}
                  onPress={() => setViewMode('general')}
                >
                  <Text style={[
                    LeaderBoardStyles.filterText,
                    viewMode === 'general' && LeaderBoardStyles.filterTextActive,
                  ]}>GENERAL</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Animated.View style={[LeaderBoardStyles.containerPosition, { opacity: headerAnim.opacity, transform: headerAnim.transform }]}>
              {userPosition?.position && userPosition?.position > 0 &&
                <Text style={LeaderBoardStyles.positionNumber}>#{userPosition?.position}</Text>
              }
              {userPercent && userPercent > 0 ?
                <Text style={LeaderBoardStyles.positionDescription}>Tu estas entre el {userPercent}% de mejores jugadores</Text>
                :
                <Text style={LeaderBoardStyles.positionDescription}>No estas en el top 20, pero recuerda que puedes mejorar jugando</Text>
              }
            </Animated.View>
            {topThree && topThree.length > 2 && (
              <Animated.View style={{ opacity: podiumAnim.opacity, transform: podiumAnim.transform }}>
                {sizeInInches && Number(sizeInInches) > 9 ?
                  <PodiumSvg9Inches top3Data={topThree} /> :
                  <PodiumSvg top3Data={topThree} />}
              </Animated.View>
            )}
          </View>
          {orientation === 'landscape' ? (
            <View style={sizeInInches && Number(sizeInInches) > 9 ? LeaderBoardStyles.containerPlayersList9Inches : LeaderBoardStyles.containerPlayersList}>
              <ScrollView style={LeaderBoardStyles.playersList} scrollEnabled={true} nestedScrollEnabled={true}>
                {renderPlayersList()}
                <View style={LeaderBoardStyles.space} />
              </ScrollView>
            </View>
          ) : (
            <Animated.View style={[LeaderBoardStyles.playersSection, { opacity: listAnim.opacity, transform: listAnim.transform }]}>
              {renderPlayersList()}
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaderBoard;
