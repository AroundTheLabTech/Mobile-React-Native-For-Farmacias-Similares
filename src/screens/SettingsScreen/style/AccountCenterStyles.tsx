import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const AccountCenterStyles = StyleSheet.create({
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
    marginLeft: spacing.lg,
    width: '100%',
    flex: 0.2,
  },
  accountCenterTitle: {
    flex: 0.3,
    textAlign: 'left',
    width: '100%',
    paddingLeft: spacing.md,
    textAlignVertical: 'center',
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.secondary,
  },
  containerTableInformation: {
    marginTop: spacing.md,
    flex: 3,
    width: '100%',
  },
  containerRowTable: {
    flexDirection: 'row',
  },
  tableLabel: {
    paddingLeft: spacing.md,
    flex: 1,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.secondary,
  },
  tableValue: {
    paddingRight: spacing.md,
    flex: 1,
    color: colors.secondary,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  containerSave: {
    flex: 1,
    width: '100%',
    paddingRight: spacing.md,
    paddingLeft: spacing.md,
    alignItems: 'flex-end',
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
});

export default AccountCenterStyles;
