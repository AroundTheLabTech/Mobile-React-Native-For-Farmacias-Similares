import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Linking,
  NativeModules,
  Platform,
  Share,
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
//   simi:app-share        -> abrir la hoja de compartir del teléfono (texto, enlace e imagen)
// Y la app abre los enlaces de duelo (https://<sitio>/reto?c=... o simijuegos://reto?c=...) en la
// sala de ese duelo, dentro de la app (ver destinoDeEnlace).
// Este archivo no depende de ninguna otra pantalla de la app.
const BASE = WEB_BASE_URL;
const FONDO = '#0E0A1F'; // fondo de la web

// La web sabe que está dentro de la app por esto (y por el nombre agregado al navegador).
// share: true = esta versión de la app ya tiene la hoja de compartir (la web deja de usar su respaldo).
const ANTES_DE_CARGAR = `window.__simiApp = { shell: true, v: 2, share: true, os: '${Platform.OS}' }; true;`;

// ---------- Enlaces que abren la app (duelos entre amigos) ----------
// Solo se acepta la sala de un duelo, en los sitios de SimiJuegos o con el esquema propio. Del enlace
// se toma nada más el código del duelo y el juego: nunca se manda al WebView a una dirección de fuera.
const SITIOS = [
  'simijuegos.com.mx',
  'www.simijuegos.com.mx',
  'simijuegos-pruebas.late-limit-0cf9.workers.dev',
  'simijuegos-comunidad.late-limit-0cf9.workers.dev',
];
function destinoDeEnlace(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  const m =
    /^(?:https:\/\/([^/?#]+)\/reto|simijuegos:\/\/reto)\/?(?:\?([^#]*))?/i.exec(
      url,
    );
  if (!m) {
    return null;
  }
  if (m[1] && !SITIOS.includes(m[1].toLowerCase())) {
    return null;
  }
  const consulta = m[2] || '';
  const codigo = /(?:^|&)c=([A-Za-z0-9]{6,12})(?:&|$)/.exec(consulta);
  if (!codigo) {
    return null;
  }
  const juego = /(?:^|&)j=([a-z0-9-]{1,40})(?:&|$)/.exec(consulta);
  return (
    BASE + '/reto?c=' + codigo[1].toUpperCase() + (juego ? '&j=' + juego[1] : '')
  );
}

// ---------- Hoja de compartir del teléfono ----------
// La web manda { title, text, url, image }: image es la tarjeta (data:image/jpeg;base64,...) o ''.
// iPhone: la hoja nativa acepta la imagen tal cual. Android: el módulo SimiShare (android/.../
// SimiShareModule.kt) guarda la imagen en la caché y la comparte; sin imagen, la hoja normal de texto.
type MensajeCompartir = {title?: string; text?: string; url?: string; image?: string};
async function compartir(msg: MensajeCompartir) {
  const texto = [msg.text, msg.url].filter(Boolean).join(' ');
  const imagen =
    typeof msg.image === 'string' && msg.image.startsWith('data:image/')
      ? msg.image
      : '';
  try {
    if (imagen && Platform.OS === 'android' && NativeModules.SimiShare) {
      await NativeModules.SimiShare.shareImage(imagen, texto, 'Compartir');
      return;
    }
    if (imagen && Platform.OS === 'ios') {
      await Share.share({url: imagen, message: texto});
      return;
    }
    // El enlace va dentro del texto: si va aparte, «Copiar» del iPhone pega solo el texto
    if (Platform.OS === 'ios') {
      await Share.share({message: texto});
    } else {
      await Share.share({message: texto}, {dialogTitle: 'Compartir'});
    }
  } catch (e) {
    // El jugador cerró la hoja o el teléfono no pudo abrirla: no hay nada que hacer
  }
}

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
  // Primera página: el inicio, o la sala del duelo si la app se abrió desde un enlace de reto.
  // null = todavía se está preguntando con qué enlace se abrió la app.
  const [inicio, setInicio] = useState<string | null>(null);

  // La app arranca en vertical; cada juego pide su orientación al abrirse.
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  // Enlaces de duelo: con la app cerrada deciden la primera página; con la app abierta, la llevan a la sala.
  useEffect(() => {
    let vivo = true;
    const porOmision = () => setInicio(actual => actual || BASE + '/');
    Linking.getInitialURL()
      .then(url => {
        if (vivo) {
          setInicio(actual => actual || destinoDeEnlace(url) || BASE + '/');
        }
      })
      .catch(() => vivo && porOmision());
    // Si el teléfono no contesta, la app abre de todos modos en el inicio
    const espera = setTimeout(() => vivo && porOmision(), 1500);
    const sub = Linking.addEventListener('url', ({url}) => {
      const destino = destinoDeEnlace(url);
      if (!destino) {
        return;
      }
      if (webRef.current) {
        webRef.current.injectJavaScript(
          `window.location.href = ${JSON.stringify(destino)}; true;`,
        );
      } else {
        setInicio(destino);
      }
    });
    return () => {
      vivo = false;
      clearTimeout(espera);
      sub.remove();
    };
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
    let msg: {type?: string; value?: string; result?: string} & MensajeCompartir = {};
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }
    if (msg.type === 'simi:app-share') {
      compartir(msg);
    } else if (msg.type === 'simi:app-orientation') {
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

  if (inicio === null) {
    return (
      <View style={styles.container}>
        <Cargando />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={key}
        ref={webRef}
        style={styles.web}
        source={{uri: inicio}}
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
