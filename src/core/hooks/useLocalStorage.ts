
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
      try {
        // Obtener del localStorage por key
        const item = window.localStorage.getItem(key);
        // Parsear el JSON almacenado o devolver initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // Si hay un error, devolver initialValue
       console.error(`Error reading localStorage key "${key}":`, error);
        return initialValue;
      }
    });
  
    const setValue = (value: T | ((val: T) => T)) => {
      try {

        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    };
  
    useEffect(() => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key && e.newValue) {
          setStoredValue(JSON.parse(e.newValue));
        }
      };
  
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }, [key]);
  
    return [storedValue, setValue];
  };
  
  export default useLocalStorage;