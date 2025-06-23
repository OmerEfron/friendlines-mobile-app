import { useCallback, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiService } from '@/services/api';
import { useNotification } from './useNotification';

interface UsePushNotificationsReturn {
  registerForPushNotifications: () => Promise<void>;
  isRegistering: boolean;
  registrationError: Error | null;
}

// Configure notification behavior with simplified handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = (userId?: string): UsePushNotificationsReturn => {
  const { showError, showSuccess } = useNotification();
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  // Register push token mutation
  const registerTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      if (!userId) throw new Error('User ID is required');
      return await apiService.registerPushToken(userId, token);
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
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        showError('Permission Denied', 'Push notification permissions are required for the best experience.');
        return;
      }

      // Get the push token - simplified without projectId for now
      const tokenData = await Notifications.getExpoPushTokenAsync();

      console.log('Push token:', tokenData.data);

      // Register token with backend
      if (userId) {
        await registerTokenMutation.mutateAsync(tokenData.data);
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      showError('Setup Error', 'Failed to set up push notifications. Please try again.');
    }
  }, [userId, registerTokenMutation, showError, showSuccess]);

  // Set up notification listeners
  useEffect(() => {
    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      
      const data = notification.request.content.data || {};
      const notificationType = data.type as string;
      const userFullName = data.userFullName as string;
      const groupName = data.groupName as string;
      
      // Show in-app notification for certain types
      if (notificationType === 'friend_request') {
        showSuccess('New Friend Request', `${userFullName} sent you a friend request`);
      } else if (notificationType === 'friend_accepted') {
        showSuccess('Friend Request Accepted', `${userFullName} accepted your friend request`);
      } else if (notificationType === 'group_invite') {
        showSuccess('Group Invitation', `You've been invited to join "${groupName}"`);
      }
    });

    // Listener for when a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      
      const data = response.notification.request.content.data || {};
      const notificationType = data.type as string;
      const postId = data.postId as string;
      
      // Handle navigation based on notification type
      // This would integrate with your navigation system
      switch (notificationType) {
        case 'new_post':
        case 'group_post':
          // Navigate to post detail
          console.log('Navigate to post:', postId);
          break;
        case 'friend_request':
        case 'friend_accepted':
          // Navigate to friends screen
          console.log('Navigate to friends screen');
          break;
        case 'group_invite':
          // Navigate to groups screen
          console.log('Navigate to groups screen');
          break;
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [showSuccess]);

  return {
    registerForPushNotifications,
    isRegistering: registerTokenMutation.isPending,
    registrationError: registerTokenMutation.error,
  };
}; 