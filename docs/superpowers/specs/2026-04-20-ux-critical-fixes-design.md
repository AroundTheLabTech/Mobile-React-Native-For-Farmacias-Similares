# UX Critical Fixes — Design Spec

**Date:** 2026-04-20
**Author:** Iván (ivan@mossaic.mx) + Claude
**Status:** Approved (pending user review)
**Scope:** SimiJuegos Mobile (React Native 0.75.3)

## Problem

The mobile app has 4 UX-blocking issues that need to be fixed before the March 16 delivery:

1. **iOS launch screen shows "Powered by React Native"** (default template text). Android has no splash at all (white screen at cold start).
2. **Exit button inside games auto-hides after 4 seconds** and only reappears via an invisible tap-zone at the top of the screen → users think there is no way to exit.
3. **No skeleton loaders** — every screen uses a full-screen generic spinner, producing a slow perception of loading.
4. **Home tab shows a profile dashboard**, not games. Games are hidden behind a "Jugar Ahora" CTA, which is an extra tap on the app's core feature. Home and Profile are largely duplicated (both show avatar, LevelRing, stats, trophies).

## Goals

- Game catalog is the first thing the user sees after login.
- App has a branded, delightful loading experience consistent with the Next.js web platform.
- Users can exit a game at any moment with one tap, saving progress safely.
- Lists and dashboards feel fast via skeletons instead of blocking spinners.
- No duplication between tabs; Profile is the single source of "my stats".

## Non-Goals

- Redesigning the visual system (colors, typography).
- Introducing Lottie or other new animation runtimes — we use `Animated` + `react-native-linear-gradient` which are already linked.
- Refactoring game scoring strategies inside `GameIframe`.
- Touching the Next.js reference project. Only mobile + backend (`gametropolis-backend-317975793418.us-east1.run.app`) are in scope.

## Environment

- **Backend:** `https://gametropolis-backend-317975793418.us-east1.run.app` (Cloud Run, us-east1) — verified alive (200 OK) on 2026-04-20. This is the only backend in scope; any endpoint changes required by this spec are applied here.
- **Mobile `.env`:** loaded via `react-native-dotenv`. Variables in use: `BACKEND_BASE_URL`, Firebase keys.

## Design

### 1. Navigation architecture

**Current:**
```
TabNavigator: Home (HomeStack) | Leaderboard | Profile
Root Stack:   Login | Register | ForgotPassword | MainTab | Settings | Games (GamesStack)
```
- `HomeScreen/Home.tsx` — profile dashboard (avatar, LevelRing, StatCards, MiniLeaderboard, TrophyGrid, CTA → Games).
- `HomeScreen/Games.tsx` — duplicate games grid (unused from the main flow).
- `GamesScreen/GamesStack.tsx` — catalog → `GameDetails` → `GameIframe`.
- `ProfileScreen/Profile.tsx` — avatar, LevelRing, 2 tabs: Stats, Badges.

**Target:**
```
TabNavigator: Games (GamesStack) | Leaderboard | Profile
Root Stack:   Login | Register | ForgotPassword | MainTab | Settings
```

- `GamesStack` becomes the first tab (icon: `faGamepad`). Stack: `GamesList` → `GameDetails` → `GameIframe` → `AllCompetitions` (moved from HomeStack).
- `Profile` absorbs the dashboard: avatar header + LevelRing + `StatCard` grid (Ranking / Racha / Mejor / Partidas) + `MiniLeaderboard` + `TrophyGrid`. The existing `Stats` and `Badges` inner tabs stay but share the new hero.
- `HomeScreen/` folder is deleted entirely.
- The redundant `Games` entry in the root `Stack.Navigator` is removed — `GamesStack` lives inside the tab navigator.
- `AllCompetitions.tsx` is moved under `GamesStack` so it remains reachable.
- Commented `Search` tab is removed from `TabNavigator` (dead code).

**Deep-link preservation:** any existing `navigation.navigate('Games')` or `navigation.navigate('MainTab', { screen: 'Home' })` is updated to `navigation.navigate('MainTab', { screen: 'Games' })`. Affected callers are audited during implementation.

### 2. SimiLoader component

Port the Next.js `SimiLoader` (`src/components/ui/SimiLoader.js`) to React Native as `src/components/SimiLoader/SimiLoader.tsx`.

