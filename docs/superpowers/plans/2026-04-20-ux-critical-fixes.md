# UX Critical Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Games the first tab, replace the generic loader with a branded SimiLoader (+ native splash), add skeleton loaders per screen, and make the in-game exit button always visible with a save-confirmation modal.

**Architecture:** Refactor `TabNavigator` to lead with `GamesStack`, delete `HomeScreen/`, absorb its dashboard into `Profile`. Port the Next.js `SimiLoader` to React Native using `Animated` + `react-native-svg` (already installed). Install `react-native-bootsplash` for native splash. Replace in-screen spinners with skeleton placeholders.

**Tech Stack:** React Native 0.75.3, React 18.3.1, React Navigation 6, `react-native-linear-gradient`, `react-native-svg` (already installed), `react-native-bootsplash` (new), `react-native-webview`, `react-native-orientation-locker`. No test framework — verification is type-check (`tsc --noEmit`) + lint (`npm run lint`) + manual QA on the Android emulator (`--mode=playDebug`).

**Spec:** `docs/superpowers/specs/2026-04-20-ux-critical-fixes-design.md`

**Branch:** `feature/entrega-marzo-2026` (in sync with origin as of 2026-04-20). All commits land on this branch.

---

## Conventions

- **Run on Windows `bash`** (Git Bash). Use forward slashes and Unix-style commands.
- **Android emulator command:** `npx react-native run-android --mode=playDebug` (mandatory flag — `play` is the active flavor).
- **Path alias:** `@components/*` → `src/components/*`, `@services/*` → `src/services/*`.
- **Commit style:** match existing history — prefix with `feat:`, `fix:`, `refactor:`, `chore:` in Spanish-friendly messages. Co-author footer not required.
- **Verification gate before every commit:** `npx tsc --noEmit` must pass. `npm run lint` must pass for files you touched.
- **Smoke-test gate** at the end of phases 3, 5, 6: boot the Android emulator and walk through the affected flow before committing.

---

## Phase 0 — Prep

### Task 0.1: Install `react-native-bootsplash` and confirm SVG is present

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Check current deps**

Run: `grep -E "react-native-svg|react-native-bootsplash|react-native-linear-gradient" package.json`
Expected output: includes `"react-native-svg": "^15.7.1"` and `"react-native-linear-gradient"`, NO `react-native-bootsplash`.

- [ ] **Step 2: Install bootsplash**

Run: `npm install react-native-bootsplash@^6.2.0 --save`
Expected: `package.json` gets a new dependency line. No peer-dep warnings that block install.

- [ ] **Step 3: Install iOS pods**

Run: `cd ios && pod install && cd ..`
Expected: "Pod installation complete!" with bootsplash appearing in the pod list. (Skip on Windows if pods are managed from macOS CI — note it in the commit.)

- [ ] **Step 4: Commit deps bump**

```bash
git add package.json package-lock.json ios/Podfile.lock
git commit -m "chore: install react-native-bootsplash"
```

---

## Phase 1 — SimiLoader component

### Task 1.1: Create `SimiLoader` component

**Files:**
- Create: `src/components/SimiLoader/SimiLoader.tsx`
- Create: `src/components/SimiLoader/messages.ts`

- [ ] **Step 1: Create messages file**

```ts
// src/components/SimiLoader/messages.ts
export const SIMI_LOADING_MESSAGES: readonly string[] = [
  'Preparando la diversión...',
  'El Doctor Simi está listo para jugar...',
  'Cargando tus juegos favoritos...',
  'Calentando motores...',
  '¡Casi listo para la acción!',
  'Afinando los controles...',
  'Despertando al Doctor Simi...',
];
```

- [ ] **Step 2: Create SimiLoader component**

