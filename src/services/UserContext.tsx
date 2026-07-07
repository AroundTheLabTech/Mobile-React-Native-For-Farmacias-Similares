// src/context/ProfileContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getScorePerGames, getUserInformation, getUserLast3MonthsInfo, getUserPicture, getUserPoints } from '@services/backend';  // Función que obtiene la imagen de perfil
import { useAuth } from '../AuthContext';
import { TScorePerGame, TUserInformation, TUserLast3MonthInfo, TUserPoints } from '../types/user';
import { DEV_SKIP_LOGIN, MOCK_USER_INFORMATION, MOCK_USER_POINTS, MOCK_LAST_3_MONTHS, MOCK_SCORE_PER_GAME } from '../config/dev';

// Crear el contexto
const ProfileContext = createContext(undefined);

// Crear un hook personalizado para consumir el contexto
export const useUser = () => {
  return useContext(ProfileContext);
};

// Proveer el contexto a la aplicación
export const UserProvider = ({ children }) => {
  const [profilePicture, setProfilePicture] = useState<string>(null);
  const [updateProfilePicture, setUpdateProfilePicture] = useState(false);

  const [last3MonthsScores, setLast3MonthsScores] = useState<TUserLast3MonthInfo>(DEV_SKIP_LOGIN ? MOCK_LAST_3_MONTHS : null);
  const [updateLast3MonthsScores, setUpdateLast3MonthsScores] = useState(false);

  const [scorePerGame, setScorePerGame] = useState<TScorePerGame>(DEV_SKIP_LOGIN ? MOCK_SCORE_PER_GAME : null);
  const [updateScorePerGame, setUpdateScorePerGame] = useState(false);

  const [userPoints, setUserPoints] = useState<TUserPoints>(DEV_SKIP_LOGIN ? MOCK_USER_POINTS : null);
  const [updateUserPoints, setUpdateUserPoints] = useState(false);

  const [userInformation, setUserInformation] = useState<TUserInformation>(DEV_SKIP_LOGIN ? MOCK_USER_INFORMATION : null);
  const [updateUserInformation, setUpdateUserInformation] = useState(false);

  const { uid, isLogout, setIsLogout } = useAuth();

  // Actualizar la imagen de perfil cuando `updateProfilePicture` cambie
  useEffect(() => {
    if (updateProfilePicture) {
      async function fetchProfilePicture() {
        try {
          const response = await getUserPicture(uid);
          if(response?.profile_picture_url) {
            setProfilePicture(response.profile_picture_url);
          } else {
            throw new Error('No hay URL');
          }
        } catch (error) {
          // console.error('Error fetching profile picture', error);
          return;
        }
      }

      fetchProfilePicture();
      setUpdateProfilePicture(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateProfilePicture]);

  useEffect(() => {
    if (updateLast3MonthsScores) {
      async function fetchUserScore() {
        try {
          console.log('[DEBUG UserContext] fetching last3MonthsScores for uid:', uid);
          const response = await getUserLast3MonthsInfo(uid);  // Obtener imagen de perfil
          console.log('[DEBUG UserContext] last3MonthsScores response:', JSON.stringify(response));
          console.log('[DEBUG UserContext] last3MonthsScores sessions count:', response?.sessions?.length ?? 'no sessions');
          setLast3MonthsScores(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.log('[DEBUG UserContext] last3MonthsScores ERROR:', error);
          return;
        }
      }

      fetchUserScore();
      setUpdateLast3MonthsScores(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateLast3MonthsScores]);

  useEffect(() => {
    if (updateScorePerGame) {
      async function fetchUserScorePerGame() {
        try {
          const response = await getScorePerGames(uid);  // Obtener imagen de perfil
          setScorePerGame(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          // console.error('Error fetching profile picture', error);
          return;
        }
      }

      fetchUserScorePerGame();
      setUpdateScorePerGame(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateScorePerGame]);

  useEffect(() => {
    if (updateUserPoints) {
      async function fetchUserPoints() {
        try {
          console.log('[DEBUG UserContext] fetching userPoints for uid:', uid);
          const response = await getUserPoints(uid);  // Obtener imagen de perfil
          console.log('[DEBUG UserContext] userPoints response:', JSON.stringify(response));
          setUserPoints(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.log('[DEBUG UserContext] userPoints ERROR:', error);
          return;
        }
      }

      fetchUserPoints();
      setUpdateUserPoints(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateUserPoints]);

  const patchUserInformation = useCallback((patch: Partial<TUserInformation>) => {
    setUserInformation(prev => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const refreshUserInformation = useCallback(async (): Promise<TUserInformation | null> => {
    if (!uid) {
      return null;
    }
    try {
      const response = await getUserInformation(uid);
      if (response) {
        setUserInformation(response);
      }
      return response;
    } catch {
      return null;
    }
  }, [uid]);

  useEffect(() => {
    if (updateUserInformation) {
      async function fetchUserInformation() {
        try {
          const response = await getUserInformation(uid);
          if (response) {
            setUserInformation(response);
          }
        } finally {
          setUpdateUserInformation(false);
        }
      }

      fetchUserInformation();
    }
  }, [uid, updateUserInformation]);

  useEffect(() => {
    if (isLogout) {
      setProfilePicture(null);
      setUpdateProfilePicture(false);

      setLast3MonthsScores(null);
      setUpdateLast3MonthsScores(false);

      setScorePerGame(null);
      setUpdateScorePerGame(false);

      setUserPoints(null);
      setUpdateUserPoints(false);

      setUserInformation(null);
      setUpdateUserInformation(false);

      setIsLogout(false);
    }
  }, [isLogout, setIsLogout]);

  return (
    <ProfileContext.Provider
      value={
        {
          profilePicture,
          setUpdateProfilePicture,
          last3MonthsScores,
          setUpdateLast3MonthsScores,
          scorePerGame,
          setUpdateScorePerGame,
          userPoints,
          setUpdateUserPoints,
          userInformation,
          setUpdateUserInformation,
          patchUserInformation,
          refreshUserInformation,
        }
      }>
      {children}
    </ProfileContext.Provider>
  );
};