**Props:**
```ts
type SimiLoaderProps = {
  message?: string;        // optional fixed message, else rotates
  visible?: boolean;       // default true; when false renders null
  fullScreen?: boolean;    // default true; if false renders inline centered
};
```

**Layout (full-screen mode):**
- Absolute-fill container, `backgroundColor: #000`.
- Ambient background: two radial gradients. Implementation uses `react-native-svg` `RadialGradient` inside a `<Svg>` filling the screen — one centered (purple `rgba(124,58,237,0.15)` → transparent at 60%), one at bottom (cyan `rgba(6,182,212,0.08)` → transparent at 50%).
- Centered column (`gap: 32`):
  - Simi image 120×120, `borderRadius: 24`, source `require('../../../img/personajes/doctor-simi-invade.png')`. Behind it an absolute blur-glow ring (`-inset: 24`, gradient purple→cyan, `opacity: 0.2`). Under it a floor shadow ellipse (`width: 80, height: 16, rgba(255,255,255,0.1)`).
  - Message text: `Inter` 20px, color `rgba(255,255,255,0.9)`, `minHeight: 28`, center-aligned.
  - 3 dots row, 12px circles, colors `#7C3AED`, `#9333EA`, `#06B6D4`, gap 8.

**Animations (all via `Animated.Value` + `Animated.loop`, native driver where possible):**
- `simi-bounce`: `translateY 0 → -20 → 0` and `scale 1 → 1.05 → 1`, 1000ms ease-in-out, infinite.
- `shadow-pulse`: `scaleX 1 → 0.7 → 1`, `opacity 0.3 → 0.15 → 0.3`, 1000ms, infinite.
- `glow-pulse`: `opacity 0.2 → 0.35 → 0.2`, 1200ms, infinite.
- `dot-bounce` per dot: `translateY 0 → -8 → 0`, 1400ms, infinite, with delays 0ms / 200ms / 400ms.

**Messages:** identical to the Next.js array:
```
"Preparando la diversión...",
"El Doctor Simi está listo para jugar...",
"Cargando tus juegos favoritos...",
"Calentando motores...",
"¡Casi listo para la acción!",
"Afinando los controles...",
"Despertando al Doctor Simi..."
```
When `message` prop is passed, it overrides rotation. Otherwise pick a random initial message, then rotate every 2500ms.

**Usage rule:** `SimiLoader` is the branded loader for cold starts, route transitions, blocking flows (Login submit, first app load). Inside tab content, prefer per-screen skeletons.

**Callers migrated (Loader → SimiLoader):**
- `src/screens/HomeScreen/Home.tsx` (deleted anyway)
- `src/screens/GamesScreen/Games.tsx` (replaced by skeleton — see §3)
- `src/screens/GamesScreen/GameDetails.tsx`
- `src/screens/ProfileScreen/Profile.tsx` (replaced by skeleton)
- `src/screens/ProfileScreen/Stadistics.tsx` (replaced by skeleton)
- `src/screens/ProfileScreen/Badges.tsx`
- `src/screens/LeaderBoard/LeaderBoard.tsx` (replaced by skeleton)
- `src/screens/SessionScreen/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx` (keep `SimiLoader` — blocking auth flow)

After migration, `src/components/LoaderComponent/Loader.tsx` is deleted.

### 3. Native splash screens

Goal: eliminate "Powered by React Native" and the Android white flash, transitioning smoothly to the React Native `SimiLoader`.

**Library:** `react-native-bootsplash` (version compatible with RN 0.75.3, MIT, actively maintained, native-only — no JS overhead).

**Asset:** `img/iconos/SimiLogo.png` centered on `#000` background.

**iOS:**
- Edit `ios/SimiJuegos/LaunchScreen.storyboard`: remove the "SimiJuegos" and "Powered by React Native" labels, set background to `#000`, add a single centered `UIImageView` using `SimiLogo`.
- Run `npx react-native-bootsplash generate ./img/iconos/SimiLogo.png --background=#000000 --platforms=ios,android` to generate assets.

**Android:**
- Install `react-native-bootsplash`, link native module.
- Configure `MainActivity.java/kt` per library docs.
- Update `styles.xml` to use the generated `BootTheme`.

**Transition:** after `App.tsx` mounts and the root `AuthProvider`/`UserProvider` are ready, call `BootSplash.hide({ fade: true })` so the native splash dissolves into the first RN screen (Login's `SimiLoader` or the post-login screen's skeleton).

