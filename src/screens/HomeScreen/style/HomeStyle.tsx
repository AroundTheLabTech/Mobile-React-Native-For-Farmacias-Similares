import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const HomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background2,
        width: '100%',
        padding: spacing.md,
        fontFamily: fonts.bold,
      },

      containerScroll:{
        flex: 1,
        backgroundColor: colors.background2,
        width: '100%',
      },

    //   Header Profile

    containerHeaderProfile:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textSaludo:{
        color: '#FFD6DD',
        fontWeight: '600',   
    },
    textUsuario:{
        color: colors.primary,
        fontSize: fontSizes.xxl,
        fontWeight: '600',
    },
    // Juego Reciente
    recienteContainer:{
        backgroundColor: '#FFCCD5',
        padding: spacing.md,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 15,
        marginTop: spacing.sm,
        flexDirection: 'row',

    },
    nuevoJuego:{
        color: '#660012', 
        fontFamily: fonts.rubik,
        fontWeight: '600',
        fontSize: fontSizes.lg,
    },
    titleJuego:{
        color: '#660012',
        fontWeight: '700',
        fontSize: fontSizes.xxl,
        marginLeft: spacing.md,
    },
    containerTitleGameNew:{
        flexDirection: 'row',
        width: '100%',
        marginTop: spacing.sm
    },
    imageTitleGameNew:{
    },
    columnLeft:{
        width: '85%',
    },
    columnRight:{
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    }, 

    //Referidos Container

    containerReferidos:{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTitleReferidos:{
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleReferidos:{
        color: colors.primary,
        fontFamily: fonts.rubik,
        fontWeight: '600',
        fontSize: fontSizes.xxl,
    },
    subtitleReferidos:{
        color: colors.primary,
        fontWeight: '700',
        textAlign: 'center',
        fontSize: fontSizes.xxl,
        marginTop: spacing.sm,
    },
    // Boton Invitar

    botonInvitar:{
        width: '42%',
        backgroundColor: colors.background3,
        padding: spacing.md,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 15,
        marginTop: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textoBoton:{
        color: colors.background2,
        fontFamily: fonts.rubik,
        fontWeight: '800',
        fontSize: fontSizes.lg
    },
    // Games Section
    containerGamesSection:{
        backgroundColor: colors.background3,
        padding: spacing.md,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: '100%',
    },
    containerTitleGames: {
        flexDirection: 'row',
        justifyContent: 'space-between',   
    },
    titleSectionGames:{
        fontWeight: '700',
        fontSize: fontSizes.lg,
        color: colors.secondary,
    },

    //ContainerGames
    containerGame:{
        width: '100%',
        padding: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'rgba(239, 238, 239, 1)', // Color #EFEEF con 90% de opacidad
        borderWidth: 1,
        borderRadius: 15,
        marginTop: spacing.md,        

    },

    titleGame:{
        width: '70%',
    },
    imageGame:{
        width: '10%',
    },
    imageGameImg:{
        width: '14%',
    },
    playIconContainer:{

    },
    gameTitle:{
        fontWeight: '800',
        fontFamily: fonts.rubik,
        fontSize: fontSizes.xl,
        color: colors.secondary,
    }
});

export default HomeStyles;
