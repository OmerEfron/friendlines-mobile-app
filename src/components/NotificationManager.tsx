import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useNotifications } from '../contexts/NotificationContext';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import notificationService, { NotificationNavigationHandler } from '../services/notificationService';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * NotificationManager Component
 * 
 * This component handles:
 * - Auto-registration of push notifications when user is authenticated
 * - Navigation handling for notifications (since it's inside NavigationContainer)
 * - Badge count management
 * - Token updates
 * 
 * It should be placed at the app root level to ensure proper notification lifecycle.
 */
export const NotificationManager: React.FC = () => {
  const { user, isInitializing } = useAppContext();
  const { registerForNotifications, updateBadgeCount, expoPushToken } = useNotifications();
  const navigation = useNavigation<NavigationProp>();

  // Create navigation handler for the notification service
  const createNavigationHandler = (): NotificationNavigationHandler => ({
    navigateToPost: (postId: string, userId?: string) => {
      console.log('🧭 Navigating to post:', postId);
      navigation.navigate('NewsflashDetail', { newsflashId: postId });
    },
    navigateToFriendRequests: () => {
      console.log('🧭 Navigating to friend requests');
      // Navigate to friends screen where friend requests are handled
      navigation.navigate('Menu'); // TODO: Update when friend requests screen is available
    },
    navigateToFriends: () => {
      console.log('🧭 Navigating to friends');
      navigation.navigate('Menu'); // TODO: Update when friends screen is available
    },
    navigateToGroups: () => {
      console.log('🧭 Navigating to groups');
      navigation.navigate('GroupFeeds');
    },
    navigateToGroupDetail: (groupId: string) => {
      console.log('🧭 Navigating to group detail:', groupId);
      navigation.navigate('GroupDetail', { groupId });
    },
    navigateToUserProfile: (userId: string) => {
      console.log('🧭 Navigating to user profile:', userId);
      navigation.navigate('UserProfile', { userId });
    },
  });

  // Set up navigation handler when component mounts
  useEffect(() => {
    console.log('🧭 Setting up notification navigation handler...');
    notificationService.setNavigationHandler(createNavigationHandler());
  }, [navigation]);

  // Auto-register for notifications when user becomes available AND app initialization is complete
  useEffect(() => {
    // Wait for both user availability and app initialization to complete
    // This prevents race condition where registration happens before auth token is restored
    if (user?.id && !expoPushToken && !isInitializing) {
      console.log('🔧 NotificationManager: Auto-registering for user:', user.id);
      console.log('🔧 App initialization complete, proceeding with notification registration...');
      
      // Additional check: Verify API service has auth token
      const hasAuthToken = !!apiService.getAuthToken();
      console.log('🔑 NotificationManager: API service auth token available:', hasAuthToken);
      
      if (!hasAuthToken) {
        console.warn('⚠️ NotificationManager: API service does not have auth token yet, delaying registration...');
        // Retry after a short delay to allow token to be fully set
        const timeoutId = setTimeout(() => {
          const retryHasAuthToken = !!apiService.getAuthToken();
          console.log('🔑 NotificationManager: Retry - API service auth token available:', retryHasAuthToken);
          
          if (retryHasAuthToken) {
            console.log('🔧 NotificationManager: Auth token now available, proceeding with registration...');
            registerForNotifications(user.id);
          } else {
            console.error('❌ NotificationManager: Auth token still not available after delay. Push notifications may not work.');
          }
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      }
      
      // Use setTimeout to prevent race conditions with other registration attempts
      const timeoutId = setTimeout(() => {
        registerForNotifications(user.id);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (user?.id && !expoPushToken && isInitializing) {
      console.log('🔧 NotificationManager: Waiting for app initialization to complete before registering notifications...');
    }
  }, [user?.id, expoPushToken, isInitializing, registerForNotifications]);

  // Clear badge count when app becomes active
  useEffect(() => {
    updateBadgeCount(0);
  }, [updateBadgeCount]);

  // This component doesn't render anything
  return null;
};

export default NotificationManager; 