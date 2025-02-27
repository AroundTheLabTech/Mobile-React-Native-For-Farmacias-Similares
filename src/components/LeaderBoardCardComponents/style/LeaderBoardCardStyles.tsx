import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '../../../../global-class'; // Importa las variables globales

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
        height: spacing.md,
        width: spacing.md,
        margin: spacing.sm,
        color: colors.secondary,
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
        color: colors.secondary,
    },
    profilePicture : {
        width: 40,
        height: 40,
        borderRadius: 40,
        top: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    flagPicture: {
        width: 20,
        height: 20,
        borderRadius: 20,
        top: -7,
        right: -22,
    },
});

export default LeaderBoardCardStyles;
