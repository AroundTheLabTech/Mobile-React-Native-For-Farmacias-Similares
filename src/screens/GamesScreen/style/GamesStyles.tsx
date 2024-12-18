import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../global-class'; // Importa las variables globales

const GamesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  containerMax: {
    backgroundColor: colors.background2,
  },
  containerGoBack: {
    marginTop: spacing.md,
    marginLeft: spacing.lg,
    width: '100%',
  },
  containerGames: {
    marginTop: spacing.lg,
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    alignContent: 'flex-start',
    justifyContent: 'center',
  },
  gameCard: {
    width: 160,
    height: 160,
    marginHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameCard9Inche: {
    width: 260,
    height: 260,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  coverImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  coverImage9Inches: {
    width: 250,
    height: 250,
  },
});

export default GamesStyles;
