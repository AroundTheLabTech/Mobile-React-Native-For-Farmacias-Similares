import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const StadiscticsStyle = StyleSheet.create({
  containerMax: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  container: {
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.xl,
  },
  headerProfile: {
    padding: spacing.lg,
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
  },
  //Profile Image
  profileImageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15%',
  },
  imageProfile: {
    resizeMode: 'contain',
    width: '100%',
    height: 150,
    zIndex: 1000,
  },

  optionsRangeButton: {
    width: '20%',
  },
  optionsRange: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 34,
    width: 92,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  //Dashboard
  containerDashboard: {
    width: '97%',
    backgroundColor: colors.background3,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: '-10%',
    height: '100%',
  },
  TextProfile: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.secondary,
    fontFamily: fonts.rubik,
    marginTop: spacing.sxxl,
  },
  //Puntaje
  ContainerPuntaje: {
    backgroundColor: colors.background2,
    padding: spacing.md,
    width: '100%',
    marginTop: spacing.md,
    borderRadius: 20,
    flexDirection: 'row',
  },
  puntajeBox: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
  },
  puntajeBox2: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titlePuntaje: {
    color: 'rgba(255, 255, 255, 0.4)', // Color blanco con 40% de opacidad
    fontSize: fontSizes.md,
  },
  puntajeNumber: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: fontSizes.xl,
  },
  containerIcono: {
  },

  //Insignias, Estadisticas, Detalles
  containerPuntaje: {
    marginTop: spacing.lg,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerNavBar: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  //Insignias
  containerInsignias: {
    width: '100%',
  },
  rowInsignias: {
    flexDirection: 'row',
    marginTop: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerImage: {
    width: '30%',
  },
  medalStyle: {
    resizeMode: 'contain',
    width: '100%',
  },

  //Estadisticas

  containerEstadistics: {
    backgroundColor: '#D9D4F7',
    width: '100%',
    borderRadius: 15,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  titleTotalGames: {
    textAlign: 'center',
    color: colors.secondary,
    fontWeight: '700',
    padding: spacing.md,
    fontSize: fontSizes.xxl,
    flex: 1,
  },

  // Estadisticas
  containerBestPlay: {
    width: '45%',
    backgroundColor: colors.background3,
    padding: spacing.sm,
    marginTop: spacing.md,
    borderRadius: 15,

  },
  containerBestGame: {
    width: '45%',
    backgroundColor: colors.background2,
    padding: spacing.sm,
    marginTop: spacing.md,
    borderRadius: 15,

  },
  // Up Number

  containerUpNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  titleNumber: {
    fontWeight: '800',
    fontSize: fontSizes.mxxl,
    color: colors.secondary,
  },
  colorPrimary: {
    color: colors.primary,
  },
  textBox: {
    color: colors.secondary,
    fontWeight: '500',
  },
  rowStadistics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },

  ringChartContainer: {
    alignItems: 'center',
    height: 200,
    flex: 2,
  },
  ringChartContainer9Inches: {
    height: 400,
  },
  ringChartView: {
    alignItems: 'center',
  },
  ringChartText: {
    fontSize: fontSizes.mxxl,
    color: colors.secondary,
    fontWeight: '800',
  },
  totalText: {
    fontSize: fontSizes.lg,
  },
  bestGameContainer: {
    backgroundColor: colors.background2,
  },

  containerChartStadistics: {
    backgroundColor: colors.background2,
    width: '100%',
    borderRadius: 15,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },

  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleStadisticsChart: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.primary,
  },

  stadisticsIconContainer: {
    backgroundColor: colors.background4,
    borderRadius: 10,
    padding: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  barChartContainer: {
    paddingTop: 20,
  },
});

export default StadiscticsStyle;
