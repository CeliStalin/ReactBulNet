import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../../src/hooks/useLocalStorage';


const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();


const addEventListenerMock = jest.fn();
const removeEventListenerMock = jest.fn();


beforeAll(() => {

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  

  window.addEventListener = addEventListenerMock;
  window.removeEventListener = removeEventListenerMock;
});


afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

describe('useLocalStorage', () => {
  test('debe retornar el valor inicial cuando no hay nada en localStorage', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));


    expect(result.current[0]).toBe(initialValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
  });

  test('debe retornar el valor almacenado cuando existe en localStorage', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';
    const storedValue = 'storedValue';
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedValue));


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));


    expect(result.current[0]).toBe(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
  });

  test('debe actualizar el valor y guardarlo en localStorage', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';
    const newValue = 'newValue';


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));
    
    act(() => {
      result.current[1](newValue);
    });


    expect(result.current[0]).toBe(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
  });

  test('debe usar una función para actualizar el valor', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';
    const updaterFn = (prev: string) => prev + '_updated';


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));
    
    act(() => {
      result.current[1](updaterFn);
    });


    expect(result.current[0]).toBe('initialValue_updated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify('initialValue_updated'));
  });

  test('debe manejar errores al leer de localStorage', () => {
 
    const key = 'testKey';
    const initialValue = 'initialValue';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    

    localStorageMock.getItem.mockImplementationOnce(() => { 
      throw new Error('Error al leer localStorage');
    });


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));


    expect(result.current[0]).toBe(initialValue); 
    expect(consoleErrorSpy).toHaveBeenCalled();
    
  
    consoleErrorSpy.mockRestore();
  });

  test('debe manejar errores al escribir en localStorage', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';
    const newValue = 'newValue';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    

    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Error al escribir en localStorage');
    });


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));
    
    act(() => {
      result.current[1](newValue);
    });


    expect(result.current[0]).toBe(newValue); 
    expect(consoleErrorSpy).toHaveBeenCalled(); 
    

    consoleErrorSpy.mockRestore();
  });

  test('debe registrar un event listener para storage events', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';

    
    const { unmount } = renderHook(() => useLocalStorage<string>(key, initialValue));

   
    expect(addEventListenerMock).toHaveBeenCalledWith('storage', expect.any(Function));
    
   
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('storage', expect.any(Function));
  });

  test('debe actualizar el valor cuando ocurre un storage event', () => {

    const key = 'testKey';
    const initialValue = 'initialValue';
    const newValueFromEvent = 'newValueFromEvent';
    
  
    let storageEventHandler: ((e: StorageEvent) => void) | null = null;
    addEventListenerMock.mockImplementationOnce((event, handler) => {
      if (event === 'storage') {
        storageEventHandler = handler;
      }
    });

 
    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));
    

    act(() => {
      if (storageEventHandler) {
        const mockEvent = {
          key,
          newValue: JSON.stringify(newValueFromEvent),
        } as StorageEvent;
        storageEventHandler(mockEvent);
      }
    });


    expect(result.current[0]).toBe(newValueFromEvent);
  });

  test('debe ignorar storage events para otras claves', () => {

    const key = 'testKey';
    const otherKey = 'otherKey';
    const initialValue = 'initialValue';
    const newValueFromEvent = 'newValueFromEvent';
    
  
    let storageEventHandler: ((e: StorageEvent) => void) | null = null;
    addEventListenerMock.mockImplementationOnce((event, handler) => {
      if (event === 'storage') {
        storageEventHandler = handler;
      }
    });


    const { result } = renderHook(() => useLocalStorage<string>(key, initialValue));
    
   
    act(() => {
      if (storageEventHandler) {
        const mockEvent = {
          key: otherKey,
          newValue: JSON.stringify(newValueFromEvent),
        } as StorageEvent;
        storageEventHandler(mockEvent);
      }
    });

    
    expect(result.current[0]).toBe(initialValue); 
  });

  test('debe trabajar con diferentes tipos de datos', () => {

    const { result: numberResult } = renderHook(() => useLocalStorage<number>('numberKey', 42));
    expect(numberResult.current[0]).toBe(42);
    
 
    const { result: boolResult } = renderHook(() => useLocalStorage<boolean>('boolKey', true));
    expect(boolResult.current[0]).toBe(true);
    
   
    const testObject = { name: 'Test', value: 123 };
    const { result: objectResult } = renderHook(() => useLocalStorage<typeof testObject>('objectKey', testObject));
    expect(objectResult.current[0]).toEqual(testObject);
    
  
    const testArray = [1, 2, 3];
    const { result: arrayResult } = renderHook(() => useLocalStorage<number[]>('arrayKey', testArray));
    expect(arrayResult.current[0]).toEqual(testArray);
  });
});