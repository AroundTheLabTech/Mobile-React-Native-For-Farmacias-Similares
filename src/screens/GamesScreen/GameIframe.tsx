import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const GameIframe = ({ navigation, route }) => {
  const { gameUrl } = route.params;
  const [puntuacion, setPuntuacion] = useState<number>(0);

  const handleMessage = (event) => {
    console.log('Mensaje recibido del iframe:', event.nativeEvent.data);
    const message = JSON.parse(event.nativeEvent.data);

    if (message.score !== undefined) {
      console.log('Puntuación recibida:', message.score);
      setPuntuacion(message.score);
      alert(`Puntuacion: "${message.score}`)
    }
  };

  const injectedJS = `
    (function() {
      window.addEventListener('message', (event) => {
        if (event.data.score !== undefined) {
          window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
        }
      });
      console.log('Script de escucha de mensajes inyectado.');
    })();
  `;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.container}>
      <Text>Puntuacion: {puntuacion}</Text>
      <TouchableOpacity style={styles.containerGoBack} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: gameUrl }}
          injectedJavaScript={injectedJS}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={['*']}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGoBack: {
    padding: 10,
  },
});

export default GameIframe;
