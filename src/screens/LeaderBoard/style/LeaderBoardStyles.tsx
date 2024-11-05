import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const LeaderBoardStyles = StyleSheet.create({
    containerScroll: {
        flex: 1,
        backgroundColor: colors.background2,
        width: '100%',
    },
    containerTitle: {
        justifyContent: 'center',
        margin: spacing.md,
    },
    title: {
        color: colors.primary,
        fontSize: fontSizes.md,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    containerLeaderrboardTime: {
        marginTop: spacing.md,
        alignSelf: 'center',
    },
    timeOption: {
        backgroundColor: colors.background4,
        width: '100%',
        paddingTop: spacing.xs,
        paddingBottom: spacing.xs,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        borderRadius: 10,
        fontSize: fontSizes.sm,
        fontWeight: '400',
        color: colors.primary
    },
    containerPosition: {
        backgroundColor: colors.background5,
        margin: spacing.md,
        padding: spacing.sm,
        borderRadius: 15,
        flexDirection: 'row',
    },
    positionNumber: {
        padding: spacing.sm,
        backgroundColor: colors.background6,
        borderRadius: 15,
        fontSize: fontSizes.sm,
        color: colors.primary,
        fontWeight: '700',
        flex: 1,
        marginRight: spacing.sm,
    },
    positionDescription: {
        fontSize: fontSizes.md,
        marginLeft: spacing.sm,
        fontWeight: '700',
        color: colors.primary,
        flex: 15,
    },
    containerPositions: {
        
    },
});

export default LeaderBoardStyles;
