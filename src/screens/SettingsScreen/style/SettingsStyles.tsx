import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts, responsiveWidth, responsiveHeight } from '../../../../global-class'; // Importa las variables globales

const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  containerMax: {
    backgroundColor: colors.background2,
  },
  containerSettings: {
    backgroundColor: colors.background3,
    borderRadius: 50,
    marginTop: spacing.lg,
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
    alignItems: 'center',
    height: '100%',
  },
  containerGoBack: {
    marginTop: spacing.md,
    marginLeft: spacing.xxl,
    width: '100%',
  },
  containerProfileInformation: {
    alignItems: 'center',
    width: '100%',
  },
  containerProfilePicture: {
    height: spacing.xl,
  },
  profilePicture: {
    top: responsiveWidth(-50),
    width: responsiveWidth(60),
    height: responsiveHeight(100),
  },
  containerAccountInformation: {
    backgroundColor: colors.background2,
    width: '95%',
    borderRadius: 25,
    marginBottom: spacing.sm,
    padding: spacing.md,
    flexDirection: 'row',
  },
  accountInformationLeft: {
    flex: 2,
    alignItems: 'flex-start',
  },
  accountCardText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.primary,
    fontFamily: fonts.press,
  },
  accountUsername: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.primary,
  },
  accountUserNumber: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  accountInformationRigth: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  simiAccountImage: {
    width: 50,
    height: 50,
  },
  userPoints: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    backgroundColor: colors.background3,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
    color: colors.secondary,
    fontFamily: fonts.press,
  },
  containerSettingsOption: {
    borderWidth: 1,
    width: '95%',
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  containerSettingsOptionTexts: {
    flexDirection: 'row',
  },
  containerAccountCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountCenterButtonIcon: {
    flex: 1,
    marginRight: spacing.xs,
  },
  containerAccountCenterButtonText: {
    flex: 2,
  },
  accountCenterButtonTitle: {
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'center',
  },
  accountCenterButtonSubtite: {
    color: colors.secondary,
    textAlign: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  otherOptionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  settingOptionsIcon: {
    flex: 1,
  },
  settingOptionsText: {
    flex: 2,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.secondary,
  },
  settingOptionsBackIcon: {
    flex: 1,
  },
});

export default ProfileStyles;
