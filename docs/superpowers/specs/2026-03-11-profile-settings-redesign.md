# Profile & Settings UI Redesign

**Date**: 2026-03-11
**Goal**: Redesign Profile and Settings screens to follow the NextJS web app's visual language while keeping the purple theme and separate screen structure.

## Design Decisions

- **Structure**: Profile and Settings remain as separate screens (Profile -> Settings via config icon)
- **Theme**: Purple theme modernized with glassmorphic cards, gradients, and semi-transparency (NOT dark theme)
- **New feature**: Level system with circular progress ring (Novato -> Leyenda)
- **Reference**: `Games-Platform-for-Doctor-Simi-NextJS/src/views/PerfilSection/UserComponent.js`
- **Stats deviation from web**: The web shows Level, Juegos Jugados, Puntuacion Total. The mobile version keeps **Level, Top Mundial, Top Mensual** instead, because the mobile app already has these endpoints/data and they are more relevant for the competitive mobile context.

## Color System Updates

File: `<project-root>/global-class.tsx` (at the root of the RN project, NOT in `src/`)

Add to the existing `colors` object:

```typescript
darkPurpleBg: '#1a1040',
cardBg: 'rgba(255,255,255,0.06)',
cardBorder: 'rgba(255,255,255,0.10)',
cyan: '#06B6D4',
gold: '#FFD700',
danger: '#EF4444',
```

Level colors are defined in the LEVELS constant (see below), not in global-class.

## Level System

New file `src/utils/levels.ts` (using existing `src/utils/` directory):

```typescript
export const LEVELS = [
  { level: 1, name: "Novato", minScore: 0, maxScore: 500, color: "#6B7280" },
  { level: 2, name: "Aprendiz", minScore: 500, maxScore: 1500, color: "#10B981" },
  { level: 3, name: "Jugador", minScore: 1500, maxScore: 3000, color: "#3B82F6" },
  { level: 4, name: "Veterano", minScore: 3000, maxScore: 5000, color: "#8B5CF6" },
  { level: 5, name: "Experto", minScore: 5000, maxScore: 8000, color: "#F59E0B" },
  { level: 6, name: "Maestro", minScore: 8000, maxScore: 12000, color: "#EF4444" },
  { level: 7, name: "Leyenda", minScore: 12000, maxScore: Infinity, color: "#EC4899" },
];

export function getUserLevel(score: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return LEVELS[i];
  }
  return LEVELS[0];
}
```

## Screen 1: Profile Screen

### Layout (top to bottom, scrollable)

**1. Header Bar**
- Purple gradient background (existing `background2`)
- Config icon (gear) top-right -> navigates to Settings via `navigation.navigate('Settings')` (existing route name, do not change)
- No change in navigation behavior

**2. Avatar Section**
- Circular avatar (responsiveWidth(90)) with gradient ring border (purple->cyan)
- Glow effect: use `elevation: 10` on Android + a wrapper View with semi-transparent purple background (borderRadius 50%, slightly larger) to simulate colored glow. RN does not support CSS `box-shadow`.
- User name below avatar: `fonts.inter`, fontWeight 700, `fontSizes.xxl`, `colors.primary` (white)
- Email below name: `colors.primaryDegrad50` (white at 50% opacity)

**3. Stats Row** (replaces current purple bar)
- Horizontal row of 3 stat cards using `flexDirection: 'row'`
- Each card: `colors.cardBg` bg, `colors.cardBorder` borderWidth 1, borderRadius 16

Card 1 - Level:
- SVG circular progress ring (responsiveWidth(72) diameter) using `react-native-svg` (already installed)
- Ring background: `rgba(255,255,255,0.1)`, strokeWidth 6
- Ring progress: colored by current level, strokeWidth 6, strokeLinecap "round"
- SVG math: viewBox="0 0 100 100", radius=42, circumference = 2 * PI * 42 = ~264. strokeDasharray=264, strokeDashoffset = 264 - (264 * progressPercent / 100). Rotate -90deg to start from top.
- Center: level number in `fonts.press` font via `react-native-svg` Text component
- Right side: "Nivel Actual" label (`fontSizes.xxs`), level name (colored), XP count (`fontSizes.xs`)
- Level data from `userPoints.score_total` via UserContext (no extra API call)

Card 2 - Top Mundial:
- Globe icon (FontAwesome `faGlobe`) in a 44px View with gradient-like bg
- "Top Mundial" label (`fontSizes.xxs`), position number (`fontSizes.xl`), "ranking global" subtext (`fontSizes.xs`)

Card 3 - Top Mensual:
- Cube icon (FontAwesome `faCube`) in a 44px View with gradient-like bg
- "Top Mensual" label (`fontSizes.xxs`), position number (`fontSizes.xl`), "ranking mensual" subtext (`fontSizes.xs`)

