module.exports = {
  assets: ['./assets/fonts'],
  dependencies: {
    // La app no vende nada dentro (muestra la web): react-native-iap no se usa en ningún archivo. En Android
    // metía la Biblioteca de Facturación Play 7 y Google Play ya exige la 8 o ninguna (10 nov 2026: rechazó la
    // versión 14 por eso). Se deja fuera de Android; iOS no cambia.
    'react-native-iap': {platforms: {android: null}},
  },
};
