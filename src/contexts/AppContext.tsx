import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@/types';
import { apiService } from '@/services/api';

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Authentication
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  isInitializing: boolean;
}

const defaultAppContext: AppContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
  isLoading: false,
  setIsLoading: () => {},
  // Authentication
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
const TOKEN_STORAGE_KEY = '@friendlines_token';

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
      console.log('🔧 AppContext: Loading user and token from storage...');
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(TOKEN_STORAGE_KEY)
      ]);
      
      if (storedUser) {
        console.log('👤 AppContext: User loaded from storage');
        setUser(JSON.parse(storedUser));
      }
      
      if (storedToken) {
        console.log('🔑 AppContext: Token found in storage, setting in API service...');
        apiService.setAuthToken(storedToken);
        console.log('🔑 AppContext: Token set in API service. Current token:', apiService.getAuthToken() ? 'PRESENT' : 'MISSING');
      } else {
        console.log('❌ AppContext: No token found in storage');
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    } finally {
      console.log('✅ AppContext: Initialization complete');
      setIsInitializing(false);
    }
  };

  const login = async (userData: AuthUser, token?: string): Promise<void> => {
    try {
      console.log('🔧 AppContext: Starting login process...');
      console.log('🔧 AppContext: User data received:', !!userData);
      console.log('🔧 AppContext: Token received:', !!token);
      
      const promises = [
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      ];
      
      if (token) {
        console.log('🔑 AppContext: Saving token to AsyncStorage...');
        promises.push(AsyncStorage.setItem(TOKEN_STORAGE_KEY, token));
        apiService.setAuthToken(token);
        console.log('🔑 AppContext: Token set in API service');
      } else {
        console.warn('⚠️ AppContext: No token provided to login method');
      }
      
      await Promise.all(promises);
      setUser(userData);
      console.log('✅ AppContext: Login completed successfully');
    } catch (error) {
      console.error('Failed to save user to storage:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(USER_STORAGE_KEY),
        AsyncStorage.removeItem(TOKEN_STORAGE_KEY)
      ]);
      apiService.setAuthToken(null);
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