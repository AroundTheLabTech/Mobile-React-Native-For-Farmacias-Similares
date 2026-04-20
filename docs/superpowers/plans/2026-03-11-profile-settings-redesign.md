# Profile & Settings UI Redesign - Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Profile and Settings screens to match NextJS web app's glassmorphic visual language with purple theme.

**Architecture:** Purple background with glassmorphic cards (semi-transparent, subtle borders), gradient accents (purple->cyan), new level system with SVG progress ring. Profile and Settings remain separate screens. AccountCenter and ProfilePicture merged inline into Settings.

**Tech Stack:** React Native 0.75.3, react-native-svg (already installed), React Navigation 6, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-11-profile-settings-redesign.md`

**No test framework configured** - verification is via build + visual inspection.

---

## File Structure

### New Files
- `src/utils/levels.ts` — Level definitions and getUserLevel helper
- `src/components/LevelRing/LevelRing.tsx` — SVG circular progress ring component

### Modified Files
- `global-class.tsx` — Add new colors + glassmorphicCard export
- `src/screens/ProfileScreen/Profile.tsx` — Complete rewrite
- `src/screens/ProfileScreen/style/ProfileStyle.tsx` — Complete restyle
- `src/screens/ProfileScreen/style/StadiscticsStyle.tsx` — Glassmorphic card styles
- `src/screens/ProfileScreen/style/BadgesStyle.tsx` — Glassmorphic card styles
- `src/screens/SettingsScreen/Settings.tsx` — Complete rewrite (merges AccountCenter + ProfilePicture)
- `src/screens/SettingsScreen/style/SettingsStyles.tsx` — Complete restyle
- `src/screens/SettingsScreen/SettingsStack.tsx` — Remove AccountCenter + ProfilePicture routes
- `src/screens/SettingsScreen/ReportProblem.tsx` — Glassmorphic style update
- `src/screens/SettingsScreen/style/ReportProblemStyles.tsx` — Glassmorphic styles

### Deleted Files
- `src/screens/SettingsScreen/AccountCenter.tsx`
- `src/screens/SettingsScreen/style/AccountCenterStyles.tsx`
- `src/screens/SettingsScreen/ProfilePicture.tsx`
- `src/screens/SettingsScreen/style/ProfilePictureStyles.tsx`

---

## Chunk 1: Foundation (global-class, levels, LevelRing)

### Task 1: Update global-class.tsx

**Files:**
- Modify: `global-class.tsx` (project root)

- [ ] **Step 1: Add new colors to the colors object**

Add these properties to the existing `colors` object in `global-class.tsx`:

```typescript
darkPurpleBg: '#1a1040',
cardBg: 'rgba(255,255,255,0.06)',
cardBorder: 'rgba(255,255,255,0.10)',
cyan: '#06B6D4',
gold: '#FFD700',
danger: '#EF4444',
```

- [ ] **Step 2: Add glassmorphicCard export at the end of the file**

Add after the `fonts` export:

```typescript
export const glassmorphicCard = {
  backgroundColor: 'rgba(255,255,255,0.06)' as string,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)' as string,
  borderRadius: 16,
  padding: spacing.lg,
};
```

- [ ] **Step 3: Commit**

```bash
git add global-class.tsx
git commit -m "feat: add glassmorphic colors and card style to global-class"
```

---

### Task 2: Create levels utility

**Files:**
- Create: `src/utils/levels.ts`

- [ ] **Step 1: Create the levels file**

```typescript
export type Level = {
  level: number;
  name: string;
  minScore: number;
  maxScore: number;
  color: string;
};

export const LEVELS: Level[] = [
  { level: 1, name: 'Novato', minScore: 0, maxScore: 500, color: '#6B7280' },
  { level: 2, name: 'Aprendiz', minScore: 500, maxScore: 1500, color: '#10B981' },
  { level: 3, name: 'Jugador', minScore: 1500, maxScore: 3000, color: '#3B82F6' },
  { level: 4, name: 'Veterano', minScore: 3000, maxScore: 5000, color: '#8B5CF6' },
  { level: 5, name: 'Experto', minScore: 5000, maxScore: 8000, color: '#F59E0B' },
  { level: 6, name: 'Maestro', minScore: 8000, maxScore: 12000, color: '#EF4444' },
  { level: 7, name: 'Leyenda', minScore: 12000, maxScore: Infinity, color: '#EC4899' },
];

