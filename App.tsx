import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Un solo diseño para web y app: la app abre la web por dentro (mismo catálogo, ranking, perfil y
// juegos). Ver src/screens/WebShell/WebShell.tsx y src/config/web.ts.
//
// Las pantallas propias de antes están en AppClasica.tsx y aquí NO se importan: así no entran en la
// app (sus imágenes pesaban la mitad del APK). Para volver a ellas, este archivo se cambia por:
//   export { default } from './AppClasica';
import WebShell from './src/screens/WebShell/WebShell';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0E0A1F" />
        <WebShell />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0A1F',
  },
});
