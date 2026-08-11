import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  PixelRatio,
  Animated,
} from 'react-native';

// Styles
import StadiscticsStyle from './style/StadiscticsStyle';

import RingChart from '../../components/RingChartComponent/RingChart';

import {
  calculatePercentage,
  calculateScreenSizeInInches,
  getMaxScore,
  getSumScorePerMonth,
  getMonthWithHighestScore,
  groupSessionsByMonth,
} from '../../utils/helpers';

import MedalIcon from '../../../img/iconos/medal.svg';
import StadisticsIcon from '../../../img/iconos/stadistics.svg';
import BarChart from '../../components/BarChartComponent/BarChart';
import OptionSelect from '../../components/OptionSelectComponent/OptionSelect';
import {TUserCurrentMonthSession, TUserLast3MonthInfo, TUserSession} from 'src/types/user';
import {getUserCurrentMonthSession} from '../../services/backend';
import {useAuth} from '../../AuthContext';
import {useUser} from '../../services/UserContext';
import RingChart9Inches from '@components/RingChartComponent/RingChart9Inches';
import BarChart9Inches from '@components/BarChartComponent/BarChart9Inches';

/** Skeleton placeholder block with pulse animation */
const SkeletonBlock = ({
  width,
  height,
  style,
}: {
  width: number | string;
  height: number;
  style?: any;
}) => {
  const pulse = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 10,
          backgroundColor: 'rgba(106,90,224,0.15)',
          opacity: pulse,
        },
        style,
      ]}
    />
  );
};

interface IProgress {
  total: number;
  progress: number;
  progressPercent: number;
}

type StatCategory = {
  category: string;
  stats: {
    label: string;
    value: number;
    maxValue: number;
  }[];
};

const {width: windowWidth} = Dimensions.get('window');

const monthsInSpanish = {
  Enero: 0,
  Febrero: 1,
  Marzo: 2,
  Abril: 3,
  Mayo: 4,
  Junio: 5,
  Julio: 6,
  Agosto: 7,
  Septiembre: 8,
  Octubre: 9,
  Noviembre: 10,
  Diciembre: 11,
};

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const buildGeneralChartData = (
  result: TUserLast3MonthInfo,
): StatCategory[] | undefined => {
  if (!result?.sessions?.length) {
    return undefined;
  }

  const resultGroupByMonth = groupSessionsByMonth(result.sessions);
  const monthlyTotals = getSumScorePerMonth(resultGroupByMonth);
  const highestScoreMonth = getMonthWithHighestScore(monthlyTotals);
  const keys = Object.keys(monthlyTotals);

  const newData: StatCategory[] = [];
  let controller = 0;

  for (let i = keys.length - 1; i >= 0; i--) {
    if (controller < 3) {
      newData.push({
        category: i === 0 ? 'Puntajes' : null,
        stats: [
          {
            label: keys[i],
            value: monthlyTotals[keys[i]],
            maxValue: monthlyTotals[highestScoreMonth],
          },
        ],
      });
    }
    controller++;
  }

  if (newData.length === 0) {
    return undefined;
  }

  return newData.sort(
    (a, b) =>
      monthsInSpanish[a.stats[0].label] - monthsInSpanish[b.stats[0].label],
  );
};

const buildMonthlyChartData = (
  sessions: TUserSession[],
): StatCategory[] => {
  const currentMonthLabel = MONTH_LABELS[new Date().getMonth()];
  const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);

  return [
    {
      category: 'Puntajes',
      stats: [
        {
          label: currentMonthLabel,
          value: totalScore,
          maxValue: totalScore || 1,
        },
      ],
    },
  ];
};

