export type TUserLogin = {
  uid: string,
  age: number,
  user_name: string,
  email: string,
  gender: string,
  laast_session: any,
  score_total: number,
  location: string,
}

export type TTokenManager = {
  accessToken: string,
  expirationTime: number,
  refreshToken: string,
}

export type TUserAuth = {
  redirectEventId: undefined,
  apiKey: string,
  appName: string,
  createdAt: number,
  displayName: undefined,
  email: string,
  emailVerified: boolean,
  isAnonymous: boolean,
  lastLoginAt: number,
  phoneNumber: undefined,
  photoURL: undefined,
  providerData: [],
  stsTokenManager: TTokenManager,
  tenantId: undefined,
  uid: string
}

export type TUserPoints = {
  uid: string,
  score_total: number
}

export type TUserSession = {
  score: number,
  timestamp: string
}

export type TUserCurrentMonthSession = {
  uid: string,
  currentMonthSessions: number,
  sessions: TUserSession[]
}

export type TUserLast3MonthInfo = {
  uid: string,
  last3MonthsSessions: number,
  sessions: TUserSession[]
}

export type TGroupedSessions = {
  [month: string]: number[];
}

export type TMaxScores = {
  [month: string]: number;
}

export type TUserInformation = {
  name: string,
  email: string,
  state: string,
  age: number
}

export type TUserPicture = {
  url: string,
}

export type TBackResponse = {
  message: string,
}

export type TGameCard = {
  name: string,
  score: number,
  card_number: number
}
