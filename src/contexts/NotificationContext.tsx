import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from './AppContext';
import notificationService, { NotificationData } from '../services/notificationService';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForNotifications: (userId: string) => Promise<boolean>;
  clearNotification: () => void;
  sendTestNotification: () => Promise<void>;
  updateBadgeCount: (count?: number) => Promise<void>;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const { user } = useAppContext();
  const cleanupRef = useRef<(() => void) | null>(null);

  const registerForNotifications = async (userId: string): Promise<boolean> => {
    try {
      // Check if registration is already in progress
      if (notificationService.isRegistrationInProgress()) {
        console.log('🔒 NotificationContext: Registration already in progress, skipping...');
        return false;
      }

      const token = await notificationService.registerForPushNotifications();
      if (token) {
        setExpoPushToken(token);
        const success = await notificationService.registerTokenWithBackend(userId, token);
        return success;
      }
      return false;
    } catch (error) {
      console.error('Failed to register for notifications:', error);
      return false;
    }
  };

  const sendTestNotification = async (): Promise<void> => {
    try {
      await notificationService.sendTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  };

  const updateBadgeCount = async (count?: number): Promise<void> => {
    try {
      await notificationService.updateBadgeCount(count);
    } catch (error) {
      console.error('Failed to update badge count:', error);
      throw error;
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Setup basic notification listeners (without navigation)
  useEffect(() => {
    const setupNotifications = async () => {
      // Setup notification listeners without navigation
      const cleanup = await notificationService.setupNotificationListeners();
      cleanupRef.current = cleanup;
      
      return cleanup;
    };

    setupNotifications();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // Handle token updates
  useEffect(() => {
    const tokenListener = Notifications.addPushTokenListener((token) => {
      console.log('🔄 Push token updated:', token.data);
      setExpoPushToken(token.data);
      // Only re-register with backend if this is a genuine token update
      // (not part of initial registration process)
      if (user?.id && expoPushToken && expoPushToken !== token.data) {
        console.log('🔄 Token changed, re-registering with backend...');
        notificationService.registerTokenWithBackend(user.id, token.data);
      }
    });

    return () => tokenListener.remove();
  }, [user?.id, expoPushToken]);

  // Clear badge when app opens
  useEffect(() => {
    updateBadgeCount(0);
  }, []);

  const value: NotificationContextType = {
    expoPushToken,
    notification,
    registerForNotifications,
    clearNotification,
    sendTestNotification,
    updateBadgeCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 