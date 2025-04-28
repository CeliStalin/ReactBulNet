import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
}

// Crear el contexto con un valor predeterminado
const AuthContext = createContext<AuthContextType>({
  isLoggingOut: false,
  setIsLoggingOut: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Proporcionar el valor del contexto
  const contextValue: AuthContextType = {
    isLoggingOut,
    setIsLoggingOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe utilizarse dentro de un AuthProvider');
  }
  return context;
};