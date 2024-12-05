export type TUserRegister = {
  email: string,
  name: string,
  password: string,
  location: string,
  age: string
}

export type TUserLogin = {
  uid: string,
  email: string,
  gender: string,
  age: number,
  last_session: string,
  ubication: string,
  display_name: string,
  id_token: string,
  registered: string,
  refresh_token: any,
  expires_in: number,
}

export type TUserTokenValidate = {
  message: string,
  uid: string,
  email: string,
  valid: boolean,
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
  age: number,
  last_session: string,
  gender: string,
}

export type TUserPicture = {
  url: string,
}

export type TUserProfilePicture = {
  title: string,
  image_url: string
}

export type TUserProfilePictures = {
  current_profile_picture_url: string,
  list_profile_pictures_avalible: TUserProfilePicture[]
}


export type TBackResponse = {
  message: string,
}

export type TGameCard = {
  name: string,
  score: number,
  card_number: number
}

export type TScorePerGame = {
  uid: string,
  score_per_game: Record<string, number>
}

export type TTopTwenty = {
  username: string
  uid: string
  total_score: number
  profile_mini_pictures_url: string
  flag_url: string
}

export type TLeaderBoard = TTopTwenty & {
  position: number
}

export type TUserBadges = {
  badges: string[]
  scoring_streak: number
}