```tsx
// src/components/SimiLoader/SimiLoader.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { SIMI_LOADING_MESSAGES } from './messages';

const DOT_COLORS = ['#7C3AED', '#9333EA', '#06B6D4'] as const;
const SIMI_IMG = require('../../../img/personajes/doctor-simi-invade.png');

type SimiLoaderProps = {
  message?: string;
  visible?: boolean;
  fullScreen?: boolean;
  style?: ViewStyle;
};

function useLoop(config: { toValue: number; duration: number; delay?: number }) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: config.toValue,
          duration: config.duration / 2,
          delay: config.delay ?? 0,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [config.toValue, config.duration, config.delay, value]);
  return value;
}

const SimiLoader: React.FC<SimiLoaderProps> = ({
  message,
  visible = true,
  fullScreen = true,
  style,
}) => {
  const [displayMessage, setDisplayMessage] = useState<string>(
    message ?? SIMI_LOADING_MESSAGES[0],
  );

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      return;
    }
    const start = Math.floor(Math.random() * SIMI_LOADING_MESSAGES.length);
    setDisplayMessage(SIMI_LOADING_MESSAGES[start]);
    const interval = setInterval(() => {
      setDisplayMessage((prev) => {
        const idx = SIMI_LOADING_MESSAGES.indexOf(prev);
        const next = (idx + 1) % SIMI_LOADING_MESSAGES.length;
        return SIMI_LOADING_MESSAGES[next];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [message]);

  const bounce = useLoop({ toValue: 1, duration: 1000 });
  const shadow = useLoop({ toValue: 1, duration: 1000 });
  const glow = useLoop({ toValue: 1, duration: 1200 });
  const dot0 = useLoop({ toValue: 1, duration: 1400, delay: 0 });
  const dot1 = useLoop({ toValue: 1, duration: 1400, delay: 200 });
  const dot2 = useLoop({ toValue: 1, duration: 1400, delay: 400 });

  const simiTranslate = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const simiScale = bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });
  const shadowScale = shadow.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] });
  const shadowOpacity = shadow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.15] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.35] });
  const dotTranslates = useMemo(
    () => [dot0, dot1, dot2].map((v) => v.interpolate({ inputRange: [0, 1], outputRange: [0, -8] })),
    [dot0, dot1, dot2],
  );

  if (!visible) return null;

  return (
    <View
      style={[
        fullScreen ? styles.fullScreen : styles.inline,
        style,
      ]}
      pointerEvents="none"
    >
      {fullScreen && (
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <RadialGradient id="purple" cx="50%" cy="50%" r="60%">
              <Stop offset="0%" stopColor="#7C3AED" stopOpacity={0.15} />
              <Stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="cyan" cx="50%" cy="100%" r="50%">
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#purple)" />
          <Rect width="100%" height="100%" fill="url(#cyan)" />
        </Svg>
      )}

      <View style={styles.center}>
        <View style={styles.simiWrapper}>
          <Animated.View
            style={[
              styles.glow,
              { opacity: glowOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.floorShadow,
              { transform: [{ scaleX: shadowScale }], opacity: shadowOpacity },
            ]}
          />
          <Animated.Image
            source={SIMI_IMG}
            style={[
              styles.simi,
              { transform: [{ translateY: simiTranslate }, { scale: simiScale }] },
            ]}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {displayMessage}
        </Text>

        <View style={styles.dots}>
          {dotTranslates.map((t, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: DOT_COLORS[i], transform: [{ translateY: t }] },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  inline: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  center: {
    alignItems: 'center',
    gap: 32,
  },
  simiWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#7C3AED',
  },
  floorShadow: {
    position: 'absolute',
    bottom: -16,
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  simi: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  message: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    minHeight: 28,
    paddingHorizontal: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default SimiLoader;
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Smoke-test on device**

Temporarily replace the Login screen's loader with `<SimiLoader />`: edit `src/screens/SessionScreen/Login.tsx`, find the existing `<Loader visible={loading} />` render and swap with `<SimiLoader visible={loading} />`. Run `npx react-native run-android --mode=playDebug`, open the app, confirm bouncing Simi + rotating messages + dots animate smoothly. Revert the temp edit afterwards.

- [ ] **Step 5: Commit**

```bash
git add src/components/SimiLoader
git commit -m "feat: add SimiLoader component matching nextjs brand loader"
```

### Task 1.2: Migrate auth screens to `SimiLoader`

**Files:**
- Modify: `src/screens/SessionScreen/Login.tsx`
- Modify: `src/screens/SessionScreen/Register.tsx`
- Modify: `src/screens/SessionScreen/ForgotPassword.tsx`

- [ ] **Step 1: Replace imports and JSX in all three files**

For each file, change:
```tsx
import Loader from '@components/LoaderComponent/Loader';
// ...
<Loader visible={loading} />
```
to:
```tsx
import SimiLoader from '@components/SimiLoader/SimiLoader';
// ...
<SimiLoader visible={loading} />
```

If any call passes `size="small"` or a `message`, forward `message` only (SimiLoader has no `size`).

- [ ] **Step 2: Type-check + lint**

Run: `npx tsc --noEmit && npx eslint src/screens/SessionScreen`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/screens/SessionScreen
git commit -m "refactor: use SimiLoader in auth screens"
```

---

## Phase 2 — Skeleton system

### Task 2.1: Create Skeleton base component

**Files:**
- Create: `src/components/Skeleton/Skeleton.tsx`

- [ ] **Step 1: Write the component**

```tsx
// src/components/Skeleton/Skeleton.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch {
  // module not linked — skeleton degrades to plain box
}

type Props = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

const Skeleton: React.FC<Props> = ({ width, height, borderRadius = 8, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  return (
    <View
      style={[
        styles.base,
        { width: width as any, height, borderRadius },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX }] },
        ]}
      >
        {LinearGradient ? (
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.fallbackHighlight]} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  fallbackHighlight: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    width: 80,
  },
});

export default Skeleton;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Skeleton/Skeleton.tsx
git commit -m "feat: add shimmer Skeleton base component"
```

### Task 2.2: Create per-screen skeletons

**Files:**
- Create: `src/components/Skeleton/GamesListSkeleton.tsx`
- Create: `src/components/Skeleton/ProfileSkeleton.tsx`
- Create: `src/components/Skeleton/LeaderboardSkeleton.tsx`
- Create: `src/components/Skeleton/StatsSkeleton.tsx`
- Create: `src/components/Skeleton/GameDetailsSkeleton.tsx`

