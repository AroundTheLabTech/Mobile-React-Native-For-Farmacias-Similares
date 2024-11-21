import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Text, Image, ImageBackground } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { WebView } from 'react-native-webview';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, fonts, fontSizes, spacing } from '../../../global-class';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameIframe = ({ navigation, route }) => {
  const { gameUrl, title } = route.params;

  useEffect(() => {
    // Bloquear orientación en horizontal al montar
    Orientation.lockToLandscape();

    // Restablecer orientación al desmontar
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const handleMessage = (event) => {
    console.log('Mensaje recibido del iframe:', event.nativeEvent.data);
    const message = JSON.parse(event.nativeEvent.data);

    if (message.score !== undefined) {
      console.log('Puntuación recibida:', message.score);
      alert(`Puntuacion: "${message.score}"`);
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

  const [dimesions, setDimensions] = useState({ width: 0, height: 0 })

  function handleLayout(event) {
    const { width, height } = event.nativeEvent.layout;
    console.log(width, height);
    setDimensions({ width, height })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.container}>
      <View style={styles.buttonsLeftContainer}>
        <Text style={styles.buttonsTitle} >
          Puntos:
        </Text>
        <Image source={require('../../../img/medallas/medal1.png')} />
        <View style={styles.containerGoBack} >
          <TouchableOpacity style={styles.saveAndExitTextButtonBack} onPress={() => navigation.goBack()}>
            <View style={styles.saveAndExitTextButtonFront} >
              <Text style={styles.saveAndExitText} >
                Guardar y salir
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.webViewContainer} onLayout={handleLayout}>
        <WebView
          style={{width: dimesions.width * 0.8}}
          source={{ uri: gameUrl }}
          injectedJavaScript={injectedJS}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={['*']}
        />
      </View>
      <View style={styles.buttonsRigthContainer}>
        <Text style={styles.buttonsTitle} >
          {title}
        </Text>
        <Image source={require('../../../img/medallas/medal3.png')} />
        <Image source={require('../../../img/medallas/medal4.png')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsLeftContainer: {
    borderWidth: 1,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'white',
    padding: spacing.sm,
    borderRadius: 5,
    height: '100%',
    justifyContent: 'space-around',
    left: 0,
    width: '10%',
  },
  buttonsTitle: {
    color: colors.secondary,
    fontFamily: fonts.press,
    fontSize: fontSizes.xxxxs,
    width: '100%',
    textAlign: 'center',
  },
  webViewContainer: {
    flex: 1,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRigthContainer: {
    borderWidth: 1,
    borderColor: 'white',
    position: 'absolute',
    zIndex: 10,
    backgroundColor: 'white',
    padding: spacing.sm,
    borderRadius: 5,
    height: '100%',
    justifyContent: 'space-around',
    right: 0,
    width: '10%',
  },
  containerGoBack: {
    width: '100%',
    padding: 10,
    zIndex: 1,
    top: 0,
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAndExitTextButtonBack: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa2409',
    borderColor: '#da2e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  saveAndExitTextButtonFront: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#da2e0b',
  },
  saveAndExitText: {
    fontFamily: fonts.press,
    fontSize: 5,
    textAlign: 'center',
    color: colors.primary,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default GameIframe;
