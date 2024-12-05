import React from 'react';
import { AuthProvider } from '@domain/context/AuthContext';
import { UserProvider } from '@domain/context/UserContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  );
};
