import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TextInput, GestureResponderEvent } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '../../../../global-class';

const CompetitionModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const currentPoints = 1000;
  const [basePoints, setBasePoints] = useState(Math.floor(currentPoints / 100) * 100);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  function handleUpdatePoints(e: GestureResponderEvent, points: number) {
    e.preventDefault();

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
                <Image source={require('@img/iconos/bell.png')} />
              </View>
              <Text style={styles.modalText}>COMPITE CON UN COMPAÑERO</Text>
              <View style={styles.formContainer} >
                <Text style={styles.label} >Correo electrónico</Text>
                <TextInput style={styles.input} placeholder="Ingrese su mail" />
                <View style={styles.competitionSystem} >
                  <Text style={styles.basePoints} >
                    {currentPoints}
                  </Text>
                  <View style={styles.competitionOptions} >
                    <TouchableOpacity style={styles.subtractPlus} onPress={(event) => handleUpdatePoints(event, basePoints - 100)} >
                      <Text style={styles.subtractPlusText} >-100</Text>
                    </TouchableOpacity>
                    <Text style={styles.pointsText} >
                      {basePoints} <Image source={require('@img/iconos/moneda.png')} />
                    </Text>
                    <TouchableOpacity style={styles.subtractPlus} onPress={(event) => handleUpdatePoints(event, basePoints + 100)} >
                      <Text style={styles.subtractPlusText} >+100</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.competitionButton} >
                    <Text style={styles.competitionText} >COMPETIR</Text>
                  </TouchableOpacity>
                </View>
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
  modalContainer: {
    top: 5,
    width: '100%',
    backgroundColor: colors.background3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
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
});

export default CompetitionModal;
