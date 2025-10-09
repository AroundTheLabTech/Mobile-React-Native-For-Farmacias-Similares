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
    width: 120,
    height: 120,
    marginHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameCard9Inche: {
    width: 210,
    height: 210,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  coverImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  coverImage9Inches: {
    width: 200,
    height: 200,
  },
});

export default GamesStyles;
