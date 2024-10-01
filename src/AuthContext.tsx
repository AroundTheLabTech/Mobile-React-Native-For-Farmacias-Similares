import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './lib/firebase'; // Importa el archivo Firebase.js
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from './services/UserDatabase'; // Importa el servicio que consulta Firestore

type AuthContextType = {
  uid: string | null;
  age: string | null;
  displayName: string | null;
  email: string | null;
  gender: string | null;
  lastSession: string | null;
  scoreTotal: number | null;
  ubication: string | null;
};

const AuthContext = createContext<AuthContextType>({
  uid: null,
  age: null,
  displayName: null,
  email: null,
  gender: null,
  lastSession: null,
  scoreTotal: 0,
  ubication: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [lastSession, setLastSession] = useState<string | null>(null);
  const [scoreTotal, setScoreTotal] = useState<number | null>(0);
  const [ubication, setUbication] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid); // Guardamos el uid del usuario autenticado

        // Obtener los datos del usuario desde Firestore
        const userData = await getUserData(user.uid);
        if (userData) {
          setAge(userData.age);
          setDisplayName(userData.display_name);
          setEmail(userData.email);
          setGender(userData.gender);
          setLastSession(userData.last_session);
          setScoreTotal(userData.score_total);
          setUbication(userData.ubication);
        }

        console.log("Datos del usuario obtenidos y guardados en el contexto");
      } else {
        setUid(null); // El usuario no está autenticado
        setAge(null);
        setDisplayName(null);
        setEmail(null);
        setGender(null);
        setLastSession(null);
        setScoreTotal(0);
        setUbication(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ uid, age, displayName, email, gender, lastSession, scoreTotal, ubication }}>
      {children}
    </AuthContext.Provider>
  );
};
