import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, fonts, fontSizes } from '../../../global-class';
import { TCompetition, TScoreSession } from 'src/types/competition';

import Check from '@img/iconos/check.svg';
import Trash from '@img/iconos/trash.svg';
import Competition from '@img/iconos/competition.svg';

import { useAuth } from '../../AuthContext';
import { putRejectCompetition, putAcceptCompetition, getCompetitionSessions } from '@services/backend';

interface ICompetitionCard {
  competition: TCompetition
  notifications: boolean
  ejectFunction: () => void
  other?: boolean
}

const CompetitionCard: React.FC<ICompetitionCard> = ({ competition, notifications = false, ejectFunction, other = false }) => {

  const { uid } = useAuth();

  const [competitionPlaysScore, setCompetitionPlaysScore] = useState<number>(0);
  const [opponentCompetitionPlaysScore, setOpponentCompetitionPlaysScore] = useState<number>(0);

  async function handleReject() {
    console.log('Rechazar');

    await putRejectCompetition(uid, competition.UID, competition.id);
    ejectFunction();
  }

  async function handleApprove() {
    console.log('Aprobar');

    await putAcceptCompetition(uid, competition.UID, competition.id);
    ejectFunction();
  }

  function getCompettionSessionScore(competitionSession) {
    let competitionScore = 0;
    competitionSession.map((plays: TScoreSession) => {
      competitionScore += plays.score;
    });
    return competitionScore;
  }

  useEffect(() => {
    async function fetchData() {
      const competitionPlays = await getCompetitionSessions(uid, competition.UID, competition.id);

      if (competitionPlays && competitionPlays.user_plays_competition.length > 0) {
        const competitionScore = getCompettionSessionScore(competitionPlays.user_plays_competition);
        setCompetitionPlaysScore(competitionScore);
      } else {
        setCompetitionPlaysScore(0);
      }

      if (competitionPlays && competitionPlays.opponent_plays_competition.length > 0) {
        const competitionScore = getCompettionSessionScore(competitionPlays.opponent_plays_competition);
        setOpponentCompetitionPlaysScore(competitionScore);
      } else {
        setOpponentCompetitionPlaysScore(0);
      }
    }

    if (!competitionPlaysScore || !opponentCompetitionPlaysScore) {
      fetchData();
    }
  }, [competition.UID, competition.id, competitionPlaysScore, opponentCompetitionPlaysScore, uid]);

  function styleStatusValidate(status: string, result: string) {
    if (status?.toLocaleUpperCase() === 'ESPERA') {
      return { ...styles.competitionStatus, color: '#CCCCCC' };
    }
    if (status?.toLocaleUpperCase() === 'ACEPTADO') {
      return { ...styles.competitionStatus, color: '#007BFF' };
    }
    if (status?.toLocaleUpperCase() === 'RECHAZADO') {
      return { ...styles.competitionStatus, color: '#FF4D4D' };
    }
    if (status?.toLocaleUpperCase() === 'COMPLETADO' && result?.toLocaleUpperCase() === 'EMPATE') {
      return { ...styles.competitionStatus, color: '#FFC107' };
    }
    if (status?.toLocaleUpperCase() === 'COMPLETADO' && result?.toLocaleUpperCase() === 'GANADO') {
      return { ...styles.competitionStatus, color: '#28A745' };
    }
    if (status?.toLocaleUpperCase() === 'COMPLETADO' && result?.toLocaleUpperCase() === 'PERDIDO') {
      return { ...styles.competitionStatus, color: '#6C757D' };
    }
    return styles.competitionStatus;
  }

  if (notifications) {
    return (
      <View style={styles.container}>
        <View style={styles.informationContainer} >
          <Image style={styles.profilePicture} source={{ uri: competition.profile_picture }} width={20} height={30} />
          <View style={styles.userInformation} >
            <Text style={styles.username}>
              {competition.name.length > 5 ? `${competition.name.substring(0, 5)}...` : competition.name}
            </Text>
            <Text style={styles.intivationText} >Te ha invitado a competir</Text>
          </View>
          <View style={styles.aceptDeclineContainer} >
            <TouchableOpacity style={styles.accept} onPress={handleApprove} >
              <Check width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.adecline} onPress={handleReject} >
              <Trash width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.baseline} />
      </View>
    );
  } else if (!notifications && !other) {
    return (
      <View style={styles.container}>
        <View style={styles.informationContainer} >
          <Image style={styles.profilePicture} source={{ uri: competition.profile_picture }} width={20} height={40} />
          <View style={styles.userCompetition} >
            <Text style={styles.username}>
              {competition.name.length > 5 ? `${competition.name.substring(0, 5)}...` : competition.name}
            </Text>
            <View style={styles.competitionPoinstContainer} >
              <Text style={styles.competitionPoints} >{opponentCompetitionPlaysScore}</Text>
              <Competition width={20} height={20} />
              <Text style={styles.competitionPoints} >{competitionPlaysScore}</Text>
            </View>
            <View />
          </View>
        </View>
        <View style={styles.baseline2} />
      </View>
    );
  } else if (!notifications && other) {
    return (
      <View style={styles.container}>
        <View style={styles.informationContainer} >
          <Image style={styles.profilePicture} source={{ uri: competition.profile_picture }} width={20} height={40} />
          <View style={styles.userCompetition} >
            <Text style={[styles.username, styles.usernameOther]}>
              {competition.name.length > 5 ? `${competition.name.substring(0, 5)}...` : competition.name}
            </Text>
            <View style={[styles.competitionPoinstContainer, styles.competitionPoinstContainerOther]} >
              <Text style={styles.competitionPoints} >{opponentCompetitionPlaysScore}</Text>
              <Competition width={20} height={20} />
              <Text style={styles.competitionPoints} >{competitionPlaysScore}</Text>
            </View>
            <Text style={styleStatusValidate(competition?.reto_status, competition?.resultado)} >{competition?.reto_status.toLocaleUpperCase() === 'COMPLETADO' ? competition?.resultado.toLocaleUpperCase() : competition?.reto_status.toLocaleUpperCase() === 'ACEPTADO' ? 'EN CURSO' : competition?.reto_status.toLocaleUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.baseline2} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
  },
  informationContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    gap: 10,
  },
  profilePicture: {
    flex: 1.8,
  },
  userInformation: {
    flex: 14,
    paddingHorizontal: 5,
  },
  username: {
    color: colors.secondary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlignVertical: 'center',
    marginBottom: '2%',
  },
  competitionPoinstContainer: {
    flexDirection: 'row',
  },
  intivationText: {
    color: colors.secondary,
    fontSize: fontSizes.xs,
  },
  aceptDeclineContainer: {
    flex: 4,
    flexDirection: 'row',
  },
  accept: {
    flex: 1,
  },
  adecline: {
    flex: 1,
  },
  baseline: {
    borderWidth: 1,
    backgroundColor: colors.secondary,
    marginLeft: '16%',
    marginRight: '22%',
  },
  userCompetition: {
    flexDirection: 'row',
    flex: 14,
    gap: 10,
    justifyContent: 'space-between',
  },
  usernameOther: {
    flex: 1,
  },
  competitionPoinstContainerOther: {
    flex: 1,
  },
  competitionPoints: {
    fontFamily: fonts.press,
    color: colors.secondary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: fontSizes.xs,
  },
  competitionStatus: {
    flex: 1,
    color: colors.secondary,
    fontFamily: fonts.press,
    fontSize: fontSizes.xxxxs,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  baseline2: {
    borderWidth: 1,
    backgroundColor: colors.secondary,
    marginLeft: '16%',
    marginRight: '5%',
  },
});

export default CompetitionCard;
