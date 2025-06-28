import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useAppContext } from './AppContext';
import notificationService, { NotificationData } from '../services/notificationService';

// Helper function to validate token format
const isValidExpoPushToken = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  return token.startsWith('ExponentPushToken[') && token.endsWith(']');
};

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
  const previousTokenRef = useRef<string | null>(null);

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
        previousTokenRef.current = token;
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

  // Handle token updates - FIXED: Better dependency management and prevents loops
  useEffect(() => {
    // Only set up listener if we have a user
    if (!user?.id) {
      return;
    }

    const tokenListener = Notifications.addPushTokenListener((token) => {
      console.log('🔄 Push token updated:', token.data);
      
      // FIXED: Validate token format before processing
      if (!isValidExpoPushToken(token.data)) {
        console.warn('❌ Invalid token format: {"hasPrefix": false, "hasSuffix": false, "token": "' + token.data.substring(0, 30) + '..."}');
        console.error('❌ Invalid token format, cannot register with backend:', token.data);
        console.warn('⚠️ Failed to re-register token with backend');
        return; // Skip processing invalid tokens
      }
      
      // Check if this is actually a different token
      if (token.data !== previousTokenRef.current) {
        console.log('🔄 Token changed, updating state and re-registering with backend...');
        setExpoPushToken(token.data);
        previousTokenRef.current = token.data;
        
        // Re-register with backend for genuine token changes
        notificationService.registerTokenWithBackend(user.id, token.data)
          .then(success => {
            if (success) {
              console.log('✅ Token successfully re-registered with backend');
            } else {
              console.warn('⚠️ Failed to re-register token with backend');
            }
          })
          .catch(error => {
            console.error('❌ Error re-registering token:', error);
          });
      } else {
        console.log('🔄 Token update received but token unchanged, skipping re-registration');
      }
    });

    return () => {
      console.log('🧹 Cleaning up token listener...');
      tokenListener.remove();
    };
  }, [user?.id]); // Only depend on user.id, not expoPushToken

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