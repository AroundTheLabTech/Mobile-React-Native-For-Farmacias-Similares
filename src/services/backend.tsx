import { BACKEND_BASE_URL } from '@env';
import { TUserCurrentMonthSession, TUserLast3MonthInfo, TUserPoints, TUserInformation, TUserPicture, TBackResponse, TGameCard, TUserLogin, TUserProfilePictures, TScorePerGame, TTopTwenty, GetTopTwentyOpts, TUserTokenValidate, TUserBadges, TUpdateUserInformation, TUserRegister, TDashboardSummary } from '../types/user';
import { TCompetition, TCompetitionSession, TCompetitiveStatus, TCreateCompetition, TScoreSessions } from '../types/competition';
import { TGameSession, TGameCatalogResponse } from '../types/game';
import { validateObjectValues } from '../utils/helpers';
import { ProblemReport } from '../types/report';
import { getSecureToken, getSecureRefreshToken, setSecureToken } from '../utils/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DEFAULT_TIMEOUT_MS = 10_000;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getSecureToken();
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getSecureRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${BACKEND_BASE_URL}/users/refresh_token`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      id_token?: string;
      expires_in?: number;
      refresh_token?: string;
    };

    if (!data.id_token) return null;

    await setSecureToken(data.id_token);
    if (data.expires_in) {
      const expiresAtMs = Date.now() + data.expires_in * 1000;
      await AsyncStorage.setItem('tokenExpiresAt', String(expiresAtMs));
    }
    if (data.refresh_token) {
      const { setSecureRefreshToken } = await import('../utils/secureStorage');
      await setSecureRefreshToken(data.refresh_token);
    }

    return data.id_token;
  } catch {
    return null;
  }
}

let _onSessionExpired: (() => void) | null = null;
export function setOnSessionExpiredCallback(cb: () => void) {
  _onSessionExpired = cb;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const doFetch = async (opts: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...opts, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  };

  const response = await doFetch(options);

  if (response.status === 401) {
    if (__DEV__) console.log('[fetchWithTimeout] 401 detected, attempting token refresh...');
    const newToken = await refreshAccessToken();

    if (newToken) {
      const currentHeaders = (options.headers as Record<string, string>) ?? {};
      const updatedOptions: RequestInit = {
        ...options,
        headers: { ...currentHeaders, Authorization: `Bearer ${newToken}` },
      };
      if (__DEV__) console.log('[fetchWithTimeout] Token refreshed, retrying request...');
      return doFetch(updatedOptions);
    }

    if (__DEV__) console.log('[fetchWithTimeout] Refresh failed, session expired');
    _onSessionExpired?.();
  }

  return response;
}


export const loginUserByEmailAndPassword = async (email: string, password: string): Promise<TUserLogin> => {
  if (!email) {
    throw new Error('El correo es requerido');
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

  const loginUrl = `${BACKEND_BASE_URL}/users/login_with_email_and_password`;
  if (__DEV__) console.log('[LOGIN] URL:', loginUrl);
  if (__DEV__) console.log('[LOGIN] Payload:', JSON.stringify({ email, password: '***' }));

  let response: Response;
  try {
    response = await fetchWithTimeout(loginUrl, requestOptions);
  } catch (networkError) {
    if (__DEV__) console.error('[LOGIN] Network error:', networkError);
    throw new Error('Error de conexion. Verifica tu internet.');
  }

  if (__DEV__) console.log('[LOGIN] Response status:', response.status);

  if (!response.ok) {
    // Try to extract backend-provided message
    let backendMsg: string | null = null;
    try {
      const err = await response.json();
      if (__DEV__) console.log('[LOGIN] Error body:', JSON.stringify(err));
      if (err?.message) backendMsg = String(err.message);
      else if (err?.detail) backendMsg = String(err.detail);
    } catch { }

    if (backendMsg) {
      throw new Error(backendMsg);
    }

    // Fallback to status-based Spanish messages
    const status = response.status;
    if (status === 400 || status === 401) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } else if (status === 404) {
      throw new Error('Usuario no encontrado. Verifica tu correo electronico.');
    } else if (status >= 500) {
      throw new Error('Error del servidor. Intentalo mas tarde.');
    } else {
      throw new Error(`Error del servidor (${status}). Intentalo mas tarde.`);
    }
  }

  const data = await response.json();

  // Normaliza/valida shape
  const id_token = data?.id_token ?? data?.access_token;
  const expires_in = data?.expires_in ?? data?.expires ?? null;

  if (!id_token || expires_in == null) {
    throw new Error('Respuesta de login incompleta.');
  }

  if (__DEV__) console.log('[LOGIN] Success! Token received');
  return data as TUserLogin;
};

export const validateToken = async (idToken: string): Promise<TUserTokenValidate | null> => {
  try {
    if (!idToken) {
      throw new Error('Token inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/validate_token?id_token=${idToken}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserTokenValidate;
  } catch (error) {
    return null;
  }
};

export const postLogout = async (idToken: string): Promise<Record<string, string> | null> => {
  try {
    if (!idToken) {
      throw new Error('Token inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/logout?id_token=${idToken}`, requestOptions);

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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/register`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TBackResponse;
  } catch (error) {
    return null;
  }
};

export const getUserInformation = async (uid: string): Promise<TUserInformation | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/user_information/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserInformation;
  } catch (err) {
    return null;
  }
};

export const putUserInformation = async (
  uid: string,
  userInformation: TUpdateUserInformation,
): Promise<TBackResponse> => {
  if (!uid) {
    throw new Error('UID inválido');
  }

  const authHeaders = await getAuthHeaders();
  const response = await fetchWithTimeout(
    `${BACKEND_BASE_URL}/users/user_information/${uid}`,
    {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(userInformation),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error ${response.status} al actualizar la informacion del usuario${errorText ? `: ${errorText}` : ''}`,
    );
  }

  return (await response.json()) as TBackResponse;
};