export function getUserLevel(score: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(score: number): number {
  const level = getUserLevel(score);
  const nextLevel = LEVELS.find(l => l.level === level.level + 1);
  if (!nextLevel) return 100;
  return ((score - level.minScore) / (nextLevel.minScore - level.minScore)) * 100;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/levels.ts
git commit -m "feat: add level system utility with getUserLevel and getLevelProgress"
```

---

### Task 3: Create LevelRing component

**Files:**
- Create: `src/components/LevelRing/LevelRing.tsx`

- [ ] **Step 1: Create the LevelRing component**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { getUserLevel, getLevelProgress } from '../../utils/levels';
import { responsiveWidth } from '../../../global-class';

type LevelRingProps = {
  score: number;
  size?: number;
};

const CIRCUMFERENCE = 2 * Math.PI * 42; // radius = 42, circumference ~= 264

const LevelRing: React.FC<LevelRingProps> = ({ score, size }) => {
  const ringSize = size || responsiveWidth(72);
  const level = getUserLevel(score);
  const progress = getLevelProgress(score);
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  return (
    <View style={[styles.container, { width: ringSize, height: ringSize }]}>
      <Svg viewBox="0 0 100 100" width={ringSize} height={ringSize}>
        {/* Background circle */}
        <Circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        {/* Progress circle */}
        <Circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={level.color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        {/* Level number */}
        <SvgText
          x="50"
          y="50"
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="28"
          fontWeight="700"
          fill={level.color}
          fontFamily="PressStart2P-Regular"
        >
          {level.level}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LevelRing;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LevelRing/LevelRing.tsx
git commit -m "feat: add LevelRing SVG component for level progress display"
```

---

## Chunk 2: Profile Screen Redesign

### Task 4: Rewrite ProfileStyle.tsx

**Files:**
- Modify: `src/screens/ProfileScreen/style/ProfileStyle.tsx` (complete rewrite)

- [ ] **Step 1: Rewrite ProfileStyle.tsx**

```typescript
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts, responsiveWidth, responsiveHeight } from '../../../../global-class';

const ProfileStyles = StyleSheet.create({
  // Main container
  containerMax: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  container: {
    backgroundColor: colors.background2,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },

  // Header with config button
  headerProfile: {
    padding: spacing.sm,
    width: '100%',
    alignItems: 'flex-end',
  },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  avatarGlow: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    borderRadius: responsiveWidth(50),
    backgroundColor: 'rgba(124,58,237,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  avatarRing: {
    width: responsiveWidth(90),
    height: responsiveWidth(90),
    borderRadius: responsiveWidth(45),
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: responsiveWidth(82),
    height: responsiveWidth(82),
    borderRadius: responsiveWidth(41),
  },
  userName: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.inter,
    marginTop: spacing.sm,
  },
  userEmail: {
    fontSize: fontSizes.xs,
    color: colors.primaryDegrad50,
    fontFamily: fonts.inter,
    marginTop: 4,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    width: '95%',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statCardLevel: {
    flex: 1.3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
    borderRadius: 16,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLevelInfo: {
    flex: 1,
  },
  statIconBox: {
    width: responsiveWidth(44),
    height: responsiveWidth(44),
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: fontSizes.xxxs,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: fonts.inter,
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  statSub: {
    fontSize: fontSizes.xxxs,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: fonts.inter,
  },
  levelName: {
    fontWeight: '600',
    fontSize: fontSizes.xs,
  },
  levelXp: {
    fontSize: fontSizes.xxxs,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: fonts.inter,
  },

  // Tab navigation
  tabContainer: {
    width: '95%',
    marginBottom: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  tabItem: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  tabTextActive: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  tabTextInactive: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.primaryDegrad50,
    fontFamily: fonts.inter,
  },
  tabUnderline: {
    height: 3,
    width: '100%',
    borderRadius: 2,
    marginTop: 6,
  },
  tabUnderlineLeft: {
    backgroundColor: colors.third,
  },
  tabUnderlineRight: {
    backgroundColor: colors.cyan,
  },

  // Tab content
  contentContainer: {
    width: '95%',
  },
});

export default ProfileStyles;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ProfileScreen/style/ProfileStyle.tsx
git commit -m "feat: rewrite ProfileStyle with glassmorphic dark purple theme"
```

---

### Task 5: Rewrite Profile.tsx

**Files:**
- Modify: `src/screens/ProfileScreen/Profile.tsx` (complete rewrite)

- [ ] **Step 1: Rewrite Profile.tsx**

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileStyles from './style/ProfileStyle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGlobe, faCube } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../AuthContext';
import StadisticsScreen from './Stadistics';
import _404Page from '../404Screen/404';
import Badges from './Badges';
import Loader from '@components/LoaderComponent/Loader';
import { useUser } from '@services/UserContext';
import { getTopGlobalByUser, getTopMonthlyByUser } from '../../services/backend';
import LevelRing from '../../components/LevelRing/LevelRing';
import { getUserLevel } from '../../utils/levels';
import { colors } from '../../../global-class';

const ProfileScreen = ({ navigation }) => {
  const { uid } = useAuth();
  const [selectedTab, setSelectedTab] = useState('stadistics');
  const [topGlobal, setTopGlobal] = useState<number | null>(null);
  const [topMonthly, setTopMonthly] = useState<number | null>(null);

  const { profilePicture, setUpdateProfilePicture, userPoints, setUpdateUserPoints, userInformation } = useUser();

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
    } else {
      setUpdateUserPoints(false);
    }
  }, [setUpdateUserPoints, userPoints]);

  useEffect(() => {
    async function fetchData() {
      const topGlobalPosition = await getTopGlobalByUser(uid);
      if (topGlobalPosition !== null && topGlobalPosition !== undefined && !isNaN(topGlobalPosition) && topGlobalPosition > 0) {
        setTopGlobal(topGlobalPosition);
      } else {
        setTopGlobal(0);
      }

      const topMonthlyPosition = await getTopMonthlyByUser(uid);
      if (topMonthlyPosition !== null && topMonthlyPosition !== undefined && !isNaN(topMonthlyPosition) && topMonthlyPosition > 0) {
        setTopMonthly(topMonthlyPosition);
      } else {
        setTopMonthly(0);
      }
    }
    fetchData();
  }, [uid]);

  useEffect(() => {
    if (!profilePicture) {
      setUpdateProfilePicture(true);
    } else {
      setUpdateProfilePicture(false);
    }
  }, [profilePicture, setUpdateProfilePicture, uid]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'badges':
        return <Badges />;
      case 'stadistics':
        return <StadisticsScreen />;
      default:
        return <_404Page />;
    }
  };

  if (!userInformation || !userInformation.name || !userPoints) {
    return <Loader visible={true} />;
  }

  const score = userPoints?.score_total || 0;
  const level = getUserLevel(score);

  return (
    <ScrollView style={ProfileStyles.containerMax} contentContainerStyle={ProfileStyles.container}>
      {/* Header with config button */}
      <View style={ProfileStyles.headerProfile}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../../img/iconos/config.png')} />
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={ProfileStyles.avatarSection}>
        <View style={ProfileStyles.avatarGlow}>
          <View style={ProfileStyles.avatarRing}>
            <Image
              resizeMode="cover"
              style={ProfileStyles.avatarImage}
              source={{ uri: profilePicture }}
            />
          </View>
        </View>
        <Text style={ProfileStyles.userName}>{userInformation?.name || 'Usuario'}</Text>
        <Text style={ProfileStyles.userEmail}>{userInformation?.email || ''}</Text>
      </View>

      {/* Stats Row */}
      <View style={ProfileStyles.statsRow}>
        {/* Level Card */}
        <View style={ProfileStyles.statCardLevel}>
          <LevelRing score={score} />
          <View style={ProfileStyles.statLevelInfo}>
            <Text style={ProfileStyles.statLabel}>Nivel Actual</Text>
            <Text style={[ProfileStyles.levelName, { color: level.color }]}>{level.name}</Text>
            <Text style={ProfileStyles.levelXp}>{score.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Top Mundial */}
        <View style={ProfileStyles.statCard}>
          <View style={[ProfileStyles.statIconBox, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
            <FontAwesomeIcon icon={faGlobe} size={20} color="#3B82F6" />
          </View>
          <Text style={ProfileStyles.statLabel}>Top Mundial</Text>
          <Text style={ProfileStyles.statValue}>#{topGlobal !== null ? topGlobal : '...'}</Text>
          <Text style={ProfileStyles.statSub}>ranking global</Text>
        </View>

        {/* Top Mensual */}
        <View style={ProfileStyles.statCard}>
          <View style={[ProfileStyles.statIconBox, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
            <FontAwesomeIcon icon={faCube} size={20} color="#F59E0B" />
          </View>
          <Text style={ProfileStyles.statLabel}>Top Mensual</Text>
          <Text style={ProfileStyles.statValue}>#{topMonthly !== null ? topMonthly : '...'}</Text>
          <Text style={ProfileStyles.statSub}>ranking mensual</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={ProfileStyles.tabContainer}>
        <View style={ProfileStyles.tabRow}>
          <TouchableOpacity style={ProfileStyles.tabItem} onPress={() => setSelectedTab('badges')}>
            <Text style={selectedTab === 'badges' ? ProfileStyles.tabTextActive : ProfileStyles.tabTextInactive}>
              Insignias
            </Text>
            {selectedTab === 'badges' && (
              <View style={[ProfileStyles.tabUnderline, ProfileStyles.tabUnderlineLeft]} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={ProfileStyles.tabItem} onPress={() => setSelectedTab('stadistics')}>
            <Text style={selectedTab === 'stadistics' ? ProfileStyles.tabTextActive : ProfileStyles.tabTextInactive}>
              Estadisticas
            </Text>
            {selectedTab === 'stadistics' && (
              <View style={[ProfileStyles.tabUnderline, ProfileStyles.tabUnderlineRight]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View style={ProfileStyles.contentContainer}>
        {renderContent()}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ProfileScreen/Profile.tsx
git commit -m "feat: rewrite Profile screen with avatar ring, level system, and glassmorphic stats"
```

---

### Task 6: Update StadiscticsStyle.tsx for glassmorphic theme

**Files:**
- Modify: `src/screens/ProfileScreen/style/StadiscticsStyle.tsx`

- [ ] **Step 1: Update glassmorphic-relevant styles**

Change `containerEstadistics` background from `'#D9D4F7'` to glassmorphic:

```typescript
containerEstadistics: {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  width: '100%',
  borderRadius: 15,
  padding: spacing.md,
  marginTop: spacing.md,
},
```

Change `titleTotalGames` color from `colors.secondary` (black) to `colors.primary` (white):

```typescript
titleTotalGames: {
  textAlign: 'center',
  color: colors.primary,
  fontWeight: '700',
  padding: spacing.md,
  fontSize: fontSizes.xxl,
  flex: 1,
},
```

Change `containerBestPlay` from white bg to glassmorphic:

```typescript
containerBestPlay: {
  width: '45%',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  padding: spacing.sm,
  marginTop: spacing.md,
  borderRadius: 15,
},
```

Change `titleNumber` color to white:

```typescript
titleNumber: {
  fontWeight: '800',
  fontSize: fontSizes.mxxl,
  color: colors.primary,
},
```

Change `textBox` color to white:

```typescript
textBox: {
  color: colors.primary,
  fontWeight: '500',
},
```

Change `noDataText` color to white:

```typescript
noDataText: {
  fontSize: fontSizes.lg,
  color: colors.primary,
  fontWeight: '600',
  marginTop: spacing.md,
},
```

Change `containerChartStadistics` to glassmorphic:

```typescript
containerChartStadistics: {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  width: '100%',
  borderRadius: 15,
  padding: spacing.md,
  marginTop: spacing.md,
  marginBottom: spacing.md,
  alignSelf: 'flex-start',
},
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ProfileScreen/style/StadiscticsStyle.tsx
git commit -m "feat: update Statistics styles to glassmorphic theme"
```

---

### Task 7: Update BadgesStyle.tsx for glassmorphic theme

**Files:**
- Modify: `src/screens/ProfileScreen/style/BadgesStyle.tsx`

- [ ] **Step 1: Update badge-relevant styles**

Change `notFoundText` color:

```typescript
notFoundText: {
  textAlign: 'center',
  fontFamily: fonts.inter,
  fontWeight: '700',
  color: colors.primary,
},
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/ProfileScreen/style/BadgesStyle.tsx
git commit -m "feat: update Badges styles for glassmorphic theme"
```

---

## Chunk 3: Settings Screen Redesign

### Task 8: Update SettingsStack.tsx

**Files:**
- Modify: `src/screens/SettingsScreen/SettingsStack.tsx`

- [ ] **Step 1: Remove AccountCenter and ProfilePicture routes**

```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Settings from './Settings';
import ReportProblem from './ReportProblem';

const Stack = createStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="SettingsMain" component={Settings} />
      <Stack.Screen name="ReportProblem" component={ReportProblem} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen/SettingsStack.tsx
git commit -m "feat: remove AccountCenter and ProfilePicture routes from SettingsStack"
```

---

### Task 9: Rewrite SettingsStyles.tsx

**Files:**
- Modify: `src/screens/SettingsScreen/style/SettingsStyles.tsx` (complete rewrite)

- [ ] **Step 1: Rewrite SettingsStyles.tsx**

```typescript
import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts, responsiveWidth, responsiveHeight } from '../../../../global-class';

const SettingsStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  contentContainer: {
    padding: spacing.sm,
    paddingBottom: spacing.xxxxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    paddingTop: spacing.md,
  },
  headerBackButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.inter,
    marginRight: spacing.lg,
  },

  // Game Card
  gameCard: {
    backgroundColor: 'rgba(106,90,224,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  gameCardLabel: {
    fontFamily: fonts.press,
    fontSize: fontSizes.xxxs,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  gameCardName: {
    fontFamily: fonts.inter,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  gameCardNumber: {
    fontFamily: fonts.press,
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  gameCardScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  gameCardScore: {
    fontFamily: fonts.press,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    color: colors.gold,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },

  // Section Card (glassmorphic)
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: fonts.inter,
  },

  // Edit buttons
  editButtonsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  infoItem: {
    width: '47%',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSizes.xxxs,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: fonts.inter,
  },
  infoValue: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  infoInput: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontFamily: fonts.inter,
    borderWidth: 1,
    borderColor: colors.third,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  },

  // Avatar grid
  avatarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  avatarOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarOptionSelected: {
    borderColor: colors.cyan,
    elevation: 6,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  selectedCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.cyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  saveAvatarButton: {
    width: '100%',
    backgroundColor: colors.third,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveAvatarButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSizes.sm,
    fontFamily: fonts.inter,
  },

  // Settings items
  settingsList: {
    gap: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  settingItemDanger: {
    borderColor: 'rgba(239,68,68,0.2)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  settingIconBox: {
    width: responsiveWidth(36),
    height: responsiveWidth(36),
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingName: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.primary,
    fontFamily: fonts.inter,
  },
  settingDesc: {
    fontSize: fontSizes.xxxs,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: fonts.inter,
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  logoutButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: colors.danger,
    fontWeight: '500',
    fontSize: fontSizes.xs,
    fontFamily: fonts.inter,
  },
});

export default SettingsStyles;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen/style/SettingsStyles.tsx
git commit -m "feat: rewrite SettingsStyles with glassmorphic theme"
```

---

### Task 10: Rewrite Settings.tsx

**Files:**
- Modify: `src/screens/SettingsScreen/Settings.tsx` (complete rewrite merging AccountCenter + ProfilePicture)

- [ ] **Step 1: Rewrite Settings.tsx**

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import SettingsStyles from './style/SettingsStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TGameCard, TUpdateUserInformation, TUserProfilePictures } from '../../types/user';
import { getGameCard, getUserProfilePictures, updateUserProfilePicture, putUserInformation } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import { formarGameCardNumber, formatNumber } from '../../utils/helpers';
import { useUser } from '@services/UserContext';
import { SvgUri } from 'react-native-svg';
import Loader from '@components/LoaderComponent/Loader';
import { colors } from '../../../global-class';

const Settings = ({ navigation }) => {
  const { uid, logout } = useAuth();
  const { profilePicture, setUpdateProfilePicture, userPoints, setUpdateUserPoints, userInformation, setUpdateUserInformation } = useUser();

  const [loading, setLoading] = useState(true);
  const [gameCard, setGameCard] = useState<TGameCard>();
  const [profilePictures, setProfilePictures] = useState<TUserProfilePictures>();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  // Inline edit state (from AccountCenter)
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAge, setEditAge] = useState('');

  useEffect(() => {
    if (!profilePicture) {
      setUpdateProfilePicture(true);
    }
  }, [profilePicture, setUpdateProfilePicture]);

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
    }
  }, [setUpdateUserPoints, userPoints]);

  useEffect(() => {
    if (!userInformation) {
      setUpdateUserInformation(true);
    }
  }, [setUpdateUserInformation, userInformation]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cardRes, picturesRes] = await Promise.all([
          getGameCard(uid),
          getUserProfilePictures(uid),
        ]);
        setGameCard(cardRes);
        if (picturesRes) {
          setProfilePictures(picturesRes);
          setSelectedAvatar(picturesRes.current_profile_picture_url || '');
        }
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uid]);

  useEffect(() => {
    if (userInformation) {
      setEditName(userInformation.name || '');
      setEditLocation(userInformation.state || '');
      setEditAge(userInformation.age?.toString() || '');
    }
  }, [userInformation]);

  async function handleSaveInfo() {
    if (!editName.trim() || !editLocation.trim() || !editAge.trim() || Number(editAge) <= 0) {
      return;
    }
    const data: TUpdateUserInformation = {
      name: editName,
      ubication: editLocation,
      age: Number(editAge),
    };
    const response = await putUserInformation(uid, data);
    if (response?.message) {
      setUpdateUserInformation(true);
    }
    setEditMode(false);
  }

  async function handleSaveAvatar() {
    if (!selectedAvatar) return;
    try {
      const response = await updateUserProfilePicture(uid, selectedAvatar);
      if (response?.message) {
        setUpdateProfilePicture(true);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  }

  async function handleLogout() {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  if (loading) {
    return <Loader visible={true} />;
  }

  return (
    <ScrollView style={SettingsStyles.container} contentContainerStyle={SettingsStyles.contentContainer}>
      {/* Header */}
      <View style={SettingsStyles.header}>
        <TouchableOpacity style={SettingsStyles.headerBackButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={SettingsStyles.headerTitle}>Configuracion</Text>
      </View>

      {/* Game Card */}
      <View style={SettingsStyles.gameCard}>
        <Text style={SettingsStyles.gameCardLabel}>GAME CARD</Text>
        <Text style={SettingsStyles.gameCardName}>{gameCard?.name || 'Jugador'}</Text>
        <Text style={SettingsStyles.gameCardNumber}>
          {formarGameCardNumber(gameCard?.card_number) || '0000-0000-0000'}
        </Text>
        <View style={SettingsStyles.gameCardScorePill}>
          <Image source={require('../../../img/iconos/moneda.png')} style={SettingsStyles.coinIcon} />
          <Text style={SettingsStyles.gameCardScore}>
            {userPoints?.score_total ? formatNumber(userPoints.score_total) : '0'}
          </Text>
        </View>
      </View>

      {/* Info Personal Card */}
      <View style={SettingsStyles.sectionCard}>
        <View style={SettingsStyles.sectionHeader}>
          <Text style={SettingsStyles.sectionTitle}>Informacion Personal</Text>
          {!editMode ? (
            <TouchableOpacity style={SettingsStyles.iconButton} onPress={() => setEditMode(true)}>
              <FontAwesomeIcon icon={faPen} size={14} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          ) : (
            <View style={SettingsStyles.editButtonsRow}>
              <TouchableOpacity style={SettingsStyles.iconButton} onPress={() => setEditMode(false)}>
                <FontAwesomeIcon icon={faXmark} size={16} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={SettingsStyles.iconButton} onPress={handleSaveInfo}>
                <FontAwesomeIcon icon={faCheck} size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={SettingsStyles.infoGrid}>
          <View style={SettingsStyles.infoItem}>
            <Text style={SettingsStyles.infoLabel}>Nombre</Text>
            {editMode ? (
              <TextInput
                style={SettingsStyles.infoInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
              />
            ) : (
              <Text style={SettingsStyles.infoValue}>{userInformation?.name || '-'}</Text>
            )}
          </View>
          <View style={SettingsStyles.infoItem}>
            <Text style={SettingsStyles.infoLabel}>Email</Text>
            <Text style={SettingsStyles.infoValue}>{userInformation?.email || '-'}</Text>
          </View>
          <View style={SettingsStyles.infoItem}>
            <Text style={SettingsStyles.infoLabel}>Ubicacion</Text>
            {editMode ? (
              <TextInput
                style={SettingsStyles.infoInput}
                value={editLocation}
                onChangeText={setEditLocation}
              />
            ) : (
              <Text style={SettingsStyles.infoValue}>{userInformation?.state || '-'}</Text>
            )}
          </View>
          <View style={SettingsStyles.infoItem}>
            <Text style={SettingsStyles.infoLabel}>Edad</Text>
            {editMode ? (
              <TextInput
                style={SettingsStyles.infoInput}
                value={editAge}
                onChangeText={setEditAge}
                keyboardType="numeric"
              />
            ) : (
              <Text style={SettingsStyles.infoValue}>{userInformation?.age || '-'}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Avatar Selection Card */}
      <View style={SettingsStyles.sectionCard}>
        <View style={SettingsStyles.sectionHeader}>
          <Text style={SettingsStyles.sectionTitle}>Elige tu Avatar</Text>
        </View>
        <View style={SettingsStyles.avatarsGrid}>
          {profilePictures?.list_profile_pictures_avalible?.map((picture, index) => {
            const isSelected = picture.image_url === selectedAvatar;
            return (
              <TouchableOpacity
                key={index}
                style={[SettingsStyles.avatarOption, isSelected && SettingsStyles.avatarOptionSelected]}
                onPress={() => setSelectedAvatar(picture.image_url)}
              >
                {picture.image_url.includes('png') ? (
                  <Image source={{ uri: picture.image_url }} style={SettingsStyles.avatarOptionImage} />
                ) : (
                  <SvgUri uri={picture.image_url} width="100%" height="100%" />
                )}
                {isSelected && (
                  <View style={SettingsStyles.selectedCheck}>
                    <Text style={SettingsStyles.selectedCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={SettingsStyles.saveAvatarButton} onPress={handleSaveAvatar}>
          <Text style={SettingsStyles.saveAvatarButtonText}>Guardar Avatar</Text>
        </TouchableOpacity>
      </View>

      {/* Account Card */}
      <View style={SettingsStyles.sectionCard}>
        <View style={SettingsStyles.sectionHeader}>
          <Text style={SettingsStyles.sectionTitle}>Cuenta</Text>
        </View>
        <View style={SettingsStyles.settingsList}>
          {/* Email verified */}
          <View style={SettingsStyles.settingItem}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <Text style={{ fontSize: 18 }}>📧</Text>
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>Email verificado</Text>
                <Text style={SettingsStyles.settingDesc}>{userInformation?.email || 'No disponible'}</Text>
              </View>
            </View>
            <View style={SettingsStyles.verifiedBadge}>
              <Text style={SettingsStyles.verifiedBadgeText}>✓</Text>
            </View>
          </View>

          {/* Member since */}
          <View style={SettingsStyles.settingItem}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <Text style={{ fontSize: 18 }}>🎮</Text>
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>Miembro desde</Text>
                <Text style={SettingsStyles.settingDesc}>SimiJuegos Player</Text>
              </View>
            </View>
          </View>

          {/* Report problem */}
          <TouchableOpacity style={SettingsStyles.settingItem} onPress={() => navigation.navigate('ReportProblem')}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <Text style={{ fontSize: 18 }}>📝</Text>
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>Reportar un problema</Text>
                <Text style={SettingsStyles.settingDesc}>Ayudanos a mejorar</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Logout */}
          <View style={[SettingsStyles.settingItem, SettingsStyles.settingItemDanger]}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <Text style={{ fontSize: 18 }}>🚪</Text>
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>Cerrar Sesion</Text>
                <Text style={SettingsStyles.settingDesc}>Salir de tu cuenta</Text>
              </View>
            </View>
            <TouchableOpacity style={SettingsStyles.logoutButton} onPress={handleLogout}>
              <Text style={SettingsStyles.logoutButtonText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen/Settings.tsx
git commit -m "feat: rewrite Settings with inline info editing, avatar selection, and glassmorphic design"
```

---

### Task 11: Update ReportProblem styles for glassmorphic theme

**Files:**
- Modify: `src/screens/SettingsScreen/style/ReportProblemStyles.tsx`

- [ ] **Step 1: Update ReportProblemStyles**

Change `containerSettings` from white card to glassmorphic:

```typescript
containerSettings: {
  backgroundColor: 'rgba(255,255,255,0.06)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  borderRadius: 20,
  marginTop: spacing.lg,
  marginLeft: spacing.xs,
  marginRight: spacing.xs,
  alignItems: 'center',
  height: '100%',
},
```

Change text colors from `colors.secondary` (black) to `colors.primary` (white):

```typescript
reportProblemTitle: {
  ...existing,
  color: colors.primary,
},
formLabel: {
  ...existing,
  color: colors.primary,
},
formInput: {
  ...existing,
  color: colors.primary,
  borderColor: 'rgba(255,255,255,0.2)',
},
formTextArea: {
  ...existing,
  color: colors.primary,
  borderColor: 'rgba(255,255,255,0.2)',
},
infoText: {
  ...existing,
  color: 'rgba(255,255,255,0.6)',
},
linkText: {
  ...existing,
  color: colors.primary,
},
reportedProblemDate: {
  ...existing,
  color: 'rgba(255,255,255,0.5)',
},
reportedProblemIssue: {
  ...existing,
  color: colors.primary,
},
reportedProblemDescription: {
  ...existing,
  color: 'rgba(255,255,255,0.7)',
},
reportedProblemItem: {
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.1)',
  paddingVertical: spacing.sm,
},
```

- [ ] **Step 2: Commit**

```bash
git add src/screens/SettingsScreen/style/ReportProblemStyles.tsx
git commit -m "feat: update ReportProblem styles for glassmorphic theme"
```

---

## Chunk 4: Cleanup & Verification

### Task 12: Delete removed files

**Files:**
- Delete: `src/screens/SettingsScreen/AccountCenter.tsx`
- Delete: `src/screens/SettingsScreen/style/AccountCenterStyles.tsx`
- Delete: `src/screens/SettingsScreen/ProfilePicture.tsx`
- Delete: `src/screens/SettingsScreen/style/ProfilePictureStyles.tsx`

- [ ] **Step 1: Delete the 4 files**

```bash
rm src/screens/SettingsScreen/AccountCenter.tsx
rm src/screens/SettingsScreen/style/AccountCenterStyles.tsx
rm src/screens/SettingsScreen/ProfilePicture.tsx
rm src/screens/SettingsScreen/style/ProfilePictureStyles.tsx
```

- [ ] **Step 2: Commit**

```bash
git add -u src/screens/SettingsScreen/AccountCenter.tsx src/screens/SettingsScreen/style/AccountCenterStyles.tsx src/screens/SettingsScreen/ProfilePicture.tsx src/screens/SettingsScreen/style/ProfilePictureStyles.tsx
git commit -m "chore: remove AccountCenter and ProfilePicture (merged into Settings)"
```

---

### Task 13: Build and verify

- [ ] **Step 1: Run the build to check for compilation errors**

```bash
cd C:/Mobil-Simi/Mobile-React-Native-For-Farmacias-Similares && npx react-native run-android --mode=playDebug
```

Expected: App should build and launch without errors.

- [ ] **Step 2: Visual verification checklist**

Navigate to Profile tab and verify:
- Avatar displays with purple glow ring
- Username and email shown below avatar
- 3 stat cards visible: Level (with SVG ring), Top Mundial, Top Mensual
- Tab navigation works between Insignias and Estadisticas
- Statistics cards have glassmorphic styling (semi-transparent, not white)

Navigate to Settings (tap gear icon) and verify:
- Game Card displays with purple gradient, formatted number, gold score
- Info Personal card shows 4 fields in 2-column layout
- Edit mode works (tap pen icon, modify fields, save with checkmark)
- Avatar grid shows clickable circular avatars, cyan border on selected
- Account section shows email verified badge, report problem, logout
- Logout works correctly
- Report Problem navigates and works

- [ ] **Step 3: Fix any build or visual issues found**

Address any TypeScript errors, missing imports, or layout issues discovered during verification.
