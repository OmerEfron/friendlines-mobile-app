import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const defaultAppContext: AppContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
  isLoading: false,
  setIsLoading: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  const value: AppContextType = {
    isDarkMode,
    toggleTheme,
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 