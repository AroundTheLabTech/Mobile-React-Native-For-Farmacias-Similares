import { Alert } from 'react-native';
import { BACKEND_BASE_URL } from '@env';
import { TUserCurrentMonthSession, TUserLast3MonthInfo, TUserPoints, TUserInformation, TUserPicture, TBackResponse, TGameCard, TUserLogin, TUserProfilePictures, TScorePerGame, TTopTwenty, TUserTokenValidate, TUserBadges, TUpdateUserInformation, TUserRegister } from '../types/user';
import { TCompetition, TCompetitionSession, TCompetitiveStatus, TCreateCompetition, TScoreSessions } from '../types/competition';
import { TGameSession } from '../types/game';
import { validateObjectValues } from '../utils/helpers';


export const loginUserByEmailAndPassword = async (email: string, password: string): Promise<TUserLogin | null> => {
  try {
    if (!email) {
      throw new Error('Email inválido');
    }

    if (!password) {
      throw new Error('Password inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/login_with_email_and_password`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserLogin;
  } catch (error) {
    Alert.alert('Error', 'Fallo la autenticacion del usuario');
    return null;
  }
};

export const validateToken = async (idToken: string): Promise<TUserTokenValidate | null> => {
  try {
    if (!idToken) {
      throw new Error('Email inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/validate_token?id_token=${idToken}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserTokenValidate;
  } catch (error) {
    Alert.alert('Error', 'Fallo la autenticacion del usuario');
    return null;
  }
};

export const postLogout = async (idToken: string): Promise<Record<string, string> | null> => {
  try {
    if (!idToken) {
      throw new Error('Email inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/logout?id_token${idToken}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const postUserRegister = async (userRegister: TUserRegister): Promise<TBackResponse | null> => {
  try {

    if (!userRegister) {
      throw new Error('Objeto no valido');
    }

    const isValid = validateObjectValues(userRegister);

    if (!isValid) {
      throw new Error('Valores no validos');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userRegister),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/register`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TBackResponse;
  } catch (error) {
    return error.message;
  }
};

export const getUserInformation = async (uid: string): Promise<TUserInformation | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/user_information/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserInformation;
  } catch (err) {
    Alert.alert('Error', 'No se pudo encontrar la informacion del usuario');
    return null;
  }
};

export const putUserInformation = async (uid: string, userInformation: TUpdateUserInformation): Promise<Record<string, string> | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const response = await fetch(`${BACKEND_BASE_URL}/users/user_information/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userInformation),
    });

    if (!response.ok) {
      throw new Error('Error al rechazar la competicion');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const getUserPicture = async (uid: string): Promise<TUserPicture | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/user_profile_picture/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserPicture;
  } catch (err) {
    // Alert.alert('Error', 'No se pudo encontrar la foto de perfil del usuario');
    return null;
  }
};

export const getUserProfilePictures = async (uid: string): Promise<TUserProfilePictures | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/profile_pictures/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserProfilePictures;
  } catch (err) {
    Alert.alert('Error', 'No se pudo encontrar las fotos de perfil del usuario');
    return null;
  }
};

export const updateUserProfilePicture = async (uid: string, url: string): Promise<TBackResponse | null> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/users/update_profile_picture/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        profile_picture_url: url,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la foto de perfil');
    }

    const data = await response.json();
    return data as TBackResponse;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getUserPoints = async (uid: string): Promise<TUserPoints | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/scores/score_user/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserPoints;
  } catch (err) {
    // Alert.alert('Error', 'No se pudo obtener el puntaje del usuario');
    return null;
  }
};

export const getUserCurrentMonthSession = async (uid: string): Promise<TUserCurrentMonthSession | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/scores/current_month_sessions/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserCurrentMonthSession;
  } catch (error) {
    Alert.alert('Error', 'No se pudo obtener el mes actual');
  }
};

export const getUserLast3MonthsInfo = async (uid: string): Promise<TUserLast3MonthInfo | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/scores/last_3_months_info/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserLast3MonthInfo;
  } catch (error) {
    // Alert.alert('Error', 'No se pudo obtener el mes actual');
    return null;
  }
};

