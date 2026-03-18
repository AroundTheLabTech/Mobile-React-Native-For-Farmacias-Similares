import { TUserLogin, TUserInformation, TUserPoints, TUserLast3MonthInfo, TScorePerGame } from '../types/user';

// ============================================================
// DEV BYPASS — set to false when backend is connected
// ============================================================
// Set to true ONLY during local development — always false in production builds
export const DEV_SKIP_LOGIN = __DEV__ && false;

// --- AuthContext mock (TUserLogin) ---
export const MOCK_USER: TUserLogin = {
  uid: 'mock-uid-dev-001',
  email: 'dev@simijuegos.com',
  display_name: 'Dev Tester',
  gender: 'M',
  age: 25,
  last_session: '2026-03-04',
  ubication: 'CDMX',
  id_token: 'mock-token',
  registered: 'true',
  refresh_token: null,
  expires_in: 3600,
};

// --- UserContext mocks ---
export const MOCK_USER_INFORMATION: TUserInformation = {
  name: 'Dev Tester',
  email: 'dev@simijuegos.com',
  state: 'CDMX',
  age: 25,
  last_session: '2026-03-04',
  gender: 'M',
};

export const MOCK_USER_POINTS: TUserPoints = {
  uid: 'mock-uid-dev-001',
  score_total: 1500,
};

export const MOCK_LAST_3_MONTHS: TUserLast3MonthInfo = {
  uid: 'mock-uid-dev-001',
  last3MonthsSessions: 12,
  sessions: [
    { score: 200, timestamp: '2026-01-10T12:00:00Z' },
    { score: 180, timestamp: '2026-01-15T12:00:00Z' },
    { score: 250, timestamp: '2026-02-05T12:00:00Z' },
    { score: 300, timestamp: '2026-02-20T12:00:00Z' },
    { score: 150, timestamp: '2026-03-01T12:00:00Z' },
    { score: 220, timestamp: '2026-03-03T12:00:00Z' },
  ],
};

export const MOCK_SCORE_PER_GAME: TScorePerGame = {
  uid: 'mock-uid-dev-001',
  score_per_game: {
    juego1: 250,
    juego2: 180,
  },
};
