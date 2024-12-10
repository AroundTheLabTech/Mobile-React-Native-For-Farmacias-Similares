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
  partidas_competicion: string[]
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
