import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Importa la instancia de Firestore

// Servicio para obtener los puntajes del usuario y sumar el total
export const getUserScores = async (uid: string) => {
  try {
    const docRef = doc(db, 'scores', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const scores = docSnap.data();
      let totalScore = 0;

      // Sumar todos los campos de puntaje
      for (const key in scores) {
        if (scores.hasOwnProperty(key)) {
          totalScore += scores[key]; // Sumar los valores
        }
      }

      return totalScore; // Devuelve el puntaje total
    } else {
      console.log("No se encontraron puntajes para este usuario.");
      return 0;
    }
  } catch (error) {
    console.error("Error al obtener los puntajes del usuario:", error);
    throw error;
  }
};