- [ ] **Step 1: GamesListSkeleton**

```tsx
// src/components/Skeleton/GamesListSkeleton.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_GAP = 10;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.25;

const GamesListSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={180} height={28} borderRadius={6} style={styles.title} />
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          borderRadius={16}
          style={styles.card}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
  },
  title: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  card: {
    marginBottom: CARD_GAP,
  },
});

export default GamesListSkeleton;
```

- [ ] **Step 2: ProfileSkeleton**

```tsx
// src/components/Skeleton/ProfileSkeleton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const ProfileSkeleton: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Skeleton width={96} height={96} borderRadius={48} />
      <View style={styles.headerText}>
        <Skeleton width={160} height={20} />
        <Skeleton width={120} height={14} />
      </View>
    </View>
    <Skeleton width={180} height={180} borderRadius={90} style={styles.ring} />
    <View style={styles.statsRow}>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} width="22%" height={80} borderRadius={12} />
      ))}
    </View>
    <Skeleton width="100%" height={160} borderRadius={16} style={styles.block} />
    <Skeleton width="100%" height={120} borderRadius={16} style={styles.block} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    gap: 8,
  },
  ring: {
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  block: {
    marginTop: 4,
  },
});

export default ProfileSkeleton;
```

- [ ] **Step 3: LeaderboardSkeleton**

```tsx
// src/components/Skeleton/LeaderboardSkeleton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const LeaderboardSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={200} height={28} borderRadius={6} />
    <Skeleton width="100%" height={40} borderRadius={12} />
    {Array.from({ length: 10 }).map((_, i) => (
      <View key={i} style={styles.row}>
        <Skeleton width={32} height={14} />
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.rowText}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="40%" height={12} />
        </View>
        <Skeleton width={60} height={18} borderRadius={6} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
});

export default LeaderboardSkeleton;
```

- [ ] **Step 4: StatsSkeleton**

```tsx
// src/components/Skeleton/StatsSkeleton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const StatsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width="100%" height={44} borderRadius={12} />
    <Skeleton width="100%" height={220} borderRadius={16} />
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} width="30%" height={70} borderRadius={12} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default StatsSkeleton;
```

- [ ] **Step 5: GameDetailsSkeleton**

```tsx
// src/components/Skeleton/GameDetailsSkeleton.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';
import { darkTheme } from '../../theme/colors';

const GameDetailsSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width="100%" height={240} borderRadius={20} />
    <Skeleton width="70%" height={28} />
    <Skeleton width="100%" height={14} />
    <Skeleton width="95%" height={14} />
    <Skeleton width="80%" height={14} />
    <Skeleton width="100%" height={52} borderRadius={26} style={styles.cta} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
    padding: 20,
    gap: 12,
  },
  cta: {
    marginTop: 24,
  },
});

export default GameDetailsSkeleton;
```

- [ ] **Step 6: Type-check + commit**

Run: `npx tsc --noEmit`
Expected: no errors.

```bash
git add src/components/Skeleton
git commit -m "feat: add per-screen skeleton placeholders"
```

### Task 2.3: Wire skeletons into screens

**Files:**
- Modify: `src/screens/GamesScreen/Games.tsx`
- Modify: `src/screens/GamesScreen/GameDetails.tsx`
- Modify: `src/screens/ProfileScreen/Profile.tsx`
- Modify: `src/screens/ProfileScreen/Stadistics.tsx`
- Modify: `src/screens/LeaderBoard/LeaderBoard.tsx`

- [ ] **Step 1: Games.tsx**

Replace the `import Loader from '@components/LoaderComponent/Loader';` line with:
```tsx
import GamesListSkeleton from '@components/Skeleton/GamesListSkeleton';
```
Find the render branch that returns `<Loader visible />` (or similar early-return while loading) and replace it with `return <GamesListSkeleton />;`. Remove any lingering `<Loader>` usages in the file.

- [ ] **Step 2: GameDetails.tsx**

Same pattern with `GameDetailsSkeleton`. Import line:
```tsx
import GameDetailsSkeleton from '@components/Skeleton/GameDetailsSkeleton';
```
Early return: `return <GameDetailsSkeleton />;`

- [ ] **Step 3: Profile.tsx**

```tsx
import ProfileSkeleton from '@components/Skeleton/ProfileSkeleton';
```
Replace loader early-return with `return <ProfileSkeleton />;`.

- [ ] **Step 4: Stadistics.tsx**

```tsx
import StatsSkeleton from '@components/Skeleton/StatsSkeleton';
```
Replace loader early-return with `return <StatsSkeleton />;`.

- [ ] **Step 5: LeaderBoard.tsx**

```tsx
import LeaderboardSkeleton from '@components/Skeleton/LeaderboardSkeleton';
```
Replace loader early-return with `return <LeaderboardSkeleton />;`.

- [ ] **Step 6: Type-check + lint**

Run: `npx tsc --noEmit && npx eslint src/screens/GamesScreen src/screens/ProfileScreen src/screens/LeaderBoard`
Expected: no errors.

