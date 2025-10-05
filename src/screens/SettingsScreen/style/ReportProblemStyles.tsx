import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '../../../../global-class'; // Importa las variables globales

const ReportProblemStyles = StyleSheet.create({
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
    flex: 0.2,
  },
  reportProblemTitle: {
    flex: 0.5,
    textAlign: 'left',
    width: '100%',
    paddingLeft: spacing.md,
    textAlignVertical: 'center',
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.secondary,
  },
  containerForm: {
    width: '100%',
    flex: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  containerInput: {
    marginBottom: spacing.md,
  },
  formLabel: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    height: spacing.lg,
    color: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: fontSizes.sm,
    textAlignVertical: 'center',
  },
  formTextArea: {
    color: colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: 'top',
    paddingHorizontal: spacing.sm,
  },
  containerSave: {
    flex: 1,
    width: '100%',
    paddingRight: spacing.md,
    paddingLeft: spacing.md,
    alignItems: 'flex-end',
    marginVertical: spacing.lg,
  },
  containerButtonSave: {
    width: '40%',
    backgroundColor: colors.background2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 10,
  },
  buttonSaveText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  containerInfo: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    flex: 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  linkText: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: spacing.xs,
  },
  reportedProblemContainer: {
    backgroundColor: colors.background2,
    width: '100%',
    borderRadius: 15,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  reportedProblemTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  reportedProblemItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background4,
    paddingVertical: spacing.sm,
  },
  reportedProblemDate: {
    fontSize: fontSizes.xs,
    color: colors.secondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  reportedProblemIssue: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  reportedProblemDescription: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    fontWeight: '400',
  },
});

export default ReportProblemStyles;
