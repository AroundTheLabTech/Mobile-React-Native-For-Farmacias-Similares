import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, fonts, fontSizes } from '../../../global-class';
import { TCompetition } from 'src/types/competition';

import Check from '@img/iconos/check.svg';
import Trash from '@img/iconos/trash.svg';
import Competition from '@img/iconos/competition.svg';

import { useAuth } from '../../AuthContext';
import { putRejectCompetition, putAcceptCompetition } from '@services/backend';

interface ICompetitionCard {
  competition: TCompetition
  notifications: boolean
  closeModal: () => void
}

const CompetitionCard: React.FC<ICompetitionCard> = ({ competition, notifications = false, closeModal }) => {

  const { uid } = useAuth();

  async function handleReject() {
    console.log('Rechazar');

    await putRejectCompetition(uid, competition.UID, competition.id);
    closeModal();
  }

  async function handleApprove() {
    console.log('Aprobar');

    await putAcceptCompetition(uid, competition.UID, competition.id);
    closeModal();
  }

  if (notifications) {
    return (
      <View style={styles.container}>
        <View style={styles.informationContainer} >
          <Image style={styles.profilePicture} source={{ uri: competition.profile_picture }} width={20} height={30} />
          <View style={styles.userInformation} >
            <Text style={styles.username} >{competition.name}</Text>
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
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.informationContainer} >
          <Image style={styles.profilePicture} source={{ uri: competition.profile_picture }} width={20} height={40} />
          <View style={styles.userCompetition} >
            <Text style={styles.username} >{competition.name}</Text>
            <Text style={styles.competitionPoints} >1000</Text>
            <Competition width={20} height={20} />
            <Text style={styles.competitionPoints} >2000</Text>
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
    flex: 2.3,
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
  },
  competitionPoints: {
    fontFamily: fonts.press,
    color: colors.secondary,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: fontSizes.xs,
  },
  baseline2: {
    borderWidth: 1,
    backgroundColor: colors.secondary,
    marginLeft: '16%',
    marginRight: '5%',
  },
});

export default CompetitionCard;
