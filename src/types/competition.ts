export type TCreateCompetition = {
  sender_email: string
  score: number
  target_email: string
  sender_uid: string
}

export type TCompetition = {
  id: string
  UID: string
  email: string
  inicio_fecha: string
  inicio_final: string
  name: string
  profile_picture: string
  partidas_competicion: TScoreSession[]
  puntaje_apuestas: number
  resultado: string | null
  reto_status: string
}

export type TCompetitionSession = {
  user_uid: string
  opponent_uid: string
  unique_id: string
  session_id: string
}

export type TScoreSession = {
  game: number
  score: number
  timestamp: string
}

export type TScoreSessions = {
  user_plays_competition: TScoreSession[]
  opponent_plays_competition: TScoreSession[]
}

export type TCompetitiveStatus = {
  user_competition: TCompetition[]
  opponent_competition: TCompetition[]
}

