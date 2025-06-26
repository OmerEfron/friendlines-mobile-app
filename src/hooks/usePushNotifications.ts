import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNotification } from './useNotification';
import notificationService from '../services/notificationService';

interface UsePushNotificationsReturn {
  registerForPushNotifications: () => Promise<void>;
  isRegistering: boolean;
  registrationError: Error | null;
}

export const usePushNotifications = (userId?: string): UsePushNotificationsReturn => {
  const { showError, showSuccess } = useNotification();

  // Register push token mutation
  const registerTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      if (!userId) throw new Error('User ID is required');
      return await notificationService.registerTokenWithBackend(userId, token);
    },
    onSuccess: () => {
      showSuccess('Notifications Enabled', 'Push notifications have been enabled successfully.');
    },
    onError: (error) => {
      console.error('Failed to register push token:', error);
      showError('Notification Setup Failed', 'Failed to enable push notifications. Please try again.');
    },
  });

  const registerForPushNotifications = useCallback(async () => {
    try {
      const token = await notificationService.registerForPushNotifications();
      
      if (token) {
        console.log('Push token:', token);
        
        // Register token with backend
        if (userId) {
          await registerTokenMutation.mutateAsync(token);
        }
      } else {
        showError('Permission Denied', 'Push notification permissions are required for the best experience.');
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      showError('Setup Error', 'Failed to set up push notifications. Please try again.');
    }
  }, [userId, registerTokenMutation, showError, showSuccess]);

  return {
    registerForPushNotifications,
    isRegistering: registerTokenMutation.isPending,
    registrationError: registerTokenMutation.error,
  };
}; 