- [ ] **Step 7: Smoke-test**

`npx react-native run-android --mode=playDebug`. Log in, navigate through Games / Leaderboard / Profile / Stats / GameDetails — each screen shows a shimmering placeholder first then the real content. No generic spinner.

- [ ] **Step 8: Commit**

```bash
git add src/screens/GamesScreen src/screens/ProfileScreen src/screens/LeaderBoard
git commit -m "feat: replace in-screen loaders with skeleton placeholders"
```

---

## Phase 3 — Navigation refactor

### Task 3.1: Move `AllCompetitions` into `GamesStack`

**Files:**
- Modify: `src/screens/GamesScreen/GamesStack.tsx`
- Move: `src/screens/HomeScreen/AllCompetitions.tsx` → `src/screens/GamesScreen/AllCompetitions.tsx`

- [ ] **Step 1: Physically move the file**

```bash
git mv src/screens/HomeScreen/AllCompetitions.tsx src/screens/GamesScreen/AllCompetitions.tsx
```

- [ ] **Step 2: Fix relative imports inside the moved file**

Open the new `src/screens/GamesScreen/AllCompetitions.tsx`. Any relative import like `../../...` may be one level off. Verify each import against the new location and adjust. Specifically check imports of `AuthContext`, `services/backend`, theme, and any style module. When in doubt, prefer path-alias imports (`@services/*`, `@components/*`) which work regardless of depth.

- [ ] **Step 3: Register route in GamesStack**

Replace full content of `src/screens/GamesScreen/GamesStack.tsx` with:
```tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Games from './Games';
import GameDetails from './GameDetails';
import GameIframe from './GameIframe';
import AllCompetitions from './AllCompetitions';

const Stack = createStackNavigator();

const GamesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamesMain" component={Games} />
    <Stack.Screen name="GameDetails" component={GameDetails} />
    <Stack.Screen name="GameIframe" component={GameIframe} />
    <Stack.Screen name="AllCompetitionMain" component={AllCompetitions} />
  </Stack.Navigator>
);

export default GamesStack;
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/screens/GamesScreen src/screens/HomeScreen
git commit -m "refactor: move AllCompetitions into GamesStack"
```

### Task 3.2: Make Games the first tab, remove Search & HomeStack

**Files:**
- Modify: `src/components/TabNavigatorComponent/TabNavigator.tsx`

- [ ] **Step 1: Replace tab navigator content**

Replace full content of `src/components/TabNavigatorComponent/TabNavigator.tsx` with:
```tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGamepad, faUser, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { darkTheme } from '../../theme/colors';

import GamesStack from '../../screens/GamesScreen/GamesStack';
import ProfileStack from '../../screens/ProfileScreen/ProfileStack';
import LeaderBoard from '../../screens/LeaderBoard/LeaderBoard';

import { ParamListBase, RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const tabBarIconOptions = (
    route: RouteProp<ParamListBase, string>,
    { color, size }: { color: string; size: number },
  ) => {
    let iconName = faGamepad;
    if (route.name === 'Games') iconName = faGamepad;
    else if (route.name === 'Leaderboard') iconName = faChartBar;
    else if (route.name === 'Profile') iconName = faUser;
    return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (options) => tabBarIconOptions(route, options),
        tabBarActiveTintColor: darkTheme.purple,
        tabBarInactiveTintColor: darkTheme.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Leaderboard" component={LeaderBoard} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: darkTheme.bg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.border,
    elevation: 0,
    shadowOpacity: 0,
    position: 'absolute',
  },
});

export default TabNavigation;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: errors about missing `HomeScreen/Home.tsx` references in other files — this is expected, fixed in Task 3.3.

### Task 3.3: Remove root-stack `Games` and fix Login navigation

**Files:**
- Modify: `App.tsx`
- Modify: `src/screens/SessionScreen/Login.tsx`

- [ ] **Step 1: App.tsx — remove `Games` screen from root stack**

Open `App.tsx`. Delete the import:
```tsx
import GamesStack from './src/screens/GamesScreen/GamesStack';
```
And delete the `<Stack.Screen name="Games" component={GamesStack} ... />` block inside the root `Stack.Navigator` (lines ~57-61).

- [ ] **Step 2: Login.tsx — redirect to Games instead of Home**

In `src/screens/SessionScreen/Login.tsx`, find the 3 occurrences of:
```tsx
routes: [{ name: 'MainTab', params: { screen: 'Home' } }]
```
(lines 121, 138, 190) and replace each with:
```tsx
routes: [{ name: 'MainTab', params: { screen: 'Games' } }]
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `HomeScreen/Home.tsx` references still fail, leave them — Phase 4 Task 4.2 deletes the folder entirely.

- [ ] **Step 4: Smoke-test navigation**

