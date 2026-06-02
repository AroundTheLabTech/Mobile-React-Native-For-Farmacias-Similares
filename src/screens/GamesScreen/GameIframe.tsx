import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated, StatusBar, ActivityIndicator } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { getListAvalibleCompetition, postSessionGame, putCompetitionSession } from '@services/backend';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { TGameSession } from 'src/types/game';
import { TCompetitionSession } from 'src/types/competition';
import { darkTheme } from '../../theme/colors';



type GameId =
  | 'juego1' | 'juego2' | 'juego3' | 'juego4' | 'juego5' | 'juego6'
  | 'juego7' | 'juego8' | 'juego9' | 'juego10' | 'juego11' | 'juego12'
  | 'juego13' | 'juego14' | 'juego15' | 'juego16' | 'juego17' | 'juego18';

type RouteParams = {
  gameUrl: string;
  id: GameId;
  score: number;
  title: string;
};

type Props = {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
    addListener?: (event: string, callback: (e: any) => void) => () => void;
  };
  route: { params: RouteParams };
};

type GameBridgeMessage = {
  type?: string;
  score?: number | string;
  number?: number | string;
};

const GameIframe: React.FC<Props> = ({ navigation, route }) => {
  const { uid } = useAuth();
  const { setUpdateScorePerGame, setUpdateLast3MonthsScores, setUpdateUserPoints } = useUser();

  const { gameUrl, id, score, title } = route.params;

  // Juegos que se juegan en vertical
  const VERTICAL_GAMES = ['juego13', 'juego14', 'juego16'];
  const isVerticalGame = VERTICAL_GAMES.includes(id);

  // Estado base de puntaje mostrado
  const [currentScore, setCurrentScore] = useState<number>(Number(score) || 0);

  // Usamos refs para el historial y puntajes previos para garantizar actualizaciones síncronas e instantáneas
  const currentScoreRef = useRef<number>(Number(score) || 0);
  const scoreHistoryRef = useRef<number[]>([]);
  const previousScoreRef = useRef<number>(0);
  const initialScoreDb = useMemo<number>(() => Number(score) || 0, [score]);

  // Control de envío al backend
  const [session, setSession] = useState<TGameSession | undefined>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const isPostingRef = useRef<boolean>(false);
  const isNavigatingBackRef = useRef<boolean>(false);
  const lastSavedScoreRef = useRef<number>(Number(score) || 0);
  const activePostPromiseRef = useRef<Promise<void> | null>(null);

  // WebView refs y control de reinyección
  const webviewRef = useRef<WebView | null>(null);
  const [webKey, setWebKey] = useState<number>(0);

  // Orientación según el tipo de juego
  useEffect(() => {
    if (__DEV__) console.log(`[DEBUG GameIframe] Locking orientation -> id=${id}, isVertical=${isVerticalGame}`);
    if (isVerticalGame) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    return () => Orientation.unlockAllOrientations();
  }, [id, isVerticalGame]);

  useFocusEffect(
    React.useCallback(() => {
      resetBridge();
      return () => { };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, gameUrl])
  );

  useEffect(() => {
    // Si cambia el juego o la URL, intentamos limpiar el bridge
    resetBridge();
  }, [id, gameUrl]);

  async function addCompetitionSession(sessionId: string) {
    const activeCompetitions = await getListAvalibleCompetition(uid);
    if (activeCompetitions && activeCompetitions.length > 0) {
      await Promise.all(activeCompetitions.map(async (competition) => {
        const newCompetitionSession: TCompetitionSession = {
          user_uid: uid,
          opponent_uid: competition.UID,
          unique_id: competition.id,
          session_id: sessionId,
        };
        await putCompetitionSession(newCompetitionSession);
      }));
    }
  }

  // helper historial (máx 2)
  const pushAndShift = (arr: number[], value: number): number[] => {
    const updated = [...arr, value];
    if (updated.length > 2) updated.shift();
    return updated;
  };

  // JS inyectado con bridge reseteable
  const injectedJS = `
    (function(){
      if (!window.__SimiBridge) {
        window.__SimiBridge = (function(){
          let scoreHistory = [];
          let previousScore = 0;
          return {
            pushScore: function(v){ scoreHistory.push(v); if(scoreHistory.length>2) scoreHistory.shift(); return scoreHistory; },
            getHistory: function(){ return scoreHistory.slice(); },
            setPrevious: function(v){ previousScore = v; },
            getPrevious: function(){ return previousScore; },
            reset: function(){ scoreHistory = []; previousScore = 0; },
          };
        })();

        window.addEventListener('message', function(ev){
          try {
            var d = ev && ev.data ? ev.data : {};
            try { if (typeof d === 'string') d = JSON.parse(d); } catch(e){}
            var payload = {};
            if (typeof d.type  !== 'undefined') payload.type  = String(d.type);
            if (typeof d.score !== 'undefined') payload.score = Number(d.score);
            if (typeof d.number!== 'undefined') payload.number= Number(d.number);
            if (Object.keys(payload).length) window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          } catch(e){}
        }, false);

        // Normaliza window.postMessage directo
        var orig = window.postMessage;
        window.postMessage = function(msg, target){
          var d = msg;
          try { if (typeof d === 'string') d = JSON.parse(d); } catch(e) {}
          var p = {};
          if (d && typeof d === 'object') {
            if (typeof d.type  !== 'undefined') p.type  = String(d.type);
            if (typeof d.score !== 'undefined') p.score = Number(d.score);
            if (typeof d.number!== 'undefined') p.number= Number(d.number);
          }
          if (Object.keys(p).length) try { window.ReactNativeWebView.postMessage(JSON.stringify(p)); } catch(e){}
          return orig && orig.apply(window, arguments);
        };
      }
    })();
  `;

  function resetBridge() {
    // 1) intenta resetear estado interno del bridge
    webviewRef.current?.injectJavaScript(`
      (function(){
        if (window.__SimiBridge && typeof window.__SimiBridge.reset === 'function') {
          window.__SimiBridge.reset();
        }
      })();
      true;
    `);
    // Resetea referencias locales
    scoreHistoryRef.current = [];
    previousScoreRef.current = 0;
    currentScoreRef.current = Number(score) || 0;
    lastSavedScoreRef.current = Number(score) || 0;
    setCurrentScore(Number(score) || 0);
    // 2) fallback fuerte: si ves que algún juego queda cacheado, descomenta:
    // setWebKey(k => k + 1);
  }

  // Scoring strategies — data-driven replacement of the if/else chain
  type ScoringStrategy = {
    mode: 'history' | 'direct' | 'absolute' | 'history-progressive';
    divisor?: number;
    requireType?: string;
    useNumberField?: boolean;
    dedup?: boolean;           // juego2: skip if value already in history
    normalizeMin?: number;     // juego2: clamp to min 1
  };

  const SCORING_STRATEGIES: Record<string, ScoringStrategy> = {
    juego1: { mode: 'history' },
    juego2: { mode: 'history', divisor: 100, dedup: true, normalizeMin: 1 },
    juego3: { mode: 'direct', useNumberField: true },
    juego4: { mode: 'absolute', divisor: 100 },
    juego5: { mode: 'history-progressive', requireType: 'scoreUpdate' },
    juego6: { mode: 'history', requireType: 'scoreUpdate' },
    juego7: { mode: 'direct', requireType: 'scoreUpdate' },
    juego8: { mode: 'history', requireType: 'scoreUpdate' },
    juego9: { mode: 'history', requireType: 'scoreUpdate' },
    juego10: { mode: 'history', requireType: 'scoreUpdate' },
    juego11: { mode: 'history', requireType: 'scoreUpdate' },
    juego12: { mode: 'history', requireType: 'scoreUpdate' },
    juego13: { mode: 'history', requireType: 'scoreUpdate' },
    juego14: { mode: 'history', requireType: 'scoreUpdate' },
    juego15: { mode: 'history', requireType: 'scoreUpdate', divisor: 100 },
    juego16: { mode: 'history', requireType: 'scoreUpdate' },
    juego17: { mode: 'history', requireType: 'scoreUpdate', divisor: 100 },
    juego18: { mode: 'history', requireType: 'scoreUpdate' },
  };

  // Recibir mensajes y actualizar score local
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const raw = JSON.parse(event.nativeEvent.data) as GameBridgeMessage;
      const scoreValue = Number(raw?.score);
      const numberValue = Number(raw?.number);
      const typeValue = raw?.type ? String(raw.type) : undefined;

      if (__DEV__) console.log(`[DEBUG GameIframe] onMessage -> type=${typeValue}, score=${scoreValue}, number=${numberValue}, game=${id}`);

      const strategy = SCORING_STRATEGIES[id];
      if (!strategy) {
        console.log(`[DEBUG GameIframe] No strategy for ${id}`);
        return;
      }

      // Check type filter
      if (strategy.requireType && typeValue !== strategy.requireType) return;

      let delta = 0;
      let appliedAbsolute = false;

      const inputValue = strategy.useNumberField ? numberValue : scoreValue;
      if (Number.isNaN(inputValue)) return;

      if (strategy.mode === 'direct') {
        if (inputValue > 0) {
          const diff = inputValue - previousScoreRef.current;
          if (diff > 0) {
            delta = diff;
            previousScoreRef.current = inputValue;
          }
        }
      } else if (strategy.mode === 'absolute') {
        const normalized = scoreValue > 100 ? (scoreValue - 10) / (strategy.divisor || 1) : 1;
        const next = initialScoreDb + normalized;
        currentScoreRef.current = next;
        setCurrentScore(next);
        appliedAbsolute = true;
      } else if (strategy.mode === 'history-progressive') {
        if (scoreValue > 0) {
          if (scoreValue > previousScoreRef.current) {
            delta = scoreValue - previousScoreRef.current;
            previousScoreRef.current = scoreValue;
          }
        }
      } else if (strategy.mode === 'history') {
        if (scoreValue <= 0 && !strategy.dedup) return;

        let v = scoreValue;
        if (strategy.divisor) {
          v = scoreValue / strategy.divisor;
          if (strategy.normalizeMin != null) v = v > strategy.normalizeMin ? v : strategy.normalizeMin;
        }

        if (!(strategy.dedup && scoreHistoryRef.current.indexOf(v) !== -1)) {
          const u = pushAndShift(scoreHistoryRef.current, v);
          scoreHistoryRef.current = u;

          let newVal = 0;
          let lastVal = 0;

          if (u.length === 1) {
            newVal = u[0];
            lastVal = 0;
          } else {
            newVal = u[1];
            lastVal = u[0];
          }

          if (newVal > lastVal) {
            delta = newVal - lastVal;
          }
        }
      }

      // Actualiza puntaje local
      if (delta > 0 && !appliedAbsolute) {
        const next = currentScoreRef.current + delta;
        currentScoreRef.current = next;
        setCurrentScore(next);
        console.log(`[DEBUG GameIframe] Score updated -> delta=${delta}, next=${next}`);
      }
    } catch (e) {
      // Mensaje no JSON o desconocido
    }
  };

  // Envía delta incremental al backend (no navega)
  const saveScoreDelta = useCallback(async (navigateBack = false) => {
    if (navigateBack) {
      setIsSaving(true);
    }
    try {
      // Si hay un guardado en curso, esperamos a que termine antes de continuar
      if (activePostPromiseRef.current) {
        try {
          await activePostPromiseRef.current;
        } catch (e) {
          // Ignoramos error del post anterior, reintentaremos con el nuevo delta
        }
      }

      const latestScore = currentScoreRef.current;
      const deltaTotal = Math.max(0, latestScore - lastSavedScoreRef.current);
      const deltaToSend = Math.round(deltaTotal);

      if (__DEV__) console.log(`[DEBUG GameIframe] saveScoreDelta -> latestScore=${latestScore}, lastSaved=${lastSavedScoreRef.current}, delta=${deltaToSend}, navigateBack=${navigateBack}`);

      if (deltaToSend > 0) {
        // Creamos la promesa de envío
        const postPromise = (async () => {
          isPostingRef.current = true;
          try {
            const gameNumber = Number(id.replace('juego', ''));
            const newGameSession: TGameSession = { uid, score: deltaToSend, numberGame: gameNumber };

            console.log(`[DEBUG GameIframe] Posting session -> game=${gameNumber}, score=${deltaToSend}`);
            const response = await postSessionGame(newGameSession);
            console.log(`[DEBUG GameIframe] Session response -> session_id=${response?.session_id}`);

            if (response?.session_id) {
              try {
                await addCompetitionSession(response.session_id);
              } catch (compErr) {
                console.log(`[DEBUG GameIframe] Error adding competition session:`, compErr);
              }
              setSession(newGameSession);
            }
            // Solo actualizamos la referencia de guardado si la llamada HTTP no arrojó error
            lastSavedScoreRef.current = latestScore;
          } catch (err) {
            if (__DEV__) console.log(`[DEBUG GameIframe] Error in postPromise:`, err);
            throw err;
          } finally {
            isPostingRef.current = false;
            activePostPromiseRef.current = null;
          }
        })();

        activePostPromiseRef.current = postPromise;

        try {
          await postPromise;
        } catch (e) {
          // Falló el guardado, no se actualiza lastSavedScoreRef.current
        }
      } else {
        console.log(`[DEBUG GameIframe] No delta to save (deltaToSend=${deltaToSend})`);
      }
    } finally {
      setIsSaving(false);
    }

    if (navigateBack) {
      console.log(`[DEBUG GameIframe] Navigating back, refreshing data, optimisticScore=${currentScoreRef.current}`);
      setUpdateLast3MonthsScores(true);
      setUpdateUserPoints(true);
      isNavigatingBackRef.current = true;

      navigation.navigate('GameDetails', {
        ...route.params,
        optimisticScore: currentScoreRef.current,
      });
    }
  }, [id, uid, navigation, route, setUpdateLast3MonthsScores, setUpdateUserPoints]);

  // Botón "Guardar y salir"
  function handleUpdateScore() {
    saveScoreDelta(true);
  }

  // Auto-guardado cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      saveScoreDelta(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [saveScoreDelta]);

  // Guardar al presionar botón de retroceso (hardware o gesture)
  useEffect(() => {
    const unsubscribe = navigation.addListener?.('beforeRemove', (e: any) => {
      if (isNavigatingBackRef.current) {
        console.log(`[DEBUG GameIframe] beforeRemove -> already navigating back via saveScoreDelta, allowing navigation`);
        return;
      }

      // Si ya se está guardando, dejar pasar
      if (isPostingRef.current) {
        console.log(`[DEBUG GameIframe] beforeRemove -> already posting, allowing navigation`);
        return;
      }

      const delta = Math.round(Math.max(0, currentScoreRef.current - lastSavedScoreRef.current));
      if (__DEV__) console.log(`[DEBUG GameIframe] beforeRemove -> delta=${delta}, currentScore=${currentScoreRef.current}, lastSaved=${lastSavedScoreRef.current}`);
      if (delta > 0) {
        // Prevenir navegación, guardar, y luego navegar
        e.preventDefault();
        console.log(`[DEBUG GameIframe] beforeRemove -> preventing navigation, saving first`);
        saveScoreDelta(true);
      } else {
        // No hay delta pendiente, refrescar datos y dejar pasar
        console.log(`[DEBUG GameIframe] beforeRemove -> no delta, passing through`);
        setUpdateScorePerGame(true);
        setUpdateLast3MonthsScores(true);
        setUpdateUserPoints(true);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveScoreDelta]);

  // --- Auto-hide overlay ---
  const [overlayVisible, setOverlayVisible] = useState(true);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideOverlay = useCallback(() => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(false));
  }, [overlayOpacity]);

  const showOverlay = useCallback(() => {
    setOverlayVisible(true);
    overlayOpacity.setValue(1);
    // Auto-hide after 4s
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(hideOverlay, 4000);
  }, [overlayOpacity, hideOverlay]);

  // Show on mount, auto-hide after 4s
  useEffect(() => {
    hideTimer.current = setTimeout(hideOverlay, 4000);
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [hideOverlay]);

  const toggleOverlay = useCallback(() => {
    if (overlayVisible) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideOverlay();
    } else {
      showOverlay();
    }
  }, [overlayVisible, hideOverlay, showOverlay]);

  const exitButtonContent = (
    <Text style={styles.exitButtonText}>Guardar y salir</Text>
  );

  if (__DEV__) console.log(`[DEBUG GameIframe] gameUrl=${gameUrl}`);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Full-bleed game — fills entire screen */}
      <WebView
        key={webKey}
        ref={webviewRef}
        style={styles.webView}
        source={{ uri: gameUrl }}
        injectedJavaScript={injectedJS}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onLoadStart={() => resetBridge()}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        originWhitelist={['*']}
      />

      {/* Tap zone to toggle overlay (top edge) */}
      {!overlayVisible && (
        <TouchableOpacity
          style={styles.tapZone}
          activeOpacity={1}
          onPress={toggleOverlay}
        >
          <View style={styles.tapHint} />
        </TouchableOpacity>
      )}

      {/* Floating overlay — auto-hides */}
      {overlayVisible && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <View style={styles.overlayBar}>
            {/* Score pill */}
            <View style={styles.scorePill}>
              <Text style={styles.scoreValue}>{Math.round(currentScore)}</Text>
              <Text style={styles.scoreLabel}> pts</Text>
            </View>

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Exit button */}
            <TouchableOpacity onPress={handleUpdateScore} activeOpacity={0.85}>
              <View style={[styles.exitButton, { backgroundColor: darkTheme.purple }]}>
                {exitButtonContent}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* 
        Loader de guardado al salir
        (Comenta todo este bloque si deseas desactivar el bloqueo de pantalla al guardar y salir)
      */}
      {/* {isSaving && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text style={styles.loaderText}>Guardando puntuación...</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000',
  },
  // Small bar at top edge — tap to show overlay when hidden
  tapZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  tapHint: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 4,
  },
  // Floating overlay
  overlay: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 30,
  },
  overlayBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreValue: {
    color: '#FFD700',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 11,
    fontWeight: '500',
  },
  spacer: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  exitButton: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-VariableFont_opsz,wght',
    fontSize: 11,
    fontWeight: '700',
  },
  // Loader overlay styles
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderText: {
    color: '#FFFFFF',
    marginTop: 14,
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
});

export default GameIframe;
