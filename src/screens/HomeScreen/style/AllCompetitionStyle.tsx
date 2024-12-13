import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../../global-class'; // Importa las variables globales

const HomeStyles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    backgroundColor: colors.background2,
    width: '100%',
    marginBottom: '10%',
    padding: 10,
  },
  container: {
    backgroundColor: colors.background3,
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  goBackButton: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  containerCompetitions: {
    margin: 10,
  },
  notFound: {
    color: colors.secondary,
    fontFamily: fonts.inter,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default HomeStyles;