export const getUserPicture = async (uid: string): Promise<TUserPicture | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/user_profile_picture/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserPicture;
  } catch (err) {
    return null;
  }
};

export const getUserProfilePictures = async (uid: string): Promise<TUserProfilePictures | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/profile_pictures/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserProfilePictures;
  } catch (err) {
    return null;
  }
};

export const updateUserProfilePicture = async (uid: string, url: string): Promise<TBackResponse | null> => {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/update_profile_picture/${uid}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Accept': 'application/json' },
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
    return null;
  }
};

export const getUserPoints = async (uid: string): Promise<TUserPoints | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/scores/score_user/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserPoints;
  } catch (err) {
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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/scores/current_month_sessions/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TUserCurrentMonthSession;
  } catch (error) {
    return null;
  }
};

export const getUserLast3MonthsInfo = async (uid: string): Promise<TUserLast3MonthInfo | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const url = `${BACKEND_BASE_URL}/scores/last_3_months_info/${uid}`;
    if (__DEV__) console.log('[DEBUG backend] getUserLast3MonthsInfo URL:', url);
    const response = await fetchWithTimeout(url, requestOptions);

    if (__DEV__) console.log('[DEBUG backend] getUserLast3MonthsInfo status:', response.status);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    if (__DEV__) console.log('[DEBUG backend] getUserLast3MonthsInfo result:', JSON.stringify(result));
    return result as TUserLast3MonthInfo;
  } catch (error) {
    if (__DEV__) console.log('[DEBUG backend] getUserLast3MonthsInfo ERROR:', error);
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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/reports/problem_report/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TBackResponse;
  } catch (error) {
    return null;
  }
};

export const getGameCard = async (uid: string): Promise<TGameCard | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/user_game_card/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TGameCard;
  } catch (error) {
    return null;
  }
};

export const getScorePerGames = async (uid: string): Promise<TScorePerGame | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }

    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/scores/score_per_game/${uid}`, requestOptions);

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
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/scores/update_user_score_game/${uid}`, {
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
      throw new Error('Error al actualizar el score del juego');
    }

    const data = await response.json();
    return data as TBackResponse;
  } catch (error) {
    return null;
  }
};

export const getTopTwenty = async (): Promise<TTopTwenty[] | null> => {
  try {
    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const url = `${BACKEND_BASE_URL}/scores/top_twenty`;
    if (__DEV__) console.log('[DEBUG backend] getTopTwenty URL:', url);
    const response = await fetchWithTimeout(url, requestOptions);

    if (__DEV__) console.log('[DEBUG backend] getTopTwenty status:', response.status);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    if (__DEV__) console.log('[DEBUG backend] getTopTwenty result count:', Array.isArray(result) ? result.length : 'not-array');
    return result as TTopTwenty[];
  } catch (error) {
    if (__DEV__) console.log('[DEBUG backend] getTopTwenty ERROR:', error);
    return null;
  }
};

export const getTopTwentyMonthly = async (opts?: GetTopTwentyOpts): Promise<TTopTwenty[] | null> => {
  const { monthly = false, timeoutMs = 10_000 } = opts ?? {};
  const endpoint = monthly
    ? `${BACKEND_BASE_URL}/scores/top_twenty_monthly?monthly=true`
    : `${BACKEND_BASE_URL}/scores/top_twenty`;

  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetchWithTimeout(endpoint, {
      method: 'GET',
      headers: authHeaders,
    }, timeoutMs);

    if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
    const data = (await res.json()) as TTopTwenty[];
    return data;
  } catch (err) {
    return null;
  }
};

