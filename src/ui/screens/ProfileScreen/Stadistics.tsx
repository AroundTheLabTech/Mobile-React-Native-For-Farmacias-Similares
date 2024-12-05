import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

// Styles
import StadiscticsStyle from './style/StadiscticsStyle';


import RingChart from '@ui/components/RingChartComponent/RingChart';

import { calculatePercentage, getMaxScore, getMaxScorePerMonth, getMonthWithHighestScore, groupSessionsByMonth } from '@shared/utils/helpers';


import MedalIcon from '@img/iconos/medal.svg';
import StadisticsIcon from '@img/iconos/stadistics.svg';
import BarChart from '@ui/components/BarChartComponent/BarChart';
import { TUserCurrentMonthSession, TUserLast3MonthInfo } from 'src/shared/types/user';
import { getUserCurrentMonthSession, getUserLast3MonthsInfo } from '@application/services/backend';
import { useAuth } from '@domain/context/AuthContext';
import Loader from '@ui/components/LoaderComponent/Loader';


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

const { width: windowWidth } = Dimensions.get('window');

const StadisticsScreen: React.FC = () => {

  const { uid } = useAuth();

  const [progress, setProgress] = useState<IProgress>({
    'total': 0,
    'progress': 0,
    'progressPercent': 0,
  });

  const [bestGame, setBestGame] = useState<number>();

  const [last3MonthsInfo, setLast3MonthsInfo] = useState<StatCategory[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result: TUserCurrentMonthSession = await getUserCurrentMonthSession(uid);
      const highScore = getMaxScore(result.sessions);
      setBestGame(highScore);
      setProgress({
        'total': 120,
        'progress': result.currentMonthSessions,
        'progressPercent': calculatePercentage(120, result.currentMonthSessions),
      });
    };

    fetchData();
  }, [uid]);

  useEffect(() => {
    const fetchData = async () => {
      const result: TUserLast3MonthInfo = await getUserLast3MonthsInfo(uid);
      const resultGroupByMonth = groupSessionsByMonth(result.sessions);
      const last3MonthsScores = getMaxScorePerMonth(resultGroupByMonth);
      const highestScoreMonth = getMonthWithHighestScore(last3MonthsScores);
      const keys = Object.keys(last3MonthsScores);
      setLast3MonthsInfo(
        [
          {
            category: 'Puntajes',
            stats: [
              {
                label: keys[0],
                value: last3MonthsScores[keys[0]],
                maxValue: last3MonthsScores[highestScoreMonth],
              },
            ],
          },
          {
            category: null,
            stats: [
              {
                label: keys[1],
                value: last3MonthsScores[keys[1]],
                maxValue: last3MonthsScores[highestScoreMonth],
              },
            ],
          },
          {
            category: null,
            stats: [
              {
                label: keys[2],
                value: last3MonthsScores[keys[2]],
                maxValue: last3MonthsScores[highestScoreMonth],
              },
            ],
          },
        ]
      );
    };

    fetchData();
  }, [uid]);

  /*
  const options = [
    {
      label: 'Monthly',
      value: 'monthly',
    },
    {
      label: 'Weekly',
      value: 'weekly',
    },
  ];
  */

  const listOfColors = ['#FFD6DD', '#C4D0FB', '#A9ADF3'];

  const [orientation, setOrientation] = useState('portrait');
  const [screenWidth, setScreenWidth] = useState<number>(windowWidth);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
      setScreenWidth(width);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, [orientation, screenWidth]);

  if (!bestGame || (!last3MonthsInfo && last3MonthsInfo?.length < 3)) {
    return <Loader visible={true} />;
  }

  return (
    <View style={StadiscticsStyle.container}  >
      <View style={StadiscticsStyle.containerEstadistics}>
        {/**
        <OptionSelect options={options} />
        */}
        <Text style={StadiscticsStyle.titleTotalGames}>
          META MENSUAL DE PARTIDAS
        </Text>

        <View style={StadiscticsStyle.ringChartContainer} >
          <RingChart
            progress={progress.progressPercent} // Asegúrate de pasar el porcentaje aquí
            color="#6A5AE0"
          >
            <View style={StadiscticsStyle.ringChartView} >
              <Text style={StadiscticsStyle.ringChartText}>{Math.round(progress.progress)}/{progress.total}</Text>
              <Text >Total</Text>
            </View>
          </RingChart>
        </View>

        <View style={StadiscticsStyle.rowStadistics}>
          {/* Box */}
          <View style={StadiscticsStyle.containerBestPlay}>
            <View style={StadiscticsStyle.containerUpNumber}>
              <Text style={StadiscticsStyle.titleNumber}>
                5
              </Text>
              <Image
                source={require('@img/iconos/pastilla.png')} resizeMode="contain"
              />
            </View>

            <View>
              <Text style={StadiscticsStyle.textBox}>Mejor Juego</Text>
            </View>
          </View>

          {/* Box                 */}
          <View style={StadiscticsStyle.containerBestGame}>
            <View style={StadiscticsStyle.containerUpNumber}>
              <Text style={[StadiscticsStyle.titleNumber, StadiscticsStyle.colorPrimary]}>
                {bestGame}
              </Text>
              <MedalIcon width={24} />
            </View>

            <View >
              <Text style={[StadiscticsStyle.textBox, StadiscticsStyle.colorPrimary]}>Mejor Partida</Text>
            </View>
          </View>

        </View>

      </View>
      <View style={StadiscticsStyle.containerChartStadistics}>
        <View style={StadiscticsStyle.titleContainer} >
          <Text style={StadiscticsStyle.titleStadisticsChart} >Estadisticas Mensuales</Text>
          <View style={StadiscticsStyle.stadisticsIconContainer} >
            <StadisticsIcon width={24} />
          </View>
        </View>
        <View style={StadiscticsStyle.barChartContainer} >
          <BarChart data={last3MonthsInfo} barColor="#3498db" listOfColors={listOfColors} />
        </View>
      </View>
    </View>
  );
};

export default StadisticsScreen;