`npx react-native run-android --mode=playDebug`. Login → lands on Games tab. Tap game → details → iframe → back twice → back on Games tab. Tap Profile tab → profile screen. Tap Leaderboard tab → leaderboard. No "Home" tab visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/TabNavigatorComponent App.tsx src/screens/SessionScreen/Login.tsx
git commit -m "refactor: games tab becomes primary entry; drop home tab"
```

---

## Phase 4 — Profile absorbs dashboard

### Task 4.1: Port Home dashboard elements into Profile

**Files:**
- Modify: `src/screens/ProfileScreen/Profile.tsx`

- [ ] **Step 1: Read current Profile and Home**

Open both `src/screens/ProfileScreen/Profile.tsx` and `src/screens/HomeScreen/Home.tsx` side-by-side. Identify the three blocks in Home that are not in Profile yet:
1. `StatCard` 4-up grid (Ranking / Racha / Mejor / Partidas) with `ranking / streak / bestScore / totalGames`.
2. `<MiniLeaderboard users={topUsers} currentUid={uid} onViewMore={handleNavigateLeaderboard} />`.
3. `<TrophyGrid badges={badges} totalGames={totalGames} ranking={ranking} streak={streak} />` (replaces the current Badges tab content).

- [ ] **Step 2: Add state + fetch in Profile**

In `Profile.tsx`, extend the component state:
```tsx
const [ranking, setRanking] = useState<number | null>(null);
const [streak, setStreak] = useState(0);
const [bestScore, setBestScore] = useState(0);
const [totalGames, setTotalGames] = useState(0);
const [totalScore, setTotalScore] = useState(0);
const [badges, setBadges] = useState<string[]>([]);
const [topUsers, setTopUsers] = useState<TTopTwenty[]>([]);
```

Add imports at the top:
```tsx
import { getDashboardSummary, getTopTwenty, getUserBadges } from '@services/backend';
import StatCard from '@components/StatCard/StatCard';
import MiniLeaderboard from '@components/MiniLeaderboard/MiniLeaderboard';
import TrophyGrid from '@components/TrophyGrid/TrophyGrid';
import { TTopTwenty } from '../../types/user';
import { faStar, faFire, faTrophy, faGamepad } from '@fortawesome/free-solid-svg-icons';
```

Extend `fetchRankings` (rename to `fetchDashboard`) to fetch all four endpoints in parallel — copy the `Promise.all` block from `HomeScreen/Home.tsx:87-111` verbatim and set state accordingly.

- [ ] **Step 3: Add JSX blocks into Profile render**

Insert after the existing `LevelRing` hero and before the existing Stats/Badges tab switcher:
```tsx
<View style={profileStyles.statsGrid}>
  <StatCard icon={faStar} value={ranking != null && ranking > 0 ? `#${ranking}` : '--'} label="Ranking" accentColor="#FFD700" delay={0} />
  <StatCard icon={faFire} value={String(streak)} label="Racha" accentColor="#EF4444" delay={80} />
  <StatCard icon={faTrophy} value={bestScore > 0 ? bestScore.toLocaleString() : '--'} label="Mejor" accentColor="#8B5CF6" delay={160} />
  <StatCard icon={faGamepad} value={String(totalGames)} label="Partidas" accentColor="#3B82F6" delay={240} />
</View>

{topUsers.length > 0 && (
  <View style={profileStyles.glassCard}>
    <Text style={profileStyles.sectionTitle}>{'\uD83C\uDFC6'} Ranking Top 5</Text>
    <MiniLeaderboard
      users={topUsers}
      currentUid={uid}
      onViewMore={() => navigation.navigate('MainTab', { screen: 'Leaderboard' })}
    />
  </View>
)}

<View style={profileStyles.glassCard}>
  <TrophyGrid badges={badges} totalGames={totalGames} ranking={ranking} streak={streak} />
</View>
```

If `profileStyles` does not yet define `statsGrid`, `glassCard`, or `sectionTitle`, copy those rules from `src/theme/dashboardStyles.ts` into `src/screens/ProfileScreen/style/ProfileStyle.ts`.

- [ ] **Step 4: Remove the Badges inner tab**

In `Profile.tsx`, the current switch `selectedTab === 'stadistics' | 'badges'` should now show only Stats (badges are rendered via `TrophyGrid` in the dashboard block above). Remove the `badges` option from the tab selector and the conditional render for `<Badges />`. Keep `Badges.tsx` file untouched — it's now unused and will be deleted in Task 4.2.

- [ ] **Step 5: Type-check + lint**

Run: `npx tsc --noEmit && npx eslint src/screens/ProfileScreen`
Expected: no errors.

- [ ] **Step 6: Smoke-test**

Open the app, log in, navigate to Profile tab. Verify: avatar, name, LevelRing, 4 StatCards (Ranking/Racha/Mejor/Partidas), MiniLeaderboard with real users, TrophyGrid, and below that the Stats section (month filter + chart). No "Badges" tab.

- [ ] **Step 7: Commit**

```bash
git add src/screens/ProfileScreen
git commit -m "feat: profile screen absorbs home dashboard"
```

### Task 4.2: Delete HomeScreen folder and old Loader

**Files:**
- Delete: `src/screens/HomeScreen/` (entire folder)
- Delete: `src/screens/ProfileScreen/Badges.tsx`
- Delete: `src/components/LoaderComponent/` (entire folder)

- [ ] **Step 1: Migrate remaining Loader consumers**

Grep for any lingering imports:
```bash
grep -rn "LoaderComponent/Loader" src/
```
Expected remaining: `src/components/CompetitionComponent/CompetitionModal.tsx` and `src/screens/SettingsScreen/Settings.tsx`.

For each, replace:
```tsx
import Loader from '@components/LoaderComponent/Loader';
// ...
<Loader visible={true} />
```
with:
```tsx
import SimiLoader from '@components/SimiLoader/SimiLoader';
// ...
<SimiLoader visible={true} />
```

- [ ] **Step 2: Delete folders**

```bash
git rm -r src/screens/HomeScreen
git rm src/screens/ProfileScreen/Badges.tsx
git rm -r src/components/LoaderComponent
```

- [ ] **Step 3: Type-check + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors, no unused-import warnings pointing to removed paths.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove HomeScreen, old Loader, obsolete Badges tab"
```