### 4. Skeleton loaders

Base component `src/components/Skeleton/Skeleton.tsx`:
```ts
type SkeletonProps = {
  width: number | string;
  height: number;
  borderRadius?: number; // default 8
  style?: ViewStyle;
};
```
Implementation: absolute-filled box with base color `rgba(255,255,255,0.05)`. A child `Animated.View` with a linear gradient (`rgba(255,255,255,0)` → `rgba(255,255,255,0.12)` → `rgba(255,255,255,0)`) translates horizontally from `-100%` to `100%` over 1200ms in an infinite loop — classic shimmer.

Per-screen skeletons in `src/components/Skeleton/`:
- `GamesListSkeleton.tsx` — 6 card placeholders matching the existing grid spacing (`HORIZONTAL_PADDING = 20`, `CARD_GAP = 10`).
- `ProfileSkeleton.tsx` — avatar circle 96×96, name bar, LevelRing circle 180×180, 4 StatCard boxes, TrophyGrid rows.
- `LeaderboardSkeleton.tsx` — 10 rows: circle avatar + 2 text bars + trailing points bar.
- `StatsSkeleton.tsx` — OptionSelect bar + BarChart rectangle.
- `GameDetailsSkeleton.tsx` — cover image box + title bar + 3 description bars + play button.

**Rule:** each screen imports its matching skeleton and renders it while `loading === true`. `SimiLoader` is no longer used inside tab content.

### 5. GameIframe exit button + confirmation modal

Changes in `src/screens/GamesScreen/GameIframe.tsx`:

- Remove auto-hide logic: `overlayVisible` state, `overlayOpacity` Animated.Value, `hideTimer`, `hideOverlay`, `showOverlay`, `toggleOverlay`, `tapZone`, `tapHint`. Overlay is always rendered.
- Overlay remains floating top-right but uses `rgba(0,0,0,0.45)` background so it doesn't obstruct the game.
- Exit button: shorter label **"Salir"** (previously "Guardar y salir"). The save-and-exit behavior is unchanged.
- Score pill stays on the left of the overlay bar.
- **Confirmation modal** (`react-native` `Modal`, transparent, centered card):
  - Trigger: tap on "Salir" when `currentScore > lastSavedScoreRef.current` (there is pending score to save).
  - Card: dark glass (`rgba(20,20,30,0.95)`, border `rgba(124,58,237,0.25)`, radius 16, padding 20).
  - Title: "¿Salir de la partida?"
  - Body: "Tienes {delta} puntos sin guardar."
  - Primary button (gradient purple→cyan): "Guardar y salir" → calls existing `saveScoreDelta(true)`.
  - Secondary button (ghost): "Salir sin guardar" → calls `navigation.goBack()` directly (skips save, resets `lastSavedScoreRef` to avoid double-save in `beforeRemove`).
  - Close / tap-outside: dismisses modal, stays in game.
  - When `currentScore === lastSavedScoreRef.current` (nothing to save), skip modal → `navigation.goBack()` directly.
- `beforeRemove` listener is kept as a safety net (hardware back button), but now integrates with the modal flow: if a pending delta exists and the modal is not open, it prevents navigation and opens the modal instead of silently saving.

### 6. Secondary fixes (bundled)

- Fix orientation leak on game exit: in `GameIframe` cleanup effect, replace `Orientation.unlockAllOrientations()` with an explicit `Orientation.lockToPortrait()` so the tab bar never renders in landscape after a vertical game.
- Wrap `addCompetitionSession` in its own try/catch inside `saveScoreDelta` so a competition failure does not block the primary score save.
- Remove commented `Search` tab in `TabNavigator.tsx`.
- **Replace `DR_SIMI_INVADE` env var**: currently set to `http://192.168.0.9:3000` (local LAN IP) in both `.env` and `.env.example`. Search confirms no runtime references in `src/`, but the variable is declared and may be wired up later for the Doctor Simi Invade game (juego 18). User will provide the production URL in a follow-up message. Implementation step: update `.env` and `.env.example` with the new URL once received; leave existing keys untouched until then to avoid breaking the local dev setup.
- Update `MEMORY.md` project section to reflect the new navigation tree and deleted `HomeScreen/` folder.

