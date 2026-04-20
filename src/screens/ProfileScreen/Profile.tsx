import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, StatusBar, Animated, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGlobe, faCalendarDays, faGear, faStar, faFire, faTrophy, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext';
import StadisticsScreen from './Stadistics';
import ProfileSkeleton from '@components/Skeleton/ProfileSkeleton';
import StatCard from '@components/StatCard/StatCard';
import MiniLeaderboard from '@components/MiniLeaderboard/MiniLeaderboard';
import TrophyGrid from '@components/TrophyGrid/TrophyGrid';
import { useUser } from '@services/UserContext';
import { getTopGlobalByUser, getTopMonthlyByUser, getDashboardSummary, getTopTwenty, getUserBadges } from '../../services/backend';
import LevelRing from '../../components/LevelRing/LevelRing';
import { darkTheme } from '../../theme/colors';
import { getAvatarSource } from '../../utils/avatars';
import { useFadeInUp, usePressScale } from '../../utils/animations';
import profileStyles from './style/ProfileStyle';
import { TTopTwenty } from '../../types/user';

const ProfileScreen = ({ navigation }) => {
  const { uid } = useAuth();
  const [topGlobal, setTopGlobal] = useState<number | null>(null);
  const [topMonthly, setTopMonthly] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  // Dashboard summary data
  const [ranking, setRanking] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [topUsers, setTopUsers] = useState<TTopTwenty[]>([]);

  const { profilePicture, setUpdateProfilePicture, userPoints, setUpdateUserPoints, userInformation } = useUser();

  useEffect(() => {
    if (!userPoints) setUpdateUserPoints(true);
  }, [setUpdateUserPoints, userPoints]);

  useEffect(() => {
    if (!profilePicture) setUpdateProfilePicture(true);
  }, [profilePicture, setUpdateProfilePicture]);

  const fetchRankings = useCallback(async () => {
    try {
      const [globalRes, monthlyRes, summaryResult, topResult, badgesResult] = await Promise.all([
        getTopGlobalByUser(uid).catch(() => null),
        getTopMonthlyByUser(uid).catch(() => null),
        getDashboardSummary(uid).catch(() => null),
        getTopTwenty().catch(() => null),
        getUserBadges(uid).catch(() => null),
      ]);
      setTopGlobal(globalRes && globalRes > 0 ? globalRes : 0);
      setTopMonthly(monthlyRes && monthlyRes > 0 ? monthlyRes : 0);
      if (summaryResult) {
        setRanking(summaryResult.global_ranking);
        setTotalScore(summaryResult.score_total);
        setBestScore(summaryResult.best_score);
        setTotalGames(summaryResult.total_games);
      }
      if (topResult) setTopUsers(topResult);
      if (badgesResult) {
        setStreak(badgesResult.scoring_streak ?? 0);
        setBadges(badgesResult.badges ?? []);
      }
    } catch {
      setTopGlobal(0);
      setTopMonthly(0);
    }
  }, [uid]);

  useEffect(() => {
    let mounted = true;
    async function init() {
      await fetchRankings();
      if (mounted) {
        setLoading(false);
        setTimeout(() => setAnimReady(true), 50);
      }
    }
    init();
    return () => { mounted = false; };
  }, [fetchRankings]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setUpdateProfilePicture(true);
    setUpdateUserPoints(true);
    await fetchRankings();
    setRefreshing(false);
  }, [fetchRankings, setUpdateProfilePicture, setUpdateUserPoints]);

  // Animations
  const avatarAnim = useFadeInUp(0, animReady);
  const levelAnim = useFadeInUp(150, animReady);
  const statsAnim = useFadeInUp(300, animReady);
  const dashGridAnim = useFadeInUp(380, animReady);
  const leaderboardAnim = useFadeInUp(460, animReady);
  const trophyAnim = useFadeInUp(540, animReady);
  const tabsAnim = useFadeInUp(620, animReady);
  const settingsPress = usePressScale();

  const avatarSource = getAvatarSource(profilePicture);
  const score = totalScore || userPoints?.score_total || 0;

  const formatRank = (val: number | null) => {
    if (val === null) return '...';
    if (val <= 0) return '--';
    return `#${val}`;
  };

  if (loading && !userInformation) {
    return <ProfileSkeleton />;
  }

  return (
    <View style={profileStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
      <View style={profileStyles.glowPurple} />
      <View style={profileStyles.glowCyan} />

      <ScrollView
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkTheme.purple}
            colors={[darkTheme.purple]}
          />
        }
      >
        {/* Header — Settings */}
        <View style={profileStyles.header}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Settings')}
            onPressIn={settingsPress.onPressIn}
            onPressOut={settingsPress.onPressOut}
          >
            <Animated.View style={[profileStyles.settingsButton, { transform: [{ scale: settingsPress.scale }] }]}>
              <FontAwesomeIcon icon={faGear} size={20} color={darkTheme.textMuted} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

        {/* Avatar Section */}
        <Animated.View style={[profileStyles.avatarSection, { opacity: avatarAnim.opacity, transform: avatarAnim.transform }]}>
          <View style={profileStyles.avatarGlow}>
            <View style={profileStyles.avatarRing}>
              <Image
                source={avatarSource}
                style={profileStyles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>
          <Text style={profileStyles.userName}>{userInformation?.name || 'Jugador'}</Text>
          <Text style={profileStyles.userEmail}>{userInformation?.email || ''}</Text>
        </Animated.View>

        {/* Level Card — Full width */}
        <Animated.View style={[profileStyles.levelCard, { opacity: levelAnim.opacity, transform: levelAnim.transform }]}>
          <LevelRing score={score} />
        </Animated.View>

        {/* Stats Row — 2 cards */}
        <Animated.View style={[profileStyles.statsRow, { opacity: statsAnim.opacity, transform: statsAnim.transform }]}>
          <View style={profileStyles.statCard}>
            <View style={[profileStyles.statIconBox, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
              <FontAwesomeIcon icon={faGlobe} size={20} color="#3B82F6" />
            </View>
            <Text style={profileStyles.statValue}>{formatRank(topGlobal)}</Text>
            <Text style={profileStyles.statLabel}>Top Mundial</Text>
          </View>

          <View style={profileStyles.statCard}>
            <View style={[profileStyles.statIconBox, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
              <FontAwesomeIcon icon={faCalendarDays} size={20} color="#F59E0B" />
            </View>
            <Text style={profileStyles.statValue}>{formatRank(topMonthly)}</Text>
            <Text style={profileStyles.statLabel}>Top Mensual</Text>
          </View>
        </Animated.View>

        {/* 4-stat grid */}
        <Animated.View style={[profileStyles.statsGrid, { opacity: dashGridAnim.opacity, transform: dashGridAnim.transform }]}>
          <StatCard icon={faStar} value={ranking != null && ranking > 0 ? `#${ranking}` : '--'} label="Ranking" accentColor="#FFD700" delay={0} />
          <StatCard icon={faFire} value={String(streak)} label="Racha" accentColor="#EF4444" delay={80} />
          <StatCard icon={faTrophy} value={bestScore > 0 ? bestScore.toLocaleString() : '--'} label="Mejor" accentColor="#8B5CF6" delay={160} />
          <StatCard icon={faGamepad} value={String(totalGames)} label="Partidas" accentColor="#3B82F6" delay={240} />
        </Animated.View>

        {/* Mini Leaderboard */}
        {topUsers.length > 0 && (
          <Animated.View style={[profileStyles.glassCard, { opacity: leaderboardAnim.opacity, transform: leaderboardAnim.transform }]}>
            <Text style={profileStyles.sectionTitle}>{'\uD83C\uDFC6'} Ranking Top 5</Text>
            <MiniLeaderboard
              users={topUsers}
              currentUid={uid}
              onViewMore={() => navigation.navigate('MainTab', { screen: 'Leaderboard' })}
            />
          </Animated.View>
        )}

        {/* Trophy Grid */}
        <Animated.View style={[profileStyles.glassCard, { opacity: trophyAnim.opacity, transform: trophyAnim.transform }]}>
          <TrophyGrid badges={badges} totalGames={totalGames} ranking={ranking} streak={streak} />
        </Animated.View>

        {/* Tabs — Statistics only */}
        <Animated.View style={[profileStyles.tabContainer, { opacity: tabsAnim.opacity, transform: tabsAnim.transform }]}>
          <View style={profileStyles.tabRow}>
            <TouchableOpacity
              style={[profileStyles.tabButton, profileStyles.tabButtonActive]}
            >
              <Text style={[profileStyles.tabText, profileStyles.tabTextActive]}>
                Estad{'\u00ed'}sticas
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tab Content */}
        <View style={profileStyles.contentContainer}>
          <StadisticsScreen />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