export const getUserBadges = async (uid: string): Promise<TUserBadges | null> => {
  try {
    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const url = `${BACKEND_BASE_URL}/users/user_badges/${uid}`;
    if (__DEV__) console.log('[DEBUG backend] getUserBadges URL:', url);
    const response = await fetchWithTimeout(url, requestOptions);

    if (__DEV__) console.log('[DEBUG backend] getUserBadges status:', response.status);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    if (__DEV__) console.log('[DEBUG backend] getUserBadges result:', JSON.stringify(result));
    return result as TUserBadges;
  } catch (error) {
    if (__DEV__) console.log('[DEBUG backend] getUserBadges ERROR:', error);
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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/games/`, requestOptions);


    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/active_competitions/${uid}`, requestOptions);

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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/competitions/${uid}`, requestOptions);

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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/create`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const putRejectCompetition = async (uid: string, competitionUid: string, id: string): Promise<Record<string, string> | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/reject/${uid}/${competitionUid}/${id}`, {
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
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/accept/${uid}/${competitionUid}/${id}`, {
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
      throw new Error('Objeto no valido');
    }

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/competition_session`, {
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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/competition_plays/${userUid}/${opponentUid}/${competitionId}`, requestOptions);

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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/all_competition/${userUid}`, requestOptions);

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

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/competition/competitive_status/${userUid}/${opponentUid}/${uniqueId}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result as TCompetitiveStatus;
  } catch (error) {
    return null;
  }
};

export const putResetPassword = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email inválido');
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/users/reset_password/${email}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
};

export const getTopGlobalByUser = async (uid: string): Promise<number | null> => {
  try {
    if (!uid) {
      throw new Error('UID inválido');
    }
    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };
    const url = `${BACKEND_BASE_URL}/scores/top_global/${uid}`;
    if (__DEV__) console.log('[DEBUG backend] getTopGlobalByUser URL:', url);
    const response = await fetchWithTimeout(url, requestOptions);

    if (__DEV__) console.log('[DEBUG backend] getTopGlobalByUser status:', response.status);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const result = await response.json();
    if (__DEV__) console.log('[DEBUG backend] getTopGlobalByUser result:', JSON.stringify(result));

    return result as number;
  } catch (error) {
    if (__DEV__) console.log('[DEBUG backend] getTopGlobalByUser ERROR:', error);
    return null;
  }
};

export const getDashboardSummary = async (uid: string): Promise<TDashboardSummary | null> => {
  try {
    if (!uid) throw new Error('UID inválido');
    const headers = await getAuthHeaders();
    const url = `${BACKEND_BASE_URL}/scores/dashboard_summary/${uid}`;
    if (__DEV__) console.log('[DEBUG backend] getDashboardSummary URL:', url);
    const response = await fetchWithTimeout(url, { method: 'GET', headers });
    if (__DEV__) console.log('[DEBUG backend] getDashboardSummary status:', response.status);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const result = await response.json();
    if (__DEV__) console.log('[DEBUG backend] getDashboardSummary result:', JSON.stringify(result));
    return result as TDashboardSummary;
  } catch (error) {
    if (__DEV__) console.log('[DEBUG backend] getDashboardSummary ERROR:', error);
    return null;
  }
};

export const getTopMonthlyByUser = async (uid: string): Promise<number | null> => {
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
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/scores/top_monthly/${uid}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const result = await response.json();

    return result as number;
  }
  catch (error) {
    return null;
  }
};

export const getProblemReports = async (uid: string): Promise<ProblemReport[] | null> => {
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
    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/reports/reports_by_uid/${uid}`, requestOptions);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }
    const { reports } = await response.json();
    return reports as any[];
  } catch (error) {
    return null;
  }
};

export const getGamesCatalog = async (): Promise<TGameCatalogResponse | null> => {
  try {
    const headers = await getAuthHeaders();
    const requestOptions = {
      method: 'GET',
      headers,
    };

    const response = await fetchWithTimeout(`${BACKEND_BASE_URL}/games/catalog`, requestOptions);

    // if (__DEV__) console.log('[DEBUG backend] getGamesCatalog URL:', `${BACKEND_BASE_URL}/games/catalog`);
    // if (__DEV__) console.log('[DEBUG backend] getGamesCatalog status:', response.status);
    // if (__DEV__) console.log('[DEBUG backend] getGamesCatalog response:', response);
    if (!response.ok) {
      if (__DEV__) console.log('[DEBUG backend] getGamesCatalog ERROR:', `Error en la solicitud: ${response.status}`);
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    // if (__DEV__) console.log('[DEBUG backend] getGamesCatalog result:', JSON.stringify(result));
    return result as TGameCatalogResponse;
  } catch (error) {
    return null;
  }
};
