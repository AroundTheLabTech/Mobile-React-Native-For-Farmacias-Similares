import { Alert } from 'react-native';
import { BACKEND_BASE_URL } from '@env';
import { TUserCurrentMonthSession, TUserLast3MonthInfo, TUserPoints, TUserInformation, TUserPicture, TBackResponse, TGameCard, TUserLogin, TUserProfilePictures, TScorePerGame, TTopTwenty } from 'src/types/user';

export const loginUserByEmailAndPassword = async (email: string, password: string): Promise<TUserLogin | null> => {
  try {
    if (!email) {
      throw new Error('Email inválido');
    }

    if (!password) {
      throw new Error('Email inválido');
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
    Alert.alert('Error', 'No se pudo encontrar la foto de perfil del usuario');
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
    Alert.alert('Error', 'No se pudo obtener el puntaje del usuario');
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

    console.log(response);

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
