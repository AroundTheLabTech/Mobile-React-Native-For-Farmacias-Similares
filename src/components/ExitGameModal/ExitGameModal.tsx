import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { darkTheme } from '../../theme/colors';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch {}

type Props = {
  visible: boolean;
  pendingPoints: number;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  onDismiss: () => void;
};

const ExitGameModal: React.FC<Props> = ({
  visible,
  pendingPoints,
  onSaveAndExit,
  onExitWithoutSaving,
  onDismiss,
}) => (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
    <Pressable style={styles.backdrop} onPress={onDismiss}>
      <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
        <Text style={styles.title}>¿Salir de la partida?</Text>
        <Text style={styles.body}>
          Tienes {pendingPoints} punto{pendingPoints === 1 ? '' : 's'} sin guardar.
        </Text>

        <Pressable onPress={onSaveAndExit} style={styles.primaryWrapper}>
          {LinearGradient ? (
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>Guardar y salir</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.primary, { backgroundColor: darkTheme.purple }]}>
              <Text style={styles.primaryText}>Guardar y salir</Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={onExitWithoutSaving} style={styles.secondary}>
          <Text style={styles.secondaryText}>Salir sin guardar</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(20,20,30,0.97)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    padding: 20,
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 4,
  },
  primaryWrapper: {
    marginTop: 4,
  },
  primary: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExitGameModal;