const StadisticsScreen: React.FC = () => {
  const {uid} = useAuth();
  const {last3MonthsScores, setUpdateLast3MonthsScores} = useUser();

  const [loadingMonth, setLoadingMonth] = useState<boolean>(true);

  const [progress, setProgress] = useState<IProgress>({
    total: 120,
    progress: 0,
    progressPercent: 0,
  });

  const [bestGameCurrentMonth, setBestGameCurrentMonth] = useState<
    number | undefined
  >();
  const [currentMonthSessions, setCurrentMonthSessions] = useState<
    TUserSession[]
  >([]);

  const generalChartData = useMemo(
    () =>
      last3MonthsScores
        ? buildGeneralChartData(last3MonthsScores)
        : undefined,
    [last3MonthsScores],
  );

  const monthlyChartData = useMemo(
    () => buildMonthlyChartData(currentMonthSessions),
    [currentMonthSessions],
  );

  const [selectedFilter, setSelectedFilter] = useState<'monthly' | 'general'>(
    'monthly',
  );

  const chartData =
    selectedFilter === 'general' ? generalChartData : monthlyChartData;

  const bestGameFromHistory = useMemo(() => {
    if (!last3MonthsScores?.sessions?.length) {
      return undefined;
    }
    return getMaxScore(last3MonthsScores.sessions);
  }, [last3MonthsScores]);

  const generalTotalScore = useMemo(() => {
    if (!last3MonthsScores?.sessions?.length) {
      return 0;
    }
    return last3MonthsScores.sessions.reduce(
      (sum, session) => sum + session.score,
      0,
    );
  }, [last3MonthsScores]);

  const currentMonthTotalScore = useMemo(
    () => currentMonthSessions.reduce((sum, session) => sum + session.score, 0),
    [currentMonthSessions],
  );

  const displayBestGame =
    selectedFilter === 'monthly' ? currentMonthTotalScore : generalTotalScore;

  const displayBestSession =
    selectedFilter === 'monthly'
      ? bestGameCurrentMonth ?? 0
      : bestGameFromHistory ?? 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonth(true);
      const result: TUserCurrentMonthSession = await getUserCurrentMonthSession(
        uid,
      );

      if (result?.sessions?.length) {
        setBestGameCurrentMonth(getMaxScore(result.sessions));
        setCurrentMonthSessions(result.sessions);
      } else {
        setBestGameCurrentMonth(undefined);
        setCurrentMonthSessions([]);
      }

      const progressData = result?.currentMonthSessions ?? 0;
      setProgress({
        total: 120,
        progress: progressData,
        progressPercent: calculatePercentage(120, progressData),
      });

      setLoadingMonth(false);
    };

    fetchData();
  }, [uid]);

  useEffect(() => {
    if (!last3MonthsScores) {
      setUpdateLast3MonthsScores(true);
    }
  }, [last3MonthsScores, setUpdateLast3MonthsScores]);

  const filterOptions = [
    {label: 'Mensual', value: 'monthly'},
    {label: 'General', value: 'general'},
  ];

  const listOfColors = ['#FFD6DD', '#C4D0FB', '#A9ADF3'];

  const [orientation, setOrientation] = useState('portrait');
  const [screenWidth, setScreenWidth] = useState<number>(windowWidth);

  useEffect(() => {
    const updateOrientation = () => {
      const {width, height} = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateOrientation,
    );

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, [orientation, screenWidth]);

  const loading = loadingMonth || last3MonthsScores === null;

  if (loading) {
    return (
      <View style={StadiscticsStyle.container}>
        <View style={{padding: 16, gap: 12, width: '100%'}}>
          <SkeletonBlock width="60%" height={20} />
          <SkeletonBlock width="100%" height={160} style={{marginTop: 8}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <SkeletonBlock width="48%" height={80} />
            <SkeletonBlock width="48%" height={80} />
          </View>
          <SkeletonBlock width="100%" height={140} style={{marginTop: 12}} />
        </View>
      </View>
    );
  }

  if (!generalChartData?.length && !last3MonthsScores?.sessions?.length) {
    return (
      <View style={StadiscticsStyle.container}>
        <Text style={StadiscticsStyle.noDataText}>
          No hay datos disponibles
        </Text>
      </View>
    );
  }

  const sizeInInches = calculateScreenSizeInInches(Dimensions, PixelRatio);

  return (
    <View style={StadiscticsStyle.container}>
      <View style={StadiscticsStyle.containerEstadistics}>
        <OptionSelect
          options={filterOptions}
          onSelect={value => setSelectedFilter(value as 'monthly' | 'general')}
        />
        <Text style={StadiscticsStyle.titleTotalGames}>
          {selectedFilter === 'monthly'
            ? 'META MENSUAL DE PARTIDAS'
            : 'ESTADÍSTICAS GENERALES'}
        </Text>

        {selectedFilter === 'monthly' &&
          (sizeInInches && Number(sizeInInches) > 9 ? (
            <View
              style={[
                StadiscticsStyle.ringChartContainer,
                StadiscticsStyle.ringChartContainer9Inches,
              ]}>
              <RingChart9Inches
                progress={progress.progressPercent}
                color="#6A5AE0">
                <View style={StadiscticsStyle.ringChartView}>
                  <Text style={StadiscticsStyle.ringChartText}>
                    {Math.round(progress.progress)}/{progress.total}
                  </Text>
                  <Text style={StadiscticsStyle.totalText}>Total</Text>
                </View>
              </RingChart9Inches>
            </View>
          ) : (
            <View style={StadiscticsStyle.ringChartContainer}>
              <RingChart progress={progress.progressPercent} color="#6A5AE0">
                <View style={StadiscticsStyle.ringChartView}>
                  <Text style={StadiscticsStyle.ringChartText}>
                    {Math.round(progress.progress)}/{progress.total}
                  </Text>
                  <Text style={StadiscticsStyle.totalText}>Total</Text>
                </View>
              </RingChart>
            </View>
          ))}
        <View style={StadiscticsStyle.rowStadistics}>
          {/* Box */}
          <View style={StadiscticsStyle.containerBestPlay}>
            <View style={StadiscticsStyle.containerUpNumber}>
              <Text style={StadiscticsStyle.titleNumber}>{displayBestGame}</Text>
              <Image
                source={require('../../../img/iconos/pastilla.png')}
                resizeMode="contain"
              />
            </View>

            <View>
              <Text style={StadiscticsStyle.textBox}>Mejor Juego</Text>
            </View>
          </View>

          {/* Box                 */}
          <View style={StadiscticsStyle.containerBestGame}>
            <View style={StadiscticsStyle.containerUpNumber}>
              <Text
                style={[
                  StadiscticsStyle.titleNumber,
                  StadiscticsStyle.colorPrimary,
                ]}>
                {displayBestSession}
              </Text>
              <MedalIcon width={24} />
            </View>

            <View>
              <Text
                style={[
                  StadiscticsStyle.textBox,
                  StadiscticsStyle.colorPrimary,
                ]}>
                Mejor Partida
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={StadiscticsStyle.containerChartStadistics}>
        <View style={StadiscticsStyle.titleContainer}>
          <Text style={StadiscticsStyle.titleStadisticsChart}>
            {selectedFilter === 'monthly'
              ? 'Estadísticas Mensuales'
              : 'Estadísticas Generales'}
          </Text>
          <View style={StadiscticsStyle.stadisticsIconContainer}>
            <StadisticsIcon width={24} />
          </View>
        </View>
        <View style={StadiscticsStyle.barChartContainer}>
          {chartData && sizeInInches && Number(sizeInInches) > 9 ? (
            <BarChart9Inches
              data={chartData}
              barColor="#3498db"
              listOfColors={listOfColors}
            />
          ) : (
            <BarChart
              data={chartData}
              barColor="#3498db"
              listOfColors={listOfColors}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default StadisticsScreen;
