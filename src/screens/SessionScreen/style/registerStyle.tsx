import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales


const loginStyles = StyleSheet.create({

    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        color: '#fff',
    },
    containerLogin: {
        flex: 1,
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'space-between',
    },
    headerContainer: {
        backgroundColor: colors.fourd,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: spacing.md,
    },
    headerMedal: {
        width: 35,
        height: 35,
    },

    //Title

    containerTitle: {
        marginTop: spacing.md,
        flex: 1,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    },
    titleLogin: {
        fontSize: fontSizes.xl,
        color: colors.primary,
        fontFamily: fonts.press,
        textAlign: 'center',
    },

    // Botones de Inicio de Sesion
    containerLoginButtons: {
        marginTop: spacing.lg,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        justifyContent: 'space-evenly',
    },
    botonLogin: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        width: '45%',
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerButtons: {
        // borderWidth: 1,
        // borderColor: '#FFFFFF',
        // marginTop: spacing.lg,
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        paddingHorizontal: spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    textoButtons: {
        color: colors.primary,
        fontFamily: fonts.press,
        textAlign: 'center',
        fontSize: fontSizes.sm,
    },

    // Forms
    containerForms: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    input: {
        width: '80%',
        color: colors.primary,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
        fontFamily: fonts.press,
    },

    placeHolder: {
        color: colors.primary,
        textAlign: 'left',
        fontFamily: fonts.press,
        fontSize: fontSizes.xs,
    },
    containerPlaceHolder: {
        width: '80%',
    },
});

export default loginStyles;
