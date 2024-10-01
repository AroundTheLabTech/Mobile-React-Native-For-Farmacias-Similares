import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase';  

// Función para iniciar sesión
export const loginWithEmailAndPassword = async (email: string, password: string): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // El usuario inició sesión correctamente
    const user = userCredential.user;
    console.log("Login exitoso", user);
    return user;
  } catch (error) {
    // Error al iniciar sesión
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};
