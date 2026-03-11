import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Text, Image, LayoutChangeEvent } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, fontSizes, spacing } from '../../../global-class';
import { getListAvalibleCompetition, postSessionGame, putCompetitionSession } from '@services/backend';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { TGameSession } from 'src/types/game';
import { TCompetitionSession } from 'src/types/competition';

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
  navigation: { goBack: () => void; navigate: (screen: string, params?: any) => void };
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

  // Estado base de puntaje mostrado
  const [currentScore, setCurrentScore] = useState<number>(Number(score) || 0);

  // Estados para replicar reglas de la web (en memoria; NO persisten solos)
  const [scoreHistory, setScoreHistory] = useState<number[]>([]); // máx 2
  const [previusScore, setPreviusScore] = useState<number>(0);
  const initialScoreDb = useMemo<number>(() => Number(score) || 0, [score]);

  // Control de envío al backend (solo en Guardar y salir)
  const [session, setSession] = useState<TGameSession | undefined>();
  const isPostingRef = useRef<boolean>(false);

  // WebView refs y control de reinyección
  const webviewRef = useRef<WebView | null>(null);
  const [webKey, setWebKey] = useState<number>(0);

  // Orientación landscape mientras está montado
  useEffect(() => {
    Orientation.lockToLandscape();
    return () => Orientation.unlockAllOrientations();
  }, []);

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
          let previusScore = 0;
          return {
            pushScore: function(v){ scoreHistory.push(v); if(scoreHistory.length>2) scoreHistory.shift(); return scoreHistory; },
            getHistory: function(){ return scoreHistory.slice(); },
            setPrevius: function(v){ previusScore = v; },
            getPrevius: function(){ return previusScore; },
            reset: function(){ scoreHistory = []; previusScore = 0; },
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
    juego1:  { mode: 'history' },
    juego2:  { mode: 'history', divisor: 100, dedup: true, normalizeMin: 1 },
    juego3:  { mode: 'direct', useNumberField: true },
    juego4:  { mode: 'absolute', divisor: 100 },
    juego5:  { mode: 'history-progressive', requireType: 'scoreUpdate' },
    juego6:  { mode: 'history', requireType: 'scoreUpdate' },
    juego7:  { mode: 'direct', requireType: 'scoreUpdate' },
    juego8:  { mode: 'history', requireType: 'scoreUpdate' },
    juego9:  { mode: 'history', requireType: 'scoreUpdate' },
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

      const strategy = SCORING_STRATEGIES[id];
      if (!strategy) return;

      // Check type filter
      if (strategy.requireType && typeValue !== strategy.requireType) return;

      let delta = 0;
      let appliedAbsolute = false;

      const inputValue = strategy.useNumberField ? numberValue : scoreValue;
      if (Number.isNaN(inputValue)) return;

      if (strategy.mode === 'direct') {
        if (inputValue > 0) delta = inputValue;
      } else if (strategy.mode === 'absolute') {
        const normalized = scoreValue > 100 ? (scoreValue - 10) / (strategy.divisor || 1) : 1;
        setCurrentScore(initialScoreDb + normalized);
        appliedAbsolute = true;
      } else if (strategy.mode === 'history-progressive') {
        // juego5 special: only count if score increases over previous
        if (scoreValue > 0) {
          setScoreHistory(prev => {
            if (previusScore !== scoreValue && scoreValue > previusScore) {
              const u = pushAndShift(prev, scoreValue);
              const v = u[1];
              if (v > 0) { delta = v; setPreviusScore(v); }
              else { delta = 1; setPreviusScore(1); }
              return u;
            }
            return prev;
          });
        }
      } else if (strategy.mode === 'history') {
        if (scoreValue <= 0 && !strategy.dedup) return;

        let v = scoreValue;
        if (strategy.divisor) {
          v = scoreValue / strategy.divisor;
          if (strategy.normalizeMin != null) v = v > strategy.normalizeMin ? v : strategy.normalizeMin;
        }

        setScoreHistory(prev => {
          if (strategy.dedup && prev.indexOf(v) !== -1) return prev;
          const u = pushAndShift(prev, v);
          delta = u[1] || 0;
          return u;
        });
      }

      // Actualiza puntaje local
      if (delta > 0 && !appliedAbsolute) {
        setCurrentScore(prev => prev + delta);
      }
    } catch (e) {
      // Mensaje no JSON o desconocido
    }
  };

  // Guardar SOLO aquí
  async function handleUpdateScore() {
    try {
      const deltaTotal = Math.max(0, currentScore - initialScoreDb);
      const deltaToSend = deltaTotal; // redondea si tu API no acepta decimales: Math.round(deltaTotal)

      if (deltaToSend > 0 && !isPostingRef.current) {
        isPostingRef.current = true;

        const gameNumber = Number(id.replace('juego', ''));
        const newGameSession: TGameSession = { uid, score: Number(deltaToSend), numberGame: gameNumber };

        const response = await postSessionGame(newGameSession);
        if (response?.session_id) {
          await addCompetitionSession(response.session_id);
          setSession(newGameSession);
        }
      }
    } catch (e) {
      // Error al guardar score
    } finally {
      isPostingRef.current = false;
      setUpdateScorePerGame(true);
      setUpdateLast3MonthsScores(true);
      setUpdateUserPoints(true);
      navigation.goBack();
    }
  }

  // layout
  const [dimesions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  function handleLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.container}>
      <View style={styles.buttonsLeftContainer}>
        <Text style={styles.buttonsTitle}>Puntos: {currentScore}</Text>
        <Image source={require('../../../img/medallas/medal1.png')} />
        <View style={styles.containerGoBack}>
          <TouchableOpacity style={styles.saveAndExitTextButtonBack} onPress={handleUpdateScore}>
            <View style={styles.saveAndExitTextButtonFront}>
              <Text style={styles.saveAndExitText}>Guardar y salir</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.webViewContainer} onLayout={handleLayout}>
        <WebView
          key={webKey}
          ref={webviewRef}
          style={{ width: dimesions.width * 0.8 }}
          source={{ uri: gameUrl }}
          injectedJavaScript={injectedJS}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          onLoadStart={() => resetBridge()}   // limpia si el juego recarga internamente
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          originWhitelist={['*']}
        />
      </View>

      <View style={styles.buttonsRigthContainer}>
        <Text style={styles.buttonsTitle}>{title}</Text>
        <Image source={require('../../../img/medallas/medal3.png')} />
        <Image source={require('../../../img/medallas/medal4.png')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  buttonsLeftContainer: {
    borderWidth: 1, borderColor: 'white', position: 'absolute', zIndex: 10, backgroundColor: 'white',
    padding: spacing.sm, borderRadius: 5, height: '100%', justifyContent: 'space-around', left: 0, width: '10%',
  },
  buttonsTitle: {
    color: colors.secondary, fontFamily: fonts.press, fontSize: fontSizes.xxxxs,
    width: '100%', textAlign: 'center',
  },
  webViewContainer: {
    flex: 1, overflow: 'hidden', alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
  },
  buttonsRigthContainer: {
    borderWidth: 1, borderColor: 'white', position: 'absolute', zIndex: 10, backgroundColor: 'white',
    padding: spacing.sm, borderRadius: 5, height: '100%', justifyContent: 'space-around', right: 0, width: '10%',
  },
  containerGoBack: {
    width: '100%', padding: 10, zIndex: 1, top: 0, backgroundColor: 'white',
    height: 50, justifyContent: 'center', alignItems: 'center',
  },
  saveAndExitTextButtonBack: {
    width: 60, height: 60, borderRadius: 50, borderWidth: 1, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#aa2409', borderColor: '#da2e0b',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 4, elevation: 5,
  },
  saveAndExitTextButtonFront: {
    width: 45, height: 45, borderRadius: 50, borderWidth: 1, justifyContent: 'center',
    padding: 5, backgroundColor: '#da2e0b',
  },
  saveAndExitText: {
    fontFamily: fonts.press, fontSize: 5, textAlign: 'center', color: colors.primary,
    textShadowColor: '#000', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1,
  },
});

export default GameIframe;
