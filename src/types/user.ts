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
