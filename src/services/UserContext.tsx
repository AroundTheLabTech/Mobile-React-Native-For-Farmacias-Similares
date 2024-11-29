// src/context/ProfileContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserLast3MonthsInfo, getUserPicture } from '@services/backend';  // Función que obtiene la imagen de perfil
import { useAuth } from '../AuthContext';
import { TUserLast3MonthInfo } from '../types/user';

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
      async function fetchUserrScore() {
        try {
          const response = await getUserLast3MonthsInfo(uid);  // Obtener imagen de perfil
          setLast3MonthsScores(response);  // Asumimos que `response.url` es la URL de la imagen
        } catch (error) {
          console.error('Error fetching profile picture', error);
        }
      }

      fetchUserrScore();
      setUpdateLast3MonthsScores(false);  // Resetear el estado de actualización después de la carga
    }
  }, [uid, updateLast3MonthsScores]);

  return (
    <ProfileContext.Provider value={{ profilePicture, setUpdateProfilePicture, last3MonthsScores, setUpdateLast3MonthsScores }}>
      {children}
    </ProfileContext.Provider>
  );
};
