import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const ProfileStyles = StyleSheet.create({
  //Profile Image 
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
    justifyContent: 'space-around',
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
  },

  // Estadisticas
  containerBoxStadistics: {
    width: '45%',
    backgroundColor: '#fff',
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
    fontSize: fontSizes.xxxxl,
    color: colors.secondary,
  },
  textBox: {
    color: colors.secondary,
    fontWeight: '500',
  },
  rowStadistics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  TabNabTitle: {
    fontSize: fontSizes.sm,
    textTransform: 'capitalize',
    fontWeight: '700',
    color: colors.third,
  },

  TabNabTitleSelected: {
    fontSize: fontSizes.sm,
    textTransform: 'capitalize',
    fontWeight: '700',
    color: colors.textThird,
  },
});

export default ProfileStyles;
