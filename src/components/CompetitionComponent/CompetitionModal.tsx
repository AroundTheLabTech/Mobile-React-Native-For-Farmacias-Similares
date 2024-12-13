import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, GestureResponderEvent, Alert } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../../global-class';
import { useUser } from '@services/UserContext';
import { getCompetitiveStatus, getListAvalibleCompetition, getListCompetitionNotification, postCreateCompetition } from '@services/backend';
import { TCompetition, TCreateCompetition } from 'src/types/competition';
import { useAuth } from '../../AuthContext';
import CompetitionCard from '@components/CompetitionCard/CompetitionCard';
import Loader from '@components/LoaderComponent/Loader';

const CompetitionModal = ({ navigation }) => {

  const { uid } = useAuth();

  const { userPoints, setUpdateUserPoints, userInformation, setUpdateUserInformation } = useUser();

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<number>(userPoints?.score_total > 1000 ? 1000 : 100);
  const [basePoints, setBasePoints] = useState(Math.floor(currentPoints / 100) * 100);

  const [opponentEmail, setOpponentEmail] = useState<string>();
  const [competitions, setCompetitions] = useState<TCompetition[]>();
  const [activeCompetitions, setActiveCompetitions] = useState<TCompetition[]>();

  const [notifications, setNotifications] = useState(false);

  const [isEmailRequired, setIsEmailRequired] = useState<boolean>(false);

  const openModal = () => {
    setCurrentPoints(userPoints?.score_total > 1000 ? 1000 : 100);
    setModalVisible(true);
  };

  const closeModal = () => {
    setOpponentEmail(null);
    setModalVisible(false);
  };

  function handleUpdatePoints(e: GestureResponderEvent, points: number) {
    e.preventDefault();

    if (userPoints?.score_total && userPoints?.score_total > 99) {
      setCurrentPoints(userPoints.score_total);
    }

    if (points % 100 !== 0) {
      points = Math.floor(points / 100) * 100;
    }

    if (points < 100) {
      setBasePoints(100);
      return;
    }

    const maxPoints = Math.floor(currentPoints / 100) * 100;

    if (points > maxPoints) {
      setBasePoints(maxPoints);
      return;
    }

    setBasePoints(points);
  }

  async function handleCreateCompetition() {
    if (!opponentEmail) {
      setIsEmailRequired(true);
    } else if (opponentEmail && userInformation?.email && basePoints && userPoints?.uid) {

      if (opponentEmail !== userInformation.email) {
        setIsEmailRequired(false);
        const createCompetition: TCreateCompetition = {
          sender_email: userInformation?.email,
          score: basePoints,
          target_email: opponentEmail,
          sender_uid: uid,
        };

        const response = await postCreateCompetition(createCompetition);

        if (response?.message) {
          setUpdateUserPoints(true);
          closeModal();
        } else {
          Alert.alert('Error', 'No se puede competir con este jugador');
        }
      }
    } else {
      Alert.alert('Error', 'Algo no salío bien');
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getListCompetitionNotification(uid);

      setCompetitions(response);
    }

    fetchData();
  }, [uid, isModalVisible]);

  useEffect(() => {
    async function fetchData() {
      const response = await getListAvalibleCompetition(uid);

      response.forEach(async (competition) => {
        await getCompetitiveStatus(uid, competition.UID, competition.id);
      });

      setActiveCompetitions(response);
    }

    fetchData();
  }, [uid, isModalVisible]);

  useEffect(() => {
    if (!userInformation) {
      setUpdateUserInformation(true);
    } else {
      setUpdateUserInformation(false);
    }
  }, [setUpdateUserInformation, uid, userInformation]);

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
      if (userPoints?.score_total && userPoints?.score_total >= 100) {

        if (!Number.isNaN(userPoints?.score_total)) {
          setCurrentPoints(userPoints?.score_total);
          setBasePoints(Math.floor(currentPoints / 100) * 100);
        } else {
          setCurrentPoints(100);
          setBasePoints(Math.floor(currentPoints / 100) * 100);
        }
      }
    } else {
      setUpdateUserPoints(false);
    }
  }, [currentPoints, setUpdateUserPoints, uid, userPoints]);

  if (!userPoints) {
    return <Loader visible />;
  }

  if (!userPoints || userPoints.score_total < 100) {
    return (
      <View style={styles.container}>
        {/* Botón para abrir el modal */}
        <TouchableOpacity style={styles.openButton} onPress={openModal}>
          <Text style={styles.buttonText}>COMPETIR</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainerShadown} >
              <View style={styles.modalContainer}>
                <View style={styles.bellContainer} >
                  {/* Botón para cerrar el modal */}
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.buttonText}>X</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Parece que no cuentas con puntaje necesario para competir!</Text>
                <View style={styles.competitionsContainer} >
                  {
                    !notifications &&
                    <Text style={styles.informationTitle} >COMPETENCIAS ACTIVAS</Text>
                  }
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('AllCompetitionMain');
                    closeModal();
                  }} >
                    <Text style={styles.seeMore} >Ver más</Text>
                  </TouchableOpacity>
                  {
                    !notifications && activeCompetitions?.length > 0 &&
                    <View style={styles.competitionsCard} >
                      {
                        activeCompetitions.map(competition => {
                          return (
                            <CompetitionCard key={competition.UID} competition={competition} notifications={false} ejectFunction={closeModal} />
                          );
                        })
                      }
                    </View>
                  }
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón para abrir el modal */}
      <TouchableOpacity style={styles.openButton} onPress={openModal}>
        <Text style={styles.buttonText}>COMPETIR</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerShadown} >
            <View style={styles.modalContainer} >
              <View style={styles.modalInformation} >
                <View style={styles.bellContainer} >
                  {/* Botón para cerrar el modal */}
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.buttonText}>X</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.notificationsContainer} onPress={() => setNotifications(!notifications)} >
                    <Image source={require('../../../img/iconos/bell.png')} />
                    {
                      competitions && competitions.length > 0 && (
                        <Text style={styles.competitionNotificationCounter} >{competitions.length}</Text>
                      )
                    }
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>COMPITE CON UN COMPAÑERO</Text>
                <View style={styles.formContainer} >
                  <Text style={styles.label} >Correo electrónico</Text>
                  <TextInput style={isEmailRequired ? styles.inputRed : styles.input} placeholder="Ingrese su mail" onChangeText={setOpponentEmail} />
                  <View style={styles.competitionSystem} >
                    <Text style={styles.basePoints} >
                      {userPoints?.score_total}
                    </Text>
                    <View style={styles.competitionOptions} >
                      <TouchableOpacity style={styles.subtractPlus} onPress={(event) => handleUpdatePoints(event, basePoints - 100)} >
                        <Text style={styles.subtractPlusText} >-100</Text>
                      </TouchableOpacity>
                      <Text style={styles.pointsText} >
                        {basePoints} < Image source={require('../../../img/iconos/moneda.png')} />
                      </Text>
                      <TouchableOpacity style={styles.subtractPlus} onPress={(event) => handleUpdatePoints(event, basePoints + 100)} >
                        <Text style={styles.subtractPlusText} >+100</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity disabled={userPoints?.score_total.length < 100 ? true : false} style={styles.competitionButton} onPress={handleCreateCompetition} >
                      <Text style={styles.competitionText} >COMPETIR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.competitionsContainer} >
                {
                  notifications ?
                    <Text style={styles.informationTitle} >NOTIFICACIONES</Text> :
                    <Text style={styles.informationTitle} >COMPETENCIAS ACTIVAS</Text>
                }
                <TouchableOpacity onPress={() => {
                  navigation.navigate('AllCompetitionMain');
                  closeModal();
                }} >
                  <Text style={styles.seeMore} >Ver más</Text>
                </TouchableOpacity>
                {
                  !notifications && activeCompetitions?.length > 0 ?
                    <View style={styles.competitionsCard} >
                      {
                        activeCompetitions.map(competition => {
                          return (
                            <CompetitionCard key={competition.UID} competition={competition} notifications={false} ejectFunction={closeModal} />
                          );
                        })
                      }
                    </View> :
                    notifications && competitions?.length > 0 ?
                      <View style={styles.competitionsCard} >
                        {
                          competitions.map(competition => {
                            return (
                              <CompetitionCard key={competition.UID} competition={competition} notifications={true} ejectFunction={closeModal} />
                            );
                          })
                        }
                      </View> :
                      <Text style={styles.informationTitle} >No hay competiciones para mostrar!</Text>
                }
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: colors.background7,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.secondary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  notificationsContainer: {},
  competitionNotificationCounter: {
    color: colors.primary,
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    width: fontSizes.sm,
    height: fontSizes.sm,
    fontSize: fontSizes.xxs,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerShadown: {
    backgroundColor: colors.background1,
    width: '100%',
    borderRadius: 20,
  },
  modalInformation: {
    top: 5,
    width: '100%',
    backgroundColor: colors.background3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
  modalContainer: {
    top: 5,
    width: '100%',
    backgroundColor: colors.background3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
  },
  bellContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalText: {
    fontSize: fontSizes.xxl,
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: fonts.rubik,
    fontWeight: 'bold',
  },
  formContainer: {
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    textAlign: 'left',
    fontSize: fontSizes.xxs,
    color: colors.secondary,
    marginBottom: spacing.sm,
    fontFamily: fonts.press,
  },
  input: {
    borderWidth: 1,
    padding: 0,
    paddingLeft: 5,
    marginBottom: spacing.sm,
    borderRadius: 5,
    color: colors.secondary,
  },
  inputRed: {
    borderWidth: 1,
    padding: 0,
    paddingLeft: 5,
    marginBottom: spacing.sm,
    borderRadius: 5,
    color: colors.secondary,
    borderColor: 'red',
  },
  competitionSystem: {
    alignItems: 'center',
  },
  basePoints: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
  },
  competitionOptions: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  subtractPlus: {
    backgroundColor: colors.background1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  subtractPlusText: {
    color: colors.primary,
  },
  pointsText: {
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.inter,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  competitionButton: {
    backgroundColor: colors.background1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 15,
    marginBottom: spacing.md,
  },
  competitionText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: 'regular',
    textAlign: 'center',
    fontFamily: fonts.press,
    textAlignVertical: 'center',
    paddingTop: spacing.sm,
  },
  informationTitle: {
    color: colors.secondary,
    fontFamily: fonts.rubik,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seeMore: {
    color: colors.secondary,
  },
  competitionsContainer: {
    width: '100%',
    padding: '5%',
    gap: 20,
  },
  competitionsCard: {
    backgroundColor: colors.background7,
    borderRadius: 10,
    padding: 10,
  },
});

export default CompetitionModal;
