const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

// Obtén la configuración predeterminada de Metro
const defaultConfig = getDefaultConfig(__dirname);

// Configuración personalizada para el transformador de SVG
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Agrega el transformador de SVG
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), // Elimina 'svg' de assetExts
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'], // Agrega 'svg' a sourceExts
  },
};

// Exporta la configuración fusionada
module.exports = mergeConfig(defaultConfig, config);
