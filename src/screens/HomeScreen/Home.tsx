import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Animated, TouchableWithoutFeedback, StatusBar, RefreshControl } from 'react-native';
import { faStar, faFire, faTrophy, faGamepad } from '@fortawesome/free-solid-svg-icons';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch {
  // Native module not linked yet
}

import { useAuth } from '../../AuthContext';
import { useUser } from '../../services/UserContext';
import { getTopTwenty, getUserBadges, getDashboardSummary } from '@services/backend';
import Loader from '@components/LoaderComponent/Loader';
import LevelRing from '@components/LevelRing/LevelRing';
import StatCard from '@components/StatCard/StatCard';
import MiniLeaderboard from '@components/MiniLeaderboard/MiniLeaderboard';
import TipBanner from '@components/TipBanner/TipBanner';
import TrophyGrid from '@components/TrophyGrid/TrophyGrid';
import dashboardStyles from '../../theme/dashboardStyles';
import { darkTheme } from '../../theme/colors';
import { TTopTwenty } from '../../types/user';
import { getAvatarSource } from '../../utils/avatars';
import { useFadeInUp, usePressScale } from '../../utils/animations';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { uid } = useAuth();
  const {
    profilePicture,
    setUpdateProfilePicture,
    userPoints,
    setUpdateUserPoints,
    userInformation,
    setUpdateUserInformation,
    last3MonthsScores,
    setUpdateLast3MonthsScores,
  } = useUser();

  // Dashboard summary data
  const [ranking, setRanking] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [topUsers, setTopUsers] = useState<TTopTwenty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  // Trigger animations only after data has loaded and content is visible
  useEffect(() => {
    if (!loading) {
      // Small delay so the layout is painted before animations start
      const t = setTimeout(() => setAnimReady(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  // Animations — enabled only after loading completes
  const heroAnim = useFadeInUp(0, animReady);
  const statsAnim = useFadeInUp(150, animReady);
  const ctaAnim = useFadeInUp(300, animReady);
  const leaderboardAnim = useFadeInUp(450, animReady);
  const trophyAnim = useFadeInUp(600, animReady);
  const tipAnim = useFadeInUp(750, animReady);
  const ctaPress = usePressScale();

  // Trigger context data fetching
  useEffect(() => {
    if (!profilePicture) setUpdateProfilePicture(true);
    if (!userPoints) setUpdateUserPoints(true);
    if (!userInformation) setUpdateUserInformation(true);
    if (!last3MonthsScores) setUpdateLast3MonthsScores(true);
  }, [
    profilePicture, setUpdateProfilePicture,
    userPoints, setUpdateUserPoints,
    userInformation, setUpdateUserInformation,
    last3MonthsScores, setUpdateLast3MonthsScores,
  ]);

  // Dashboard data fetcher
  const fetchDashboardData = useCallback(async () => {
    if (__DEV__) console.log('[DEBUG Home] fetchDashboardData called, uid:', uid);
    try {
      const [summaryResult, topResult, badgesResult] = await Promise.all([
        getDashboardSummary(uid).catch((e) => { console.log('[DEBUG Home] getDashboardSummary catch:', e); return null; }),
        getTopTwenty().catch((e) => { console.log('[DEBUG Home] getTopTwenty catch:', e); return null; }),
        getUserBadges(uid).catch((e) => { console.log('[DEBUG Home] getUserBadges catch:', e); return null; }),
      ]);

      if (__DEV__) console.log('[DEBUG Home] summaryResult:', JSON.stringify(summaryResult));
      if (__DEV__) console.log('[DEBUG Home] topResult count:', topResult ? topResult.length : 'null');
      if (__DEV__) console.log('[DEBUG Home] badgesResult:', JSON.stringify(badgesResult));

      if (summaryResult) {
        setRanking(summaryResult.global_ranking);
        setTotalScore(summaryResult.score_total);
        setBestScore(summaryResult.best_score);
        setTotalGames(summaryResult.total_games);
      } else if (userPoints?.score_total) {
        // Fallback to context data
        setTotalScore(userPoints.score_total);
      }

      if (topResult) setTopUsers(topResult);
      if (badgesResult) {
        setStreak(badgesResult.scoring_streak ?? 0);
        setBadges(badgesResult.badges ?? []);
      }
    } catch (e) {
      if (__DEV__) console.log('[DEBUG Home] fetchDashboardData ERROR:', e);
    }
  }, [uid, userPoints]);

  // Fetch on mount
  useEffect(() => {
    let mounted = true;
    async function loadInitialData() {
      await fetchDashboardData();
      if (mounted) setLoading(false);
    }
    if (uid) loadInitialData();
    else setLoading(false);
    return () => { mounted = false; };
  }, [uid, fetchDashboardData]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setUpdateProfilePicture(true);
    setUpdateUserPoints(true);
    setUpdateUserInformation(true);
    setUpdateLast3MonthsScores(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [fetchDashboardData, setUpdateProfilePicture, setUpdateUserPoints, setUpdateUserInformation, setUpdateLast3MonthsScores]);

  const handleNavigateGames = useCallback(() => {
    navigation.navigate('Games');
  }, [navigation]);

  const handleNavigateLeaderboard = useCallback(() => {
    navigation.navigate('MainTab', { screen: 'Leaderboard' });
  }, [navigation]);

  // Resolve avatar
  const avatarSource = getAvatarSource(profilePicture);

  if (loading && !userInformation) {
    return (
      <View style={[dashboardStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
        <Loader visible={true} />
      </View>
    );
  }

  return (
    <View style={dashboardStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      {/* Decorative Glows */}
      <View style={dashboardStyles.glowPurple} />
      <View style={dashboardStyles.glowCyan} />

      <ScrollView
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C3AED"
            colors={['#7C3AED']}
          />
        }
      >
        {/* Header */}
        <View style={dashboardStyles.header}>
          <View>
            <Text style={dashboardStyles.greeting}>Hola!</Text>
            <Text style={dashboardStyles.username}>
              {userInformation?.name || 'Jugador'}
            </Text>
          </View>
          <View style={dashboardStyles.avatarContainer}>
            <Image
              source={avatarSource}
              style={dashboardStyles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Hero — Level Ring */}
        <Animated.View style={[dashboardStyles.heroCard, { opacity: heroAnim.opacity, transform: heroAnim.transform }]}>
          <LevelRing score={totalScore} />
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[dashboardStyles.statsGrid, { opacity: statsAnim.opacity, transform: statsAnim.transform }]}>
          <StatCard
            icon={faStar}
            value={ranking != null && ranking > 0 ? `#${ranking}` : '--'}
            label="Ranking"
            accentColor="#FFD700"
            delay={0}
          />
          <StatCard
            icon={faFire}
            value={String(streak)}
            label="Racha"
            accentColor="#EF4444"
            delay={80}
          />
          <StatCard
            icon={faTrophy}
            value={bestScore > 0 ? bestScore.toLocaleString() : '--'}
            label="Mejor"
            accentColor="#8B5CF6"
            delay={160}
          />
          <StatCard
            icon={faGamepad}
            value={String(totalGames)}
            label="Partidas"
            accentColor="#3B82F6"
            delay={240}
          />
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={{ opacity: ctaAnim.opacity, transform: [{ translateY: ctaAnim.transform[0].translateY }, { scale: ctaPress.scale }] }}>
          <TouchableWithoutFeedback
            onPress={handleNavigateGames}
            onPressIn={ctaPress.onPressIn}
            onPressOut={ctaPress.onPressOut}
          >
            {LinearGradient ? (
              <LinearGradient
                colors={['#7C3AED', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={dashboardStyles.ctaButton}
              >
                <Text style={{ fontSize: 20 }}>{'\u25B6\uFE0F'}</Text>
                <Text style={dashboardStyles.ctaText}>Jugar Ahora</Text>
              </LinearGradient>
            ) : (
              <View style={[dashboardStyles.ctaButton, { backgroundColor: darkTheme.purple }]}>
                <Text style={{ fontSize: 20 }}>{'\u25B6\uFE0F'}</Text>
                <Text style={dashboardStyles.ctaText}>Jugar Ahora</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Mini Leaderboard */}
        {topUsers.length > 0 && (
          <Animated.View style={[dashboardStyles.glassCard, { opacity: leaderboardAnim.opacity, transform: leaderboardAnim.transform }]}>
            <Text style={dashboardStyles.sectionTitle}>
              {'\uD83C\uDFC6'} Ranking Top 5
            </Text>
            <MiniLeaderboard
              users={topUsers}
              currentUid={uid}
              onViewMore={handleNavigateLeaderboard}
            />
          </Animated.View>
        )}

        {/* Trophies */}
        <Animated.View style={[dashboardStyles.glassCard, { opacity: trophyAnim.opacity, transform: trophyAnim.transform }]}>
          <TrophyGrid
            badges={badges}
            totalGames={totalGames}
            ranking={ranking}
            streak={streak}
          />
        </Animated.View>

        {/* Tip Banner */}
        <Animated.View style={{ opacity: tipAnim.opacity, transform: tipAnim.transform }}>
          <TipBanner onAction={handleNavigateGames} />
        </Animated.View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
