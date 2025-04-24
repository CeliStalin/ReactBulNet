import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoggingOut, setIsLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};