import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions, PixelRatio } from 'react-native';

// Styles
import StadiscticsStyle from './style/StadiscticsStyle';


import RingChart from '../../components/RingChartComponent/RingChart';

import { calculatePercentage, calculateScreenSizeInInches, getMaxScore, getMaxScorePerMonth, getMonthWithHighestScore, groupSessionsByMonth } from '../../utils/helpers';


import MedalIcon from '../../../img/iconos/medal.svg';
import StadisticsIcon from '../../../img/iconos/stadistics.svg';
import BarChart from '../../components/BarChartComponent/BarChart';
import { TUserCurrentMonthSession, TUserLast3MonthInfo } from 'src/types/user';
import { getUserCurrentMonthSession, getUserLast3MonthsInfo } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import Loader from '@components/LoaderComponent/Loader';
import RingChart9Inches from '@components/RingChartComponent/RingChart9Inches';
import BarChart9Inches from '@components/BarChartComponent/BarChart9Inches';


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

const monthsInSpanish = {
  'Enero': 0,
  'Febrero': 1,
  'Marzo': 2,
  'Abril': 3,
  'Mayo': 4,
  'Junio': 5,
  'Julio': 6,
  'Agosto': 7,
  'Septiembre': 8,
  'Octubre': 9,
  'Noviembre': 10,
  'Diciembre': 11,
};

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
      if (result?.sessions) {
        const highScore = getMaxScore(result.sessions);
        setBestGame(highScore);

        const progressData = result?.currentMonthSessions ? result?.currentMonthSessions : 0;

        setProgress({
          'total': 120,
          'progress': progressData,
          'progressPercent': calculatePercentage(120, progressData),
        });
      }
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

      let newData = [];

      let controller = 0;

      for (let i = keys.length - 1; i >= 0; i--) {
        if (controller < 3) {
          newData.push(
            {
              category: i === 0 ? 'Puntajes' : null,
              stats: [
                {
                  label: keys[i],
                  value: last3MonthsScores[keys[i]],
                  maxValue: last3MonthsScores[highestScoreMonth],
                },
              ],
            }
          );
        }
        controller++;
      }

      if (newData.length > 0) {
        const sortData = newData.sort((a, b) => {
          return monthsInSpanish[a.stats[0].label] - monthsInSpanish[b.stats[0].label];
        });
        setLast3MonthsInfo(sortData);
      }
    };

    if (!last3MonthsInfo) {
      fetchData();
    }
  }, [last3MonthsInfo, uid]);

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

  const sizeInInches = calculateScreenSizeInInches(Dimensions, PixelRatio);

  return (
    <View style={StadiscticsStyle.container}  >
      <View style={StadiscticsStyle.containerEstadistics}>
        {/**
        <OptionSelect options={options} />
        */}
        <Text style={StadiscticsStyle.titleTotalGames}>
          META MENSUAL DE PARTIDAS
        </Text>

        {
          sizeInInches && Number(sizeInInches) > 9 ?
            <View style={[StadiscticsStyle.ringChartContainer, StadiscticsStyle.ringChartContainer9Inches]} >
              <RingChart9Inches
                progress={progress.progressPercent} // Asegúrate de pasar el porcentaje aquí
                color="#6A5AE0"
              >
                <View style={StadiscticsStyle.ringChartView} >
                  <Text style={StadiscticsStyle.ringChartText}>{Math.round(progress.progress)}/{progress.total}</Text>
                  <Text style={StadiscticsStyle.totalText}  >Total</Text>
                </View>
              </RingChart9Inches>
            </View> :
            <View style={StadiscticsStyle.ringChartContainer} >
              <RingChart
                progress={progress.progressPercent} // Asegúrate de pasar el porcentaje aquí
                color="#6A5AE0"
              >
                <View style={StadiscticsStyle.ringChartView} >
                  <Text style={StadiscticsStyle.ringChartText}>{Math.round(progress.progress)}/{progress.total}</Text>
                  <Text style={StadiscticsStyle.totalText} >Total</Text>
                </View>
              </RingChart>
            </View>
        }
        <View style={StadiscticsStyle.rowStadistics}>
          {/* Box */}
          <View style={StadiscticsStyle.containerBestPlay}>
            <View style={StadiscticsStyle.containerUpNumber}>
              <Text style={StadiscticsStyle.titleNumber}>
                5
              </Text>
              <Image
                source={require('../../../img/iconos/pastilla.png')} resizeMode="contain"
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
          {
            last3MonthsInfo && sizeInInches && Number(sizeInInches) > 9 ?
              (
                <BarChart9Inches data={last3MonthsInfo} barColor="#3498db" listOfColors={listOfColors} />
              ) :
              (
                <BarChart data={last3MonthsInfo} barColor="#3498db" listOfColors={listOfColors} />
              )
          }
        </View>
      </View>
    </View>
  );
};

export default StadisticsScreen;
