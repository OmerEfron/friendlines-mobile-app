import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from './AppContext';
import notificationService, { NotificationData } from '../services/notificationService';

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  registerForNotifications: (userId: string) => Promise<boolean>;
  clearNotification: () => void;
  handleNotificationNavigation: (data: NotificationData) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);
  const { user } = useAppContext();

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    setNotification(notification);
    console.log('Notification received:', notification);
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as unknown as NotificationData;
    console.log('Notification response:', response);

    // Handle navigation through the context method
    handleNotificationNavigation(data);
  };

  const handleNotificationNavigation = (data: NotificationData) => {
    // This will be called from components that have access to navigation
    console.log('Notification navigation triggered:', data.type);
    
    // Store the navigation data for components to use
    // Components can listen to this and handle navigation appropriately
  };

  const registerForNotifications = async (userId: string): Promise<boolean> => {
    try {
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

  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const setupListeners = async () => {
      const cleanup = await notificationService.setupNotificationListeners(
        handleNotificationReceived,
        handleNotificationResponse
      );

      return cleanup;
    };

    setupListeners().then(cleanup => {
      return () => {
        if (cleanup) cleanup();
      };
    });
  }, []);

  // Auto-register for notifications when user is available
  useEffect(() => {
    if (user?.id && !expoPushToken) {
      registerForNotifications(user.id);
    }
  }, [user?.id, expoPushToken]);

  const value: NotificationContextType = {
    expoPushToken,
    notification,
    registerForNotifications,
    clearNotification,
    handleNotificationNavigation,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 