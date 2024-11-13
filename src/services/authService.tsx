import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from '../lib/firebase';

// Función para iniciar sesión
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // El usuario inició sesión correctamente
    const user = userCredential.user;
    console.log("Login exitoso", user);

    // Devuelve también el token de acceso y la expiración
    const accessToken = await user.getIdToken();
    const expirationTime = (await user.getIdTokenResult()).expirationTime;

    return {
      user,
      accessToken,
      expirationTime,
    };
  } catch (error) {
    // Error al iniciar sesión
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  return auth.currentUser;
};

export const getUserInformation = async () => {
  try {
    const userCredential = await getAuth();
    return userCredential;
  } catch (error) {
    // Error al iniciar sesión
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Comprobar el estado de inicio de sesión
export const checkLoginStatus = async (storedAccessToken: string, storedExpirationTime: string) => {
  try {
    if (storedAccessToken && storedExpirationTime) {
      const expirationTime = Number(storedExpirationTime);
      const currentTime = Date.now();

      // Comprueba si el token está a menos de 5 minutos de expirar
      const bufferTime = 5 * 60 * 1000; // 5 minutos en milisegundos
      if (expirationTime - currentTime <= bufferTime) {
        return false; // El token está por expirar
      } else {
        return true; // El token es válido
      }
    }
  } catch (error) {
    console.error('Error al verificar el estado de inicio de sesión:', error);
  }
};

// Función para refrescar el token
export const refreshAccessToken = async (user) => {
  try {
    const newAccessToken = await user.getIdToken(true); // Forzar la renovación del token
    const newExpirationTime = (await user.getIdTokenResult()).expirationTime;

    return {
      userAccessToken: newAccessToken,
      tokenExpirationTime: newExpirationTime.toString(),
    };
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    return null;
  }
};
