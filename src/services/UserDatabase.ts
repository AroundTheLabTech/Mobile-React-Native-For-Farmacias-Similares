import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Importa la instancia de Firestore

export const getUserData = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Devuelve los datos del documento
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
    throw error;
  }
};
