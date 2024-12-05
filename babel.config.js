module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        'moduleName': '@env',
        'path': '.env',
        'blocklist': null,
        'allowlist': null,
        'safe': false,
        'allowUndefined': true,
        'verbose': false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@app': './src/app',
          '@application': './src/application',
          '@domain': './src/domain',
          '@infrastructure': './src/infrastructure',
          '@shared': './src/shared',
          '@ui': './src/ui',
          '@assets': './assets',
          '@img': './img',
        },
      },
    ],
  ],
};