export const postReportProblem = async (uid: string, issue: string, description: string): Promise<TBackResponse | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issue: issue,
        description: description,
      }),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/reports/problem_report/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TBackResponse;
  } catch (error) {
    return error.message;
  }
};

export const getGameCard = async (uid: string): Promise<TGameCard | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/user_game_card/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TGameCard;
  } catch (error) {
    return error.message;
  }
};

export const getScorePerGames = async (uid: string): Promise<TScorePerGame | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/scores/score_per_game/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TScorePerGame;
  } catch (error) {
    return null;
  }
};

export const updateScoreGame = async (uid: string, game_id: string, score: number): Promise<TBackResponse | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const response = await fetch(`${BACKEND_BASE_URL}/scores/update_user_score_game/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        game_id: game_id,
        score: score,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la el score del juego de perfil');
    }

    const data = await response.json();
    return data as TBackResponse;
  } catch (error) {
    return null;
  }
};

export const getTopTwenty = async (): Promise<TTopTwenty[] | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/scores/top_twenty`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TTopTwenty[];
  } catch (error) {
    return null;
  }
};

export const getUserBadges = async (uid: string): Promise<TUserBadges | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/users/user_badges/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserBadges;
  } catch (error) {
    return null;
  }
};

export const postSessionGame = async (gameSession: TGameSession): Promise<Record<string, string> | null> => {
  try {
    if (!gameSession?.uid) {
      throw new Error('UID inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameSession),
    };

    console.log(requestOptions);

    const response = await fetch(`${BACKEND_BASE_URL}/games/`, requestOptions);

    console.log(response);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const getListAvalibleCompetition = async (uid: string): Promise<TCompetition[] | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/active_competitions/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TCompetition[];
  } catch (error) {
    return null;
  }
};

export const getListCompetitionNotification = async (uid: string): Promise<TCompetition[] | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/competitions/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TCompetition[];
  } catch (error) {
    return null;
  }
};

export const postCreateCompetition = async (newCompetition: TCreateCompetition): Promise<Record<string, string> | null> => {
  try {
    if (!newCompetition?.sender_email) {
      throw new Error('Email inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCompetition),
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/create`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const putRejectCompetition = async (uid: string, competitionUid: string, id: string): Promise<Record<string, string> | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const response = await fetch(`${BACKEND_BASE_URL}/competition/reject/${uid}/${competitionUid}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Error al rechazar la competicion');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const putAcceptCompetition = async (uid: string, competitionUid: string, id: string): Promise<Record<string, string> | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const response = await fetch(`${BACKEND_BASE_URL}/competition/accept/${uid}/${competitionUid}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Error al aceptar la competicion');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const putCompetitionSession = async (competitionSession: TCompetitionSession): Promise<Record<string, string> | null> => {
  try {

    const isValidObject = validateObjectValues(competitionSession);

    if (!isValidObject) {
      throw new Error('Objecto no valido');
    }

    const response = await fetch(`${BACKEND_BASE_URL}/competition/competition_session`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(competitionSession),
    });

    if (!response.ok) {
      throw new Error('Error al aceptar la competicion');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const getCompetitionSessions = async (userUid: string, opponentUid: string, competitionId: string): Promise<TScoreSessions | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/competition_plays/${userUid}/${opponentUid}/${competitionId}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TScoreSessions;
  } catch (error) {
    return null;
  }
};

export const getAllCompetition = async (userUid: string): Promise<TCompetition[] | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/all_competition/${userUid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TCompetition[];
  } catch (error) {
    return null;
  }
};

export const getCompetitiveStatus = async (userUid: string, opponentUid: string, uniqueId: string): Promise<TCompetitiveStatus | null> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${BACKEND_BASE_URL}/competition/competitive_status/${userUid}/${opponentUid}/${uniqueId}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TCompetitiveStatus;
  } catch (error) {
    return null;
  }
};
