import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@/types';

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Authentication
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  isInitializing: boolean;
}

const defaultAppContext: AppContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
  isLoading: false,
  setIsLoading: () => {},
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  isInitializing: true,
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

const USER_STORAGE_KEY = '@friendlines_user';

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async (): Promise<void> => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const login = async (userData: AuthUser): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user to storage:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to remove user from storage:', error);
      throw error;
    }
  };

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  const value: AppContextType = {
    isDarkMode,
    toggleTheme,
    isLoading,
    setIsLoading,
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isInitializing,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 