---

## Phase 5 — GameIframe exit flow

### Task 5.1: Create `ExitGameModal`

**Files:**
- Create: `src/components/ExitGameModal/ExitGameModal.tsx`

- [ ] **Step 1: Write the modal**

```tsx
// src/components/ExitGameModal/ExitGameModal.tsx
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { darkTheme } from '../../theme/colors';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch {}

type Props = {
  visible: boolean;
  pendingPoints: number;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  onDismiss: () => void;
};

const ExitGameModal: React.FC<Props> = ({
  visible,
  pendingPoints,
  onSaveAndExit,
  onExitWithoutSaving,
  onDismiss,
}) => (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onDismiss}>
    <Pressable style={styles.backdrop} onPress={onDismiss}>
      <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
        <Text style={styles.title}>¿Salir de la partida?</Text>
        <Text style={styles.body}>
          Tienes {pendingPoints} punto{pendingPoints === 1 ? '' : 's'} sin guardar.
        </Text>

        <Pressable onPress={onSaveAndExit} style={styles.primaryWrapper}>
          {LinearGradient ? (
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primary}
            >
              <Text style={styles.primaryText}>Guardar y salir</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.primary, { backgroundColor: darkTheme.purple }]}>
              <Text style={styles.primaryText}>Guardar y salir</Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={onExitWithoutSaving} style={styles.secondary}>
          <Text style={styles.secondaryText}>Salir sin guardar</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(20,20,30,0.97)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.25)',
    padding: 20,
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 4,
  },
  primaryWrapper: {
    marginTop: 4,
  },
  primary: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExitGameModal;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ExitGameModal
git commit -m "feat: add ExitGameModal with save/discard choice"
```

### Task 5.2: GameIframe — overlay always visible + modal integration + orientation fix

**Files:**
- Modify: `src/screens/GamesScreen/GameIframe.tsx`

- [ ] **Step 1: Remove auto-hide overlay logic**

Delete the following blocks in `GameIframe.tsx`:
- Lines 369-393: `const [overlayVisible, setOverlayVisible] = useState(true);`, `overlayOpacity`, `hideTimer`, `hideOverlay`, `showOverlay`, `toggleOverlay` useCallbacks and the effect that sets `hideTimer.current = setTimeout(hideOverlay, 4000)`.
- Lines 429-437: the `{!overlayVisible && <TouchableOpacity style={styles.tapZone} ...>}` tap-zone.
- Wrap current `{overlayVisible && <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>` — replace with plain `<View style={styles.overlay}>`. Remove the now-unused `Animated` import if it becomes unused.
- Remove styles `tapZone`, `tapHint` (and any other styles only used by the auto-hide feature).

- [ ] **Step 2: Add modal state and handlers**

At the top of the component body, add:
```tsx
const [exitModalVisible, setExitModalVisible] = useState(false);
const pendingPoints = Math.max(0, Math.round(currentScore - lastSavedScoreRef.current));
```

Replace the existing `handleUpdateScore` with:
```tsx
const handleExitPress = () => {
  if (pendingPoints > 0) {
    setExitModalVisible(true);
  } else {
    navigation.goBack();
  }
};

const handleSaveAndExit = () => {
  setExitModalVisible(false);
  saveScoreDelta(true);
};

const handleExitWithoutSaving = () => {
  setExitModalVisible(false);
  // Prevent beforeRemove from re-triggering the save path
  lastSavedScoreRef.current = currentScore;
  navigation.goBack();
};
```

- [ ] **Step 3: Update `beforeRemove` listener**

Find the `useEffect` that registers `navigation.addListener?.('beforeRemove', ...)` (~line 341). Change the `if (delta > 0)` branch:
```tsx
if (delta > 0) {
  e.preventDefault();
  setExitModalVisible(true);
} else {
  setUpdateScorePerGame(true);
  setUpdateLast3MonthsScores(true);
  setUpdateUserPoints(true);
}
```
This way hardware back opens the modal instead of silently saving.

- [ ] **Step 4: Wire the modal + change exit button label**

