import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {WEB_BASE_URL} from '../../config/web';

// La app muestra la web de SimiJuegos por dentro.
// Así app y web son lo mismo: el catálogo, el ranking, el perfil, los avatares, las instrucciones y
// los resultados son los de la web, y lo que se publica en la web sale en la app sin compilar otra vez.
//
// Lo que solo puede hacer la app, la web se lo pide con mensajes (src/utils/appShell.js en la web):
//   simi:app-orientation  -> fijar la pantalla en vertical u horizontal según el juego
//   simi:app-back         -> respuesta al botón Atrás de Android (ver PREGUNTAR_ATRAS)
// Este archivo no depende de ninguna otra pantalla de la app.
const BASE = WEB_BASE_URL;
const FONDO = '#0E0A1F'; // fondo de la web

// La web sabe que está dentro de la app por esto (y por el nombre agregado al navegador).
const ANTES_DE_CARGAR = `window.__simiApp = { shell: true, v: 1, os: '${Platform.OS}' }; true;`;

// Atrás de Android: la página decide. true = ya lo atendió; false = cerrar la app; sin función = regresar.
const PREGUNTAR_ATRAS = `(function(){
  var r = null;
  try { if (typeof window.__simiAppBack === 'function') r = window.__simiAppBack(); } catch (e) { r = null; }
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'simi:app-back', result: r === true ? 'handled' : r === false ? 'exit' : 'default' }));
})(); true;`;

// Al mandar la app al fondo, el juego queda en pausa con su menú (en Android seguía sonando).
const PAUSAR_JUEGO = `(function(){
  try {
    var f = document.querySelector('.gs-frame iframe');
    var b = f && f.contentWindow && f.contentWindow.__simiBridge;
    if (b && !b.isOpen()) b.openMenu();
  } catch (e) {}
})(); true;`;

// Páginas del mismo sitio que se abren en el navegador del teléfono (dentro de la app no habría cómo regresar en iPhone).
const FUERA = /\/(privacy-policy|terms-and-conditions|descargas)(\/|$|\?)/;

const Cargando = () => (
  <View style={styles.loading}>
    <Text style={styles.brand}>
      Simi<Text style={styles.brandGold}>Juegos</Text>
    </Text>
    <ActivityIndicator size="large" color="#FFC83D" style={styles.spinner} />
    <Text style={styles.loadingText}>Preparando la diversión...</Text>
  </View>
);

const WebShell: React.FC = () => {
  const webRef = useRef<WebView | null>(null);
  const canGoBack = useRef(false);
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);

  // La app arranca en vertical; cada juego pide su orientación al abrirse.
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (failed) {
        return false;
      }
      webRef.current?.injectJavaScript(PREGUNTAR_ATRAS);
      return true;
    });
    return () => sub.remove();
  }, [failed]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        webRef.current?.injectJavaScript(PAUSAR_JUEGO);
      }
    });
    return () => sub.remove();
  }, []);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    let msg: {type?: string; value?: string; result?: string} = {};
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }
    if (msg.type === 'simi:app-orientation') {
      if (msg.value === 'landscape') {
        Orientation.lockToLandscape();
      } else if (msg.value === 'free') {
        Orientation.unlockAllOrientations();
      } else {
        Orientation.lockToPortrait();
      }
    } else if (msg.type === 'simi:app-back') {
      if (msg.result === 'handled') {
        return;
      }
      if (msg.result === 'default' && canGoBack.current) {
        webRef.current?.goBack();
      } else {
        BackHandler.exitApp();
      }
    }
  }, []);

  // Enlaces a otros sitios (y las páginas legales) se abren en el navegador del teléfono.
  const onShouldStart = useCallback(
    (req: {url: string; isTopFrame?: boolean; navigationType?: string}) => {
      const url = req.url || '';
      if (/^(about|blob|data):/i.test(url)) {
        return true;
      }
      if (req.isTopFrame === false) {
        return true; // marcos internos (juegos, Firebase)
      }
      const propio =
        url === BASE ||
        url.startsWith(BASE + '/') ||
        url.startsWith(BASE + '?') ||
        url.startsWith(BASE + '#');
      if (propio && !FUERA.test(url)) {
        return true;
      }
      if (/^https?:/i.test(url)) {
        // iPhone: solo lo que el jugador toca; las redirecciones del propio sitio pasan
        if (Platform.OS === 'ios' && !propio && req.navigationType !== 'click') {
          return true;
        }
        Linking.openURL(url).catch(() => {});
        return false;
      }
      Linking.openURL(url).catch(() => {}); // mailto:, tel:, etc.
      return false;
    },
    [],
  );

  const retry = () => {
    setFailed(false);
    setKey(k => k + 1);
  };

  if (failed) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>No pude cargar SimiJuegos</Text>
        <Text style={styles.errorText}>
          Revisa tu conexión a internet e inténtalo otra vez.
        </Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={retry}
          accessibilityRole="button">
          <Text style={styles.errorButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={key}
        ref={webRef}
        style={styles.web}
        source={{uri: BASE + '/'}}
        applicationNameForUserAgent="SimiJuegosApp/1"
        injectedJavaScriptBeforeContentLoaded={ANTES_DE_CARGAR}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={onShouldStart}
        onNavigationStateChange={nav => {
          canGoBack.current = !!nav.canGoBack;
        }}
        onError={() => setFailed(true)}
        onContentProcessDidTerminate={() => webRef.current?.reload()}
        onRenderProcessGone={() => setKey(k => k + 1)}
        startInLoadingState
        renderLoading={() => <Cargando />}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={false}
        setSupportMultipleWindows={false}
        bounces={false}
        // iPhone: el scroll con la misma inercia que Safari. Por omisión el WebView frena el
        // deslizamiento mucho antes ("fast") y la navegación se sentía pesada.
        decelerationRate="normal"
        overScrollMode="never"
        pullToRefreshEnabled={false}
        textZoom={100}
        originWhitelist={['*']}
        accessibilityLabel="SimiJuegos"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: FONDO},
  web: {flex: 1, backgroundColor: FONDO},
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {fontSize: 34, fontWeight: '800', color: '#FFFFFF'},
  brandGold: {color: '#FFC83D'},
  spinner: {marginTop: 18},
  loadingText: {marginTop: 14, fontSize: 16, fontWeight: '600', color: '#FFFFFF'},
  error: {
    flex: 1,
    backgroundColor: FONDO,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  errorTitle: {color: '#FFFFFF', fontSize: 22, fontWeight: '800', textAlign: 'center'},
  errorText: {color: '#C9C2E0', fontSize: 16, textAlign: 'center', marginTop: 10, lineHeight: 22},
  errorButton: {
    marginTop: 22,
    minHeight: 48,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorButtonText: {color: '#FFFFFF', fontSize: 17, fontWeight: '800'},
});

export default WebShell;
