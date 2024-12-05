import { User } from '@domain/models/User';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Crear el contexto
const ProfileContext = createContext(undefined);

// Crear un hook personalizado para consumir el contexto
export const useUser = () => {
  return useContext(ProfileContext);
};

// Proveer el contexto a la aplicación
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [isUpdateUser, setIsUpdateUser] = useState<boolean>(false);

  const { login } = useAuth();
  const { isAuthenticated } = useAuth();

  const updateUser = (data: User) => {
    console.log('data usercontext', data);
    setIsUpdateUser(true);
    login();
    setUser(data);
  };

  useEffect(() => {
    if(isAuthenticated && !isUpdateUser) {
      setIsUpdateUser(true);
    }
  }, [isAuthenticated, isUpdateUser]);

  return (
    <ProfileContext.Provider value={
      {
        user,
        isUpdateUser,
        setIsUpdateUser,
        updateUser,
      }
    } >
      {children}
    </ProfileContext.Provider>
  );
};
