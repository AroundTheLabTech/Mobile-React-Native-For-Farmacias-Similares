import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../../global-class'; // Importa las variables globales

const MainLayoutStyles = StyleSheet.create({
  containerMax: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  container: {
    backgroundColor: colors.background2,
    alignItems: 'center',
  },
  headerProfile: {
    padding: spacing.lg,
    width: '100%',
    alignItems: 'flex-end',
  },
});

export default MainLayoutStyles;