Add the import:
```tsx
import ExitGameModal from '@components/ExitGameModal/ExitGameModal';
```

In the JSX, find the `<TouchableOpacity onPress={handleUpdateScore}` and replace with `onPress={handleExitPress}`. Replace the label "Guardar y salir" with "Salir":
```tsx
const exitButtonContent = <Text style={styles.exitButtonText}>Salir</Text>;
```

At the end of the returned JSX (after the overlay), render the modal:
```tsx
<ExitGameModal
  visible={exitModalVisible}
  pendingPoints={pendingPoints}
  onSaveAndExit={handleSaveAndExit}
  onExitWithoutSaving={handleExitWithoutSaving}
  onDismiss={() => setExitModalVisible(false)}
/>
```

Adjust overlay background opacity: in `styles.overlayBar`, change `backgroundColor: 'rgba(0, 0, 0, 0.65)'` → `'rgba(0, 0, 0, 0.45)'`.

- [ ] **Step 5: Orientation fix**

Find the existing effect:
```tsx
return () => Orientation.unlockAllOrientations();
```
Replace with:
```tsx
return () => Orientation.lockToPortrait();
```

- [ ] **Step 6: Guard `addCompetitionSession`**

Inside `saveScoreDelta`, wrap the call:
```tsx
if (response?.session_id) {
  try {
    await addCompetitionSession(response.session_id);
  } catch (err) {
    if (__DEV__) console.log('[DEBUG GameIframe] competition session failed:', err);
  }
  setSession(newGameSession);
}
```

- [ ] **Step 7: Type-check + lint**

Run: `npx tsc --noEmit && npx eslint src/screens/GamesScreen/GameIframe.tsx`
Expected: no errors.

- [ ] **Step 8: Smoke-test on emulator**

