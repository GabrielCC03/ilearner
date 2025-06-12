import React from 'react';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      {/* Add global providers here (e.g., React Query, Context providers, etc.) */}
      {children}
    </>
  );
}; 