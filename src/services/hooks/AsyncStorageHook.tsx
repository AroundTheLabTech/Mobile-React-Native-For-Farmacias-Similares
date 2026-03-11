import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook personalizado para leer y escribir en AsyncStorage.
 * @param {string} key - La clave de AsyncStorage.
 * @param {any} defaultValue - El valor por defecto si no se encuentra en AsyncStorage.
 * @returns {[any, Function]} Un arreglo con el valor almacenado y la función para actualizarlo.
 */
function useAsyncStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(defaultValue);
  const hasLoadedRef = useRef(false);

  // Load value from AsyncStorage on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const fetchValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          setValue(JSON.parse(storedValue));
        } else {
          setValue(defaultValue);
        }
        hasLoadedRef.current = true;
      } catch (_error) {
        // Silently handle read errors
      }
    };

    fetchValue();
  }, [key, defaultValue]);

  /**
   * Actualiza el valor almacenado en AsyncStorage y en el estado.
   * @param {any} newValue - El nuevo valor para almacenar en AsyncStorage.
   */
  const setStoredValue = async (newValue) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newValue)); // Guarda el valor en AsyncStorage
      setValue(newValue); // Actualiza el valor en el estado del componente
    } catch (_error) {
      // Silently handle write errors
    }
  };

  return [value, setStoredValue];
}

export default useAsyncStorage;
