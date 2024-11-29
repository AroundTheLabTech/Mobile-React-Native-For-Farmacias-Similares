import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Dimensions } from 'react-native';
import LeaderBoardStyles from './style/LeaderBoardStyles';
import LeaderBoardCard from '@components/LeaderBoardCardComponents/LeaderBoardCard';
import DraggableMenu from '@components/DraggableMenuComponent/DraggableMenu';
import PodiumSvg from '@components/PodiumChartComponent/PodiumSvg';
import { getTopTwenty } from '@services/backend';
import { TLeaderBoard } from 'src/types/user';
import { calculatePercent, splitTopTwenty } from '../../utils/helpers';
import Loader from '@components/LoaderComponent/Loader';
import { useAuth } from '../../AuthContext';

const LeaderBoard: React.FC = () => {
  const { uid } = useAuth();

  const [orientation, setOrientation] = useState('portrait');
  // const [width1, setWidth1] = useState(0);
  // const [height1, setHeight1] = useState(0);
  const [topThree, setTopThree] = useState<TLeaderBoard[]>();
  const [topTwenty, setTopTwenty] = useState<TLeaderBoard[]>();
  const [userPosition, setUserPosition] = useState<TLeaderBoard>();
  const [userPercent, setUserPercent] = useState<number>();

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
      // setWidth1(width);
      // setHeight1(height);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await getTopTwenty();

      const tops = splitTopTwenty(response);

      setTopThree(tops.topThree);
      setTopTwenty(tops.topRest);

      const filterUserTop = tops.all.filter((player) => player.uid === uid);

      const userTopPercent = calculatePercent(filterUserTop[0].position, 0, 20);

      setUserPercent(userTopPercent);

      setUserPosition(filterUserTop[0]);
    }

    if (!topTwenty || !topThree) {
      fetchData();
    }
  }, [topThree, topTwenty, uid]);

  if (!topThree || !topTwenty) {
    return <Loader visible />;
  }

  return (
    <ScrollView style={LeaderBoardStyles.containerScroll}>
      {/* Header */}
      <View style={orientation === 'landscape' ? LeaderBoardStyles.containerFull : null} >
        <View style={orientation === 'landscape' ? LeaderBoardStyles.userLeaderboard : null}  >
          <View style={LeaderBoardStyles.containerTitle}>
            <Text style={LeaderBoardStyles.title}>Leaderboard</Text>
            <View style={LeaderBoardStyles.containerLeaderrboardTime}>
              <Text style={LeaderBoardStyles.timeOption}>MENSUAL</Text>
              {/**
              <Text style={LeaderBoardStyles.timeOption}>Width: {width1}</Text>
              <Text style={LeaderBoardStyles.timeOption}>Height: {height1}</Text>
              */}
            </View>
          </View>
          <View style={LeaderBoardStyles.containerPosition}>
            <Text style={LeaderBoardStyles.positionNumber}>#{userPosition?.position}</Text>
            {
              userPercent && userPercent > 0 ?
                <Text style={LeaderBoardStyles.positionDescription}>Tu estas entre el {userPercent}% de mejores jugadores</Text>
                :
                <Text style={LeaderBoardStyles.positionDescription}>No estás en el top 20, pero recuerda que puedes mejorar jugando</Text>
            }

          </View>
          {
            topThree && topThree.length > 2 &&
            <PodiumSvg top3Data={topThree} />
          }
          {/*
          <PodiumChart />
          */}

        </View>
        {
          orientation === 'landscape' ?
            (
              <View style={LeaderBoardStyles.containerPlayersList} >
                <ScrollView style={LeaderBoardStyles.playersList}
                  scrollEnabled={true} // Controla si el scroll está habilitado
                  nestedScrollEnabled={true}
                >
                  {topTwenty && topTwenty.length > 15 && topTwenty.map((player: TLeaderBoard, index) => (
                    <LeaderBoardCard key={index} player={player} />
                  ))}
                </ScrollView>
              </View>
            ) :
            (
              <DraggableMenu>
                <View style={LeaderBoardStyles.leaderBoardContainer} >
                  {topTwenty && topTwenty.length > 15 && topTwenty.map((player: TLeaderBoard, index) => (
                    <LeaderBoardCard key={index} player={player} />
                  ))}
                </View>
              </DraggableMenu>
            )
        }
      </View >
    </ScrollView >
  );
};

export default LeaderBoard;
