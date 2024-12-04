// src/context/ProfileContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getScorePerGames, getUserInformation, getUserLast3MonthsInfo, getUserPicture, getUserPoints } from '@services/backend';  // Función que obtiene la imagen de perfil
import { useAuth } from '../AuthContext';
import { TScorePerGame, TUserInformation, TUserLast3MonthInfo, TUserPoints } from '../types/user';

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

  const [last3MonthsScores, setLast3MonthsScores] = useState<TUserLast3MonthInfo>(null);
  const [updateLast3MonthsScores, setUpdateLast3MonthsScores] = useState(false);

  const [scorePerGame, setScorePerGame] = useState<TScorePerGame>(null);
  const [updateScorePerGame, setUpdateScorePerGame] = useState(false);

  const [userPoints, setUserPoints] = useState<TUserPoints>(null);
  const [updateUserPoints, setUpdateUserPoints] = useState(false);

  const [userInformation, setUserInformation] = useState<TUserInformation>(null);
  const [updateUserInformation, setUpdateUserInformation] = useState(false);

  const { uid } = useAuth();

  // Actualizar la imagen de perfil cuando `updateProfilePicture` cambie
  useEffect(() => {
    if (updateProfilePicture) {
      async function fetchProfilePicture() {
        try {
          const response = await getUserPicture(uid);  // Obtener imagen de perfil
          setProfilePicture(response.url);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.error('Error fetching profile picture', error);
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
          const response = await getUserLast3MonthsInfo(uid);  // Obtener imagen de perfil
          setLast3MonthsScores(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.error('Error fetching profile picture', error);
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
          console.error('Error fetching profile picture', error);
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
          const response = await getUserPoints(uid);  // Obtener imagen de perfil
          setUserPoints(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.error('Error fetching profile picture', error);
        }
      }

      fetchUserPoints();
      setUpdateUserPoints(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateUserPoints]);

  useEffect(() => {
    if (updateUserInformation) {
      async function fetchUserInformation() {
        try {
          const response = await getUserInformation(uid);  // Obtener imagen de perfil
          setUserInformation(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.error('Error fetching profile picture', error);
        }
      }

      fetchUserInformation();
      setUpdateUserInformation(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateUserInformation]);

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
        }
      }>
      {children}
    </ProfileContext.Provider>
  );
};