## Affected Files

**New:**
- `src/components/SimiLoader/SimiLoader.tsx`
- `src/components/SimiLoader/style.ts`
- `src/components/Skeleton/Skeleton.tsx`
- `src/components/Skeleton/GamesListSkeleton.tsx`
- `src/components/Skeleton/ProfileSkeleton.tsx`
- `src/components/Skeleton/LeaderboardSkeleton.tsx`
- `src/components/Skeleton/StatsSkeleton.tsx`
- `src/components/Skeleton/GameDetailsSkeleton.tsx`
- `src/components/ExitGameModal/ExitGameModal.tsx`

**Modified:**
- `App.tsx` (remove `Games` root-stack screen, hide bootsplash after mount)
- `src/components/TabNavigatorComponent/TabNavigator.tsx` (Games as first tab, remove Search)
- `src/screens/GamesScreen/GamesStack.tsx` (entry point, hosts `AllCompetitions`)
- `src/screens/GamesScreen/Games.tsx` (skeleton replaces loader, nav adjustments)
- `src/screens/GamesScreen/GameDetails.tsx` (skeleton, SimiLoader fallback)
- `src/screens/GamesScreen/GameIframe.tsx` (overlay always visible, exit modal, orientation fix, competition try/catch)
- `src/screens/ProfileScreen/Profile.tsx` (absorb dashboard: StatCard grid, MiniLeaderboard, TrophyGrid)
- `src/screens/ProfileScreen/Stadistics.tsx`, `Badges.tsx` (skeleton)
- `src/screens/LeaderBoard/LeaderBoard.tsx` (skeleton)
- `src/screens/SessionScreen/Login.tsx`, `Register.tsx`, `ForgotPassword.tsx` (SimiLoader)
- `ios/SimiJuegos/LaunchScreen.storyboard` (Simi logo only, black bg)
- `android/app/src/main/res/values/styles.xml` (`BootTheme`)
- `android/app/src/main/AndroidManifest.xml` / `MainActivity` (bootsplash integration)
- `package.json` (`react-native-bootsplash`, `react-native-svg` if not present)

**Deleted:**
- `src/screens/HomeScreen/` (Home.tsx, HomeStack.tsx, AllCompetitions.tsx [moved], Games.tsx [duplicate], imageMapping.tsx, style/)
- `src/components/LoaderComponent/Loader.tsx`

## Dependencies to add

- `react-native-bootsplash` — native splash (iOS + Android).
- `react-native-svg` — only if not already installed (check `package.json` during implementation). Used for radial gradients in `SimiLoader`.

No other new libs. `react-native-linear-gradient` and `Animated` cover the rest.

## Testing

Manual verification (no test framework is set up in the project):
- Cold start on iOS: native splash shows Simi logo on black, no "Powered by React Native" text, fades smoothly into Login.
- Cold start on Android: no white flash, native splash shows Simi logo on black.
- After login: Games tab is the first screen, shows skeleton for ~1s then real grid.
- Switching to Profile shows skeleton, then renders absorbed dashboard (stats + trophies + mini-leaderboard).
- Entering a game: overlay (score pill + "Salir" button) is visible immediately and stays visible throughout the game.
- Tapping "Salir" with a pending score delta: modal appears with "Guardar y salir" / "Salir sin guardar".
- Tapping "Guardar y salir": score is posted, user returns to Games tab, points updated in Profile.
- Tapping "Salir sin guardar": returns immediately without posting.
- Hardware back on Android during game: same modal flow.
- Vertical games (13, 14, 16): app returns to portrait tab bar after exit.

## Rollout

Single PR branch. Phase 3 scope (visual/UX improvements) per the March planning. Target: merge before March 12 for functional testing window.

## Open questions

- **Pending from user:** production URL for `DR_SIMI_INVADE` (currently `http://192.168.0.9:3000`). The rest of the spec does not block on this — cleanup applies once the URL arrives.

All other design decisions confirmed with user on 2026-04-20:
- Navigation refactor: Option 1 (Home → Games, Profile absorbs dashboard).
- SimiLoader: replicate Next.js version 1:1.
- Exit button: show confirmation modal when there is pending score.
- MiniLeaderboard stays in Profile.
- SimiLoader image: `doctor-simi-invade.png`.
- Scope: mobile app + deployed backend only; Next.js project ignored.
