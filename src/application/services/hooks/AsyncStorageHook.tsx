import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook personalizado para leer y escribir en AsyncStorage.
 * @param {string} key - La clave de AsyncStorage.
 * @param {any} defaultValue - El valor por defecto si no se encuentra en AsyncStorage.
 * @returns {[any, Function]} Un arreglo con el valor almacenado y la función para actualizarlo.
 */
function useAsyncStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(defaultValue);

  // Cargar el valor desde AsyncStorage cuando el componente se monta
  useEffect(() => {
    const fetchValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue)); // Si el valor existe, se establece el valor almacenado
        } else {
          setValue(defaultValue); // Si no existe, se usa el valor por defecto
        }
      } catch (error) {
        console.error('Error leyendo desde AsyncStorage:', error);
      }
    };

    fetchValue();
  }, [key, defaultValue, value]);

  /**
   * Actualiza el valor almacenado en AsyncStorage y en el estado.
   * @param {any} newValue - El nuevo valor para almacenar en AsyncStorage.
   */
  const setStoredValue = async (newValue) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newValue)); // Guarda el valor en AsyncStorage
      setValue(newValue); // Actualiza el valor en el estado del componente
    } catch (error) {
      console.error('Error escribiendo en AsyncStorage:', error);
    }
  };

  return [value, setStoredValue];
}

export default useAsyncStorage;
