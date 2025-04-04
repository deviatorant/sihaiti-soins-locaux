
import React, { createContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component wrapper
export const AuthContextProvider: React.FC<{ 
  children: React.ReactNode;
  value: AuthContextType;
}> = ({ children, value }) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
