export interface Names {
  names: string;
  father_last_name: string;
  mother_last_name: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PhoneNumber {
  country_code: number;
  area_code: number;
  number: number;
}

export interface PersonalInfo {
  name: Names;
  birth_date: string;
  gender: string;
  address: Address;
  phone_number: PhoneNumber;
}

export interface ProfileInfo {
  username: string;
  email: string;
  profile_picture_id: string;
  game_card_number: number;
}

export interface Statistics {
  points: number,
  competitions_won: number,
  competitions_lost: number,
  competitions_draw: number,
  login_streak: number,
  longest_login_streak: number,
  badges_ids: string[]
}

export interface User {
  id: string;
  personal_info: PersonalInfo;
  profile_info: ProfileInfo;
  latest_session: string;
  statistics: Statistics;
  created_at: string;
  updated_at: string;
}

export interface UserAuth {
  user: User;
  token: string;
  token_expiration_in_seconds: number;
  refresh_token: string
}
