import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Importa la instancia de Firestore

// Servicio para obtener las estadísticas del usuario
export const getUserTrophies = async (uid: string) => {
  try {
    const docRef = doc(db, 'stadistics', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().trofeos || []; // Retorna el array de trofeos si existe
    } else {
      console.log("No existe el documento de estadísticas para este usuario.");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener los trofeos del usuario:", error);
    throw error;
  }
};
