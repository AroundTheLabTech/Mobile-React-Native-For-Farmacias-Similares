// src/context/ProfileContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getScorePerGames, getUserInformation, getUserLast3MonthsInfo, getUserPicture, getUserPoints } from '@services/backend';  // Función que obtiene la imagen de perfil
import { useAuth } from '../AuthContext';
import { TScorePerGame, TUserInformation, TUserLast3MonthInfo, TUserPoints } from '../types/user';
import { DEV_SKIP_LOGIN, MOCK_USER_INFORMATION, MOCK_USER_POINTS, MOCK_LAST_3_MONTHS, MOCK_SCORE_PER_GAME } from '../config/dev';
import { normalizeAvatarBackendPath } from '../utils/avatars';

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
    if (!updateProfilePicture) return;

    async function fetchProfilePicture() {
      try {
        const response = await getUserPicture(uid);
        if (response?.profile_picture_url) {
          const normalized = normalizeAvatarBackendPath(response.profile_picture_url);
          if (normalized) {
            setProfilePicture(normalized);
          }
        }
      } catch {
        // ignore
      } finally {
        setUpdateProfilePicture(false);
      }
    }

    fetchProfilePicture();
  }, [uid, updateProfilePicture]);

  useEffect(() => {
    if (!updateLast3MonthsScores) return;

    async function fetchUserScore() {
      try {
        if (__DEV__) console.log('[DEBUG UserContext] fetching last3MonthsScores for uid:', uid);
        const response = await getUserLast3MonthsInfo(uid);
        if (__DEV__) console.log('[DEBUG UserContext] last3MonthsScores sessions count:', response?.sessions?.length ?? 'no sessions');
        if (response) {
          setLast3MonthsScores(response);
        }
      } catch (error) {
        if (__DEV__) console.log('[DEBUG UserContext] last3MonthsScores ERROR:', error);
      } finally {
        setUpdateLast3MonthsScores(false);
      }
    }

    fetchUserScore();
  }, [uid, updateLast3MonthsScores]);

  useEffect(() => {
    if (!updateScorePerGame) return;

    async function fetchUserScorePerGame() {
      try {
        const response = await getScorePerGames(uid);
        if (response) {
          setScorePerGame(response);
        }
      } catch {
        // ignore
      } finally {
        setUpdateScorePerGame(false);
      }
    }

    fetchUserScorePerGame();
  }, [uid, updateScorePerGame]);

  useEffect(() => {
    if (!updateUserPoints) return;

    async function fetchUserPointsData() {
      try {
        if (__DEV__) console.log('[DEBUG UserContext] fetching userPoints for uid:', uid);
        const response = await getUserPoints(uid);
        if (__DEV__) console.log('[DEBUG UserContext] userPoints response:', JSON.stringify(response));
        if (response) {
          setUserPoints(response);
        }
      } catch (error) {
        if (__DEV__) console.log('[DEBUG UserContext] userPoints ERROR:', error);
      } finally {
        setUpdateUserPoints(false);
      }
    }

    fetchUserPointsData();
  }, [uid, updateUserPoints]);

  const patchUserInformation = useCallback((patch: Partial<TUserInformation>) => {
    setUserInformation(prev => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const hydrateUserInformation = useCallback((info: TUserInformation) => {
    setUserInformation(info);
    setUpdateUserInformation(false);
  }, []);

  const setProfilePictureUrl = useCallback((url: string) => {
    const normalized = normalizeAvatarBackendPath(url) ?? url;
    setProfilePicture(normalized);
    setUpdateProfilePicture(false);
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
          setProfilePictureUrl,
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
          hydrateUserInformation,
        }
      }>
      {children}
    </ProfileContext.Provider>
  );
};
