import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales


const loginStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        color: '#fff',
    },
    containerMax: {
        backgroundColor: colors.background3,
    },
    containerLogin: {
        flex: 1,
        backgroundColor: '#000',
        color: '#fff',
        justifyContent: 'space-between',
        height: '100%',
        borderWidth: 1,
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
        flex: 1,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        marginTop: spacing.md,
    },
    titleLogin: {
        fontSize: fontSizes.xl,
        color: colors.primary,
        fontFamily: fonts.press,
        textAlign: 'center',
    },

    // Botones de Inicio de Sesion

    botonLogin: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        width: '35%',
        padding: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',

    },
    containerButtons: {
        marginTop: spacing.lg,
        flexDirection: 'row',
        width: '100%',
        padding: spacing.md,
        justifyContent: 'space-evenly',
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
