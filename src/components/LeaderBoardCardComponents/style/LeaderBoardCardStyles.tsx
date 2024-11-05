import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const LeaderBoardCardStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.background3,
        borderRadius: 10,
        flexDirection: 'row',
        margin: spacing.xs,
        alignItems: 'center',
    },
    containerPosition: {
        flex: 3,
    },
    position: {
        fontSize: fontSizes.xxxs,
        borderRadius: 100,
        borderWidth: 0.5,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: 20,
        width: 20,
        margin: spacing.sm,
    },
    containerInformation: {
        flex: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerProfileImages: {
        height: 70,
    },
    containerSubInformation: {
        marginLeft: spacing.sm,
    },
    name: {
        fontSize: fontSizes.sm,
        fontWeight: '700',
        color: colors.secondary,
    },
    points: {
        fontSize: fontSizes.xs,
    },
});

export default LeaderBoardCardStyles;