**4. Tab Navigation**
- Same tabs: Insignias | Estadisticas
- Active tab: gradient underline View (3px height, purple->cyan via LinearGradient or two-tone View) instead of ellipse dot
- Inactive tab: `colors.primaryDegrad50`

**5. Tab Content**
- Badges and Statistics remain functionally unchanged
- Statistics cards get glassmorphic styling (semi-transparent bg + subtle border)

### Files Modified
- `src/screens/ProfileScreen/Profile.tsx` -- new layout, level ring, updated stats
- `src/screens/ProfileScreen/style/ProfileStyle.tsx` -- complete restyle
- `src/screens/ProfileScreen/Stadistics.tsx` -- minor style updates for glassmorphic cards
- `src/screens/ProfileScreen/style/StadiscticsStyle.tsx` -- glassmorphic card styles
- `src/screens/ProfileScreen/Badges.tsx` -- minor style alignment
- `src/screens/ProfileScreen/style/BadgesStyle.tsx` -- glassmorphic card styles

### New Files
- `src/utils/levels.ts` -- level definitions and getUserLevel helper
- `src/components/LevelRing/LevelRing.tsx` -- SVG circular progress component

### Dependencies
- `react-native-svg` -- already installed (v15.7.1), no action needed

## Screen 2: Settings Screen

### Layout (top to bottom, scrollable)

Background: purple gradient (same as profile, `colors.background2`)

**1. Header**
- Back arrow (FontAwesome `faArrowLeft`) left -> `navigation.goBack()`
- Title "Configuracion" center, `fonts.inter`, fontWeight 700, `fontSizes.xl`, white

**2. Game Card Display** (new design, replaces current card)
- Glassmorphic card with purple gradient overlay (`colors.cardBg` base + subtle purple tint)
- "GAME CARD" label in `fonts.press`, `fontSizes.xxs`, white at 70% opacity
- Card holder name: `fonts.inter`, fontWeight 600, `fontSizes.lg`, white
- Card number formatted (0000-0000-0000): `fonts.press`, `fontSizes.xs`, white at 70% opacity, letterSpacing 2
- Score pill: dark bg (`rgba(0,0,0,0.3)`) rounded View with coin icon Image + gold text (`colors.gold`)

**3. Info Personal Card** (replaces AccountCenter screen)
- Glassmorphic card (`colors.cardBg`, `colors.cardBorder`)
- Header: "Informacion Personal" + edit/save TouchableOpacity icon buttons
- 2-column layout using flexDirection row + flexWrap: Nombre, Email (read-only), Ubicacion, Edad
- Labels: textTransform uppercase, `fontSizes.xxs`, white at 50% opacity
- Values: `fonts.inter`, fontWeight 500, `fontSizes.sm`, white
- Edit mode: TextInput with borderColor `colors.third` (purple), borderWidth 1, borderRadius 8
- Validation preserved from AccountCenter: empty field checks, age > 0
- API: `putUserInformation(uid, data)` -- same endpoint
- Uses `userInformation` from UserContext + `setUpdateUserInformation(true)` on save

**4. Avatar Selection Card** (replaces ProfilePicture screen)
- Glassmorphic card
- Header: "Elige tu Avatar"
- Grid: 4 per row using flexDirection row + flexWrap wrap
- Avatar images: handle both PNG and SVG formats (use Image for PNG, SvgUri for SVG -- preserve existing conditional check from ProfilePicture.tsx)
- Selected: cyan border (`colors.cyan`) + `elevation: 6` shadow + checkmark View (gradient circle, bottom-right, absolute positioned)
- Unselected: transparent border
- "Guardar Avatar" button: full-width, gradient purple->cyan (use LinearGradient or solid `colors.third` as fallback), borderRadius 12
- API: `getUserProfilePictures(uid)` for list, `updateUserProfilePicture(uid, url)` for save

**5. Account Card**
- Glassmorphic card
- Header: "Cuenta"
- List items with icon Views (responsiveWidth(36), rounded, `rgba(255,255,255,0.05)` bg):
  - Email verificado: mail icon + email text + green verified badge View (28px circle, green bg, white checkmark Text)
  - Miembro desde: game controller icon + "SimiJuegos Player"
  - Reportar problema: report icon -> `navigation.navigate('ReportProblem')`
  - Cerrar Sesion: door icon + "Salir de tu cuenta" desc + red "Salir" TouchableOpacity (bg `rgba(239,68,68,0.1)`, border `rgba(239,68,68,0.3)`, text `colors.danger`)
- Logout preserves existing flow: `await logout()` then `navigation.reset({ index: 0, routes: [{ name: 'Login' }] })`

