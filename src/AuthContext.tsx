import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TUserLogin } from 'src/types/user';

type AuthContextType = {
  uid: string | null;
  age: number | null;
  displayName: string | null;
  email: string | null;
  gender: string | null;
  lastSession: string | null;
  scoreTotal: number | null;
  ubication: string | null;
  logout: () => void;
  updateUserInformation: (user: TUserLogin) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children })  => {
  const [uid, setUid] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [ubication, setUbication] = useState<string | null>(null);
  const [scoreTotal, setScoreTotal] = useState<number | null>(null); // Placeholder si planeas usarlo más tarde.

  const updateUserInformation = (user: TUserLogin) => {
    setUid(user.uid);
    setAge(user.age);
    setDisplayName(user.display_name);
    setEmail(user.email);
    setGender(user.gender);
    setLastSession(user.last_session);
    setUbication(user.ubication);
    setScoreTotal(0); // Ejemplo, ajusta esto según tu lógica.
  };

  const logout = async () => {
    setUid(null);
    setAge(null);
    setDisplayName(null);
    setEmail(null);
    setGender(null);
    setLastSession(null);
    setUbication(null);
    setScoreTotal(null);
    await AsyncStorage.removeItem('userAccessToken');
    await AsyncStorage.removeItem('tokenExpirationTime');
  };

  return (
    <AuthContext.Provider
      value={{
        uid,
        age,
        displayName,
        email,
        gender,
        lastSession,
        ubication,
        scoreTotal,
        logout,
        updateUserInformation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
