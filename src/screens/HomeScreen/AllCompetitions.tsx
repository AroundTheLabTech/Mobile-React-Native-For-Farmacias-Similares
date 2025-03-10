import React, { useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';

// Styles
import AllCompetitionStyles from './style/AllCompetitionStyle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TCompetition } from '../../types/competition';
import { useAuth } from '../../AuthContext';
import { getAllCompetition } from '@services/backend';
import CompetitionCard from '@components/CompetitionCard/CompetitionCard';
import Loader from '@components/LoaderComponent/Loader';

const AllCompetitions = ({ navigation }) => {

  const { uid } = useAuth();

  const [competitions, setCompetitions] = useState<TCompetition[]>();

  useEffect(() => {
    async function fetchData() {
      const response = await getAllCompetition(uid);

      setCompetitions(response);
    }

    if (!competitions) {
      fetchData();
    }
  }, [competitions, uid]);

  if (!competitions) {
    return <Loader visible />;
  }

  return (
    <ScrollView style={AllCompetitionStyles.containerScroll}>
      <View style={AllCompetitionStyles.container} >
        <TouchableOpacity style={AllCompetitionStyles.goBackButton} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <View style={AllCompetitionStyles.containerCompetitions} >
          {
            competitions && competitions.length > 0 ? competitions.map((competition, index) => {
              return (
                <CompetitionCard key={index} competition={competition} notifications={false} ejectFunction={() => {}} other={true} />
              );
            }) :
            <Text style={AllCompetitionStyles.notFound} >No hay competencias disponibles</Text>
          }
        </View>
      </View>
    </ScrollView>
  );
};

export default AllCompetitions;