**6. Loading State**
- Show `<Loader>` component while game card, user info, and profile pictures are loading
- Use Promise.all for parallel fetches

### Files Modified
- `src/screens/SettingsScreen/Settings.tsx` -- complete rewrite with all sections inline
- `src/screens/SettingsScreen/style/SettingsStyles.tsx` -- complete restyle
- `src/screens/SettingsScreen/ReportProblem.tsx` -- minor glassmorphic style update
- `src/screens/SettingsScreen/style/ReportProblemStyles.tsx` -- glassmorphic styles
- `src/screens/SettingsScreen/SettingsStack.tsx` -- remove ProfilePicture and AccountCenter routes (keep Settings + ReportProblem only)

### Files Removed (functionality merged into Settings)
- `src/screens/SettingsScreen/ProfilePicture.tsx`
- `src/screens/SettingsScreen/style/ProfilePictureStyles.tsx`
- `src/screens/SettingsScreen/AccountCenter.tsx`
- `src/screens/SettingsScreen/style/AccountCenterStyles.tsx`

## Shared Changes

### global-class.tsx (project root)
- Add new color constants to the `colors` object
- Add glassmorphic card shared style export
- No changes to existing colors (backward compatible)

```typescript
// Add to global-class.tsx as a named export
export const glassmorphicCard = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  borderRadius: 16,
  padding: spacing.lg,
};
```

### Component: LevelRing

New reusable component `src/components/LevelRing/LevelRing.tsx`:

Props:
- `score: number` -- total XP to calculate level and progress
- `size?: number` -- diameter in pixels (default: responsiveWidth(72))

Implementation details:
- Uses `react-native-svg`: Svg, Circle, Text (from react-native-svg)
- viewBox="0 0 100 100", radius=42
- Circumference = 2 * Math.PI * 42 = ~264
- Background circle: stroke `rgba(255,255,255,0.1)`, strokeWidth 6, fill none
- Progress circle: stroke = level color, strokeWidth 6, strokeLinecap "round", strokeDasharray 264, strokeDashoffset = 264 - (264 * progressPercent / 100)
- Apply transform rotation -90deg on the SVG to start progress from the top
- Center text: level number using `react-native-svg` Text component, font-family fonts.press

## Navigation Changes

Current:
```
ProfileStack (src/screens/ProfileScreen/ProfileStack.tsx)
  +-- HomeMain (Profile.tsx)        // navigate('Settings') goes to SettingsMain
  +-- SettingsMain (SettingsStack)   // nested stack
      SettingsStack (src/screens/SettingsScreen/SettingsStack.tsx)
        +-- SettingsMain (Settings.tsx)
        +-- AccountCenter             <- REMOVE
        +-- ProfilePicture            <- REMOVE
        +-- ReportProblem
```

After:
```
ProfileStack
  +-- HomeMain (Profile.tsx)
  +-- SettingsMain (SettingsStack)
      SettingsStack
        +-- SettingsMain (Settings.tsx)  // now includes avatar + info editing inline
        +-- ReportProblem
```

Navigation calls remain unchanged:
- Profile -> Settings: `navigation.navigate('Settings')` (resolved by React Navigation to SettingsMain)
- Settings -> ReportProblem: `navigation.navigate('ReportProblem')`
- Settings -> Back: `navigation.goBack()`
- Logout: `navigation.reset({ index: 0, routes: [{ name: 'Login' }] })`

## Data Flow

No API changes. Same endpoints, same data sources:
- `userPoints.score_total` from UserContext -- for level calculation (NO extra API call)
- `userInformation` from UserContext -- for profile name/email display
- `profilePicture` from UserContext -- for avatar display
- `getTopGlobalByUser(uid)` -- Profile stats (direct API call)
- `getTopMonthlyByUser(uid)` -- Profile stats (direct API call)
- `getGameCard(uid)` -- Settings game card (direct API call)
- `getUserInformation(uid)` -- Settings info card (direct API call for editable fields)
- `putUserInformation(uid, data)` -- Settings edit save
- `getUserProfilePictures(uid)` -- Settings avatar grid
- `updateUserProfilePicture(uid, url)` -- Settings save avatar
- `postReportProblem(uid, issue, desc)` -- ReportProblem (unchanged)
- `getProblemReports(uid)` -- ReportProblem (unchanged)

## Orientation Handling

Both screens should remain portrait-focused. Remove landscape-specific orientation listeners from Settings (the current landscape handling adds complexity with minimal benefit on a phone). The ScrollView will handle any overflow naturally.

## Out of Scope

- Statistics (Stadistics.tsx) content/charts -- only glassmorphic card styling
- Badges content -- only glassmorphic styling
- Home screen or Leaderboard changes
- Backend API changes
- Dark theme toggle
- Accessibility improvements beyond current level