`npx react-native run-android --mode=playDebug`. Open a landscape game (e.g. juego1): exit button visible top-right from second one, stays visible, no auto-hide. Tap it with 0 pending delta → exits immediately. Reopen, play briefly until currentScore increases, tap "Salir" → modal appears with correct pending points. Test "Salir sin guardar" (returns without posting, score doesn't change server-side) and "Guardar y salir" (posts, Profile reflects new total). Test hardware back button → same modal. Open a vertical game (juego13) → tab bar returns to portrait after exit.

- [ ] **Step 9: Commit**

```bash
git add src/screens/GamesScreen/GameIframe.tsx
git commit -m "fix: always-visible exit overlay with save confirmation modal"
```

---

## Phase 6 — Native splash

### Task 6.1: Clean iOS LaunchScreen

**Files:**
- Modify: `ios/SimiJuegos/LaunchScreen.storyboard`

- [ ] **Step 1: Edit storyboard**

Open `ios/SimiJuegos/LaunchScreen.storyboard` in a text editor. Find the two `<label>` elements: the one with `text="SimiJuegos"` and the one with `text="Powered by React Native"` (around lines 15-27). Delete both `<label>...</label>` elements entirely.

Add inside the `<subviews>` block of the root view a single centered `UIImageView`:
```xml
<imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFit"
           horizontalHuggingPriority="251" verticalHuggingPriority="251"
           image="SimiLogo" translatesAutoresizingMaskIntoConstraints="NO" id="simi-logo">
    <rect key="frame" x="107.5" y="313.5" width="160" height="160"/>
</imageView>
```
Add constraints to center horizontally and vertically (Xcode auto-generates these; if editing by hand, use the existing constraint block as reference).

Change the root view background color to black: find `<color key="backgroundColor" ...>` and set `red="0" green="0" blue="0" alpha="1" colorSpace="custom" customColorSpace="sRGB"`.

- [ ] **Step 2: Add `SimiLogo` to iOS asset catalog**

Copy `img/iconos/SimiLogo.png` into `ios/SimiJuegos/Images.xcassets/SimiLogo.imageset/`. Create a `Contents.json` listing the image for `1x/2x/3x` scales (duplicate the file if only one size is available).

- [ ] **Step 3: Commit**

```bash
git add ios/SimiJuegos
git commit -m "fix(ios): replace react-native launch text with simi logo on black"
```

### Task 6.2: Android bootsplash

**Files:**
- Generated by CLI: `android/app/src/main/res/drawable/bootsplash.xml` and related assets
- Modify: `android/app/src/main/res/values/styles.xml`
- Modify: `android/app/src/main/java/com/simijuegos/MainActivity.{java|kt}` (exact file depends on project — find it with `ls android/app/src/main/java/com/simijuegos/`)

- [ ] **Step 1: Generate Android splash assets**

Run:
```bash
npx react-native-bootsplash generate ./img/iconos/SimiLogo.png --background="#000000" --platforms=android
```
Expected: assets generated in `android/app/src/main/res/drawable-*` and a `bootsplash.xml` under `res/drawable/`.

- [ ] **Step 2: Update Android styles.xml**

Replace `android/app/src/main/res/values/styles.xml` with:
```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>

    <style name="BootTheme" parent="Theme.BootSplash">
        <item name="bootSplashBackground">@color/bootsplash_background</item>
        <item name="bootSplashLogo">@drawable/bootsplash_logo</item>
        <item name="postBootSplashTheme">@style/AppTheme</item>
    </style>
</resources>
```

- [ ] **Step 3: Update `MainActivity`**

Open the MainActivity file (Java or Kotlin — inspect the project). Follow the `react-native-bootsplash` README for RN 0.75 integration: import `RNBootSplash` and call `RNBootSplash.init(this, R.style.BootTheme)` inside `onCreate`, before `super.onCreate(savedInstanceState)`.

The library's README has current RN-0.75-compatible snippets. Use whichever language matches the existing file.

- [ ] **Step 4: Update AndroidManifest**

In `android/app/src/main/AndroidManifest.xml`, ensure the main activity uses the boot theme:
```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/BootTheme"
    ...>
```

- [ ] **Step 5: Commit**

```bash
git add android
git commit -m "feat(android): native bootsplash with simi logo"
```

### Task 6.3: Hide bootsplash in `App.tsx`

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Wire `BootSplash.hide` on mount**

At the top of `App.tsx`:
```tsx
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
```
Inside the `App` component body (before the return):
```tsx
useEffect(() => {
  BootSplash.hide({ fade: true });
}, []);
```

- [ ] **Step 2: Type-check + smoke-test**

Run: `npx tsc --noEmit`, then `npx react-native run-android --mode=playDebug`. Kill and relaunch the app. Expected: no white flash, brief black splash with Simi logo, fades into Login.

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat: hide native bootsplash after mount"
```

---

## Phase 7 — Cleanup

### Task 7.1: Remove commented Search tab (if any slipped in)

- [ ] **Step 1: Verify**

Run: `grep -n "Search" src/components/TabNavigatorComponent/TabNavigator.tsx`
Expected: no matches (already removed in Task 3.2).

If the grep finds anything, delete those lines and commit as `chore: remove dead Search tab references`.

### Task 7.2: `DR_SIMI_INVADE` env cleanup (pending URL from user)

**Blocked until user provides the production URL for `DR_SIMI_INVADE`.**

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Once URL received**

Update both files:
```
DR_SIMI_INVADE=<production-url>
```
in `.env`, and in `.env.example` use a neutral placeholder like `https://example.com/dr-simi-invade`.

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update DR_SIMI_INVADE placeholder"
```
Do NOT commit `.env` (should already be gitignored — verify with `git check-ignore .env`).

### Task 7.3: Update `MEMORY.md`

**Files:**
- Modify: `C:/Users/ivanm/.claude/projects/C--Mobil-Simi/memory/MEMORY.md`
- Modify: the linked notes inside that memory folder reflecting the old navigation tree.

- [ ] **Step 1: Update project memory**

Open `MEMORY.md`. Update the project structure section: note that `HomeScreen/` was deleted, Games is the first tab, Profile now owns the dashboard. Add a one-line pointer to the new spec and plan paths. Keep the index under 200 lines.

- [ ] **Step 2: Commit (user memory is outside the repo — no git commit)**

Memory files live in `~/.claude/projects/C--Mobil-Simi/memory/` (not tracked in git). Just save.

---

## Phase 8 — Final QA and ship

### Task 8.1: Full-app verification

- [ ] **Step 1: Run the manual checklist from the spec**

From `docs/superpowers/specs/2026-04-20-ux-critical-fixes-design.md` §Testing, verify each bullet on a real device or emulator. Track results inline in the commit body if anything is flaky.

- [ ] **Step 2: Type-check + lint full repo**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

### Task 8.2: Push

- [ ] **Step 1: Push branch**

```bash
git push origin feature/entrega-marzo-2026
```

- [ ] **Step 2: Confirm CI passes** (if CI is configured)

---

## Self-review

- **Spec coverage:**
  - §1 navigation refactor → Tasks 3.1–3.3, 4.1–4.2 ✅
  - §2 SimiLoader → Tasks 1.1, 1.2, 4.2 (migrating remaining consumers) ✅
  - §3 Native splash → Tasks 6.1–6.3 ✅
  - §4 Skeletons → Tasks 2.1–2.3 ✅
  - §5 GameIframe exit modal → Tasks 5.1–5.2 ✅
  - §6 Secondary fixes (orientation, try/catch, Search tab, DR_SIMI_INVADE, MEMORY.md) → Tasks 5.2, 7.1, 7.2, 7.3 ✅
- **Placeholder scan:** No TBDs. Every code block is complete. All file paths are absolute from repo root. The only pending item is Task 7.2 (clearly blocked on user input, flagged in plan header of that task).
- **Type consistency:** Component names stable across tasks — `SimiLoader`, `Skeleton`, `GamesListSkeleton`, `ProfileSkeleton`, `LeaderboardSkeleton`, `StatsSkeleton`, `GameDetailsSkeleton`, `ExitGameModal`. Navigation names stable — `Games`, `Leaderboard`, `Profile`, `GamesMain`, `GameDetails`, `GameIframe`, `AllCompetitionMain`, `MainTab`.
