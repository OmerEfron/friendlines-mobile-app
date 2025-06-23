import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

interface NotificationOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

interface UseNotificationReturn {
  showNotification: (options: NotificationOptions) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const showNotification = useCallback(({ title, description, variant = 'default' }: NotificationOptions) => {
    // Use native Alert for immediate feedback
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert(
        title,
        description,
        [{ text: 'OK', style: variant === 'error' ? 'destructive' : 'default' }],
        { cancelable: true }
      );
    }
    
    // TODO: Future enhancement - Use expo-notifications for background notifications
    // This would be useful for notifying about new newsflashes from friends
  }, []);

  const showSuccess = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'success' });
  }, [showNotification]);

  const showError = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'error' });
  }, [showNotification]);

  const showWarning = useCallback((title: string, description?: string) => {
    showNotification({ title, description, variant: 'warning' });
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
  };
}; 