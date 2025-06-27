import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert, Linking } from 'react-native';
import { apiService } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  type: 'friend_request' | 'friend_request_accepted' | 'group_invitation' | 'group_invitation_accepted' | 'group_post' | 'friends_post' | 'friend_post';
  postId?: string;
  userId?: string;
  userFullName?: string;
  groupId?: string;
  groupName?: string;
  inviterId?: string;
  inviterName?: string;
  requesterId?: string;
  requesterName?: string;
  accepterId?: string;
  accepterName?: string;
  targetUserId?: string;
  targetUserName?: string;
  targetFriendId?: string;
  newMemberId?: string;
  newMemberName?: string;
  ownerId?: string;
  groupIds?: string[];
  timestamp: string;
}

export interface NotificationNavigationHandler {
  navigateToPost: (postId: string, userId?: string) => void;
  navigateToFriendRequests: () => void;
  navigateToFriends: () => void;
  navigateToGroups: () => void;
  navigateToGroupDetail: (groupId: string) => void;
  navigateToUserProfile: (userId: string) => void;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private navigationHandler: NotificationNavigationHandler | null = null;
  private registrationInProgress: boolean = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setNavigationHandler(handler: NotificationNavigationHandler) {
    this.navigationHandler = handler;
  }

  async setupAndroidChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    console.log('📱 Setting up Android notification channels...');

    // Default channel
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default notifications',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      description: 'Default notifications for Friendlines',
    });

    // Friend requests
    await Notifications.setNotificationChannelAsync('friend_requests', {
      name: 'Friend Requests',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
      sound: 'default',
      description: 'Friend request notifications',
    });

    // Group invitations
    await Notifications.setNotificationChannelAsync('group_invitations', {
      name: 'Group Invitations',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#059669',
      sound: 'default',
      description: 'Group invitation notifications',
    });

    // Group posts
    await Notifications.setNotificationChannelAsync('group_posts', {
      name: 'Group Posts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#DC2626',
      sound: 'default',
      description: 'New posts in your groups',
    });

    // Friends posts
    await Notifications.setNotificationChannelAsync('friends_posts', {
      name: 'Friends Posts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7C3AED',
      sound: 'default',
      description: 'New posts from your friends',
    });

    // Personal posts (direct friend posts)
    await Notifications.setNotificationChannelAsync('personal_posts', {
      name: 'Personal Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 300, 200, 300],
      lightColor: '#F59E0B',
      sound: 'default',
      description: 'Personal posts sent directly to you',
    });

    console.log('✅ Android notification channels set up successfully');
  }

  async requestNotificationPermissions(): Promise<boolean> {
    try {
      // Show explanation before requesting
      const shouldRequest = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Enable Notifications',
          'Get notified about friend requests, group invitations, and new posts from your friends.',
          [
            { text: 'Not Now', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Enable', onPress: () => resolve(true) }
          ]
        );
      });

      if (!shouldRequest) {
        console.log('📋 User declined notification permission request');
        return false;
      }

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
        },
      });
      
      console.log(`📋 Permission request result: ${status}`);
      return status === 'granted';
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      console.log('🔧 Starting push notification registration...');
      
      // Prevent concurrent registrations
      if (this.registrationInProgress) {
        console.log('🔒 Registration already in progress, skipping...');
        return this.expoPushToken;
      }
      
      this.registrationInProgress = true;
      
      // CRITICAL: Check if running on physical device
      if (!Device.isDevice) {
        console.warn('⚠️ Push notifications require a physical device');
        Alert.alert(
          'Device Required',
          'Push notifications require a physical device. Please test on a real device.',
          [{ text: 'OK' }]
        );
        return null;
      }

      // Set up Android notification channels BEFORE requesting permissions
      await this.setupAndroidChannels();

      // Check current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      console.log(`📋 Current permission status: ${existingStatus}`);
      
      // Request permissions if not granted
      if (existingStatus !== 'granted') {
        console.log('🔐 Requesting notification permissions...');
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowDisplayInCarPlay: true,
            allowCriticalAlerts: false,
            provideAppNotificationSettings: true,
            allowProvisional: false,
          },
        });
        finalStatus = status;
      }
      
      // Handle permission denial
      if (finalStatus !== 'granted') {
        console.error('❌ Notification permission not granted');
        this.showPermissionDeniedAlert();
        return null;
      }
      
      try {
        // Get project ID - REQUIRED for Expo push tokens
        const projectId = 
          Constants?.expoConfig?.extra?.eas?.projectId ?? 
          Constants?.easConfig?.projectId ??
          process.env.EXPO_PROJECT_ID;
          
        if (!projectId) {
          throw new Error('Project ID not found. Please configure expo.extra.eas.projectId in app.json');
        }
        
        console.log(`🏗️ Using project ID: ${projectId}`);
        
        // Get Expo push token with validation
        const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({ projectId });
        
        // Validate token format before proceeding
        if (!pushTokenString || !NotificationService.isValidExpoPushToken(pushTokenString)) {
          console.warn('⚠️ Invalid token format received, retrying...');
          
          // Wait a bit and try again
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: retryToken } = await Notifications.getExpoPushTokenAsync({ projectId });
          
          if (!retryToken || !NotificationService.isValidExpoPushToken(retryToken)) {
            throw new Error('Failed to obtain valid Expo push token after retry');
          }
          
          console.log('✅ Successfully obtained valid Expo push token on retry:', retryToken.substring(0, 30) + '...');
          this.expoPushToken = retryToken;
          return retryToken;
        }
        
        console.log('✅ Successfully obtained Expo push token:', pushTokenString.substring(0, 30) + '...');
        this.expoPushToken = pushTokenString;
        return pushTokenString;
        
      } catch (error: any) {
        console.error('❌ Failed to get push token:', error);
        
        // Handle specific error cases
        if (error.message.includes('Project ID')) {
          console.error('❌ Please ensure your project ID is configured in app.json');
          Alert.alert(
            'Configuration Error',
            'Project ID not found. Please check your app configuration.',
            [{ text: 'OK' }]
          );
        } else if (error.message.includes('development')) {
          console.error('❌ Development builds require proper credential configuration');
          Alert.alert(
            'Development Build Error',
            'Development builds require proper credential configuration. Please check your EAS setup.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Token Error',
            'Failed to get push notification token. Please try again.',
            [{ text: 'OK' }]
          );
        }
        
        return null;
      }
    } catch (error) {
      console.error('💥 Error during push notification registration:', error);
      Alert.alert(
        'Registration Error',
        'Failed to set up push notifications. Please try again.',
        [{ text: 'OK' }]
      );
      return null;
    } finally {
      this.registrationInProgress = false;
    }
  }

  private showPermissionDeniedAlert(): void {
    Alert.alert(
      'Notifications Disabled',
      'Please enable notifications in Settings to receive updates about friend requests, group invitations, and new posts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Settings', 
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        }
      ]
    );
  }

  async registerTokenWithBackend(userId: string, token: string): Promise<boolean> {
    // Validate token format before sending to backend
    if (!token || !NotificationService.isValidExpoPushToken(token)) {
      console.error('❌ Invalid token format, cannot register with backend:', token);
      return false;
    }

    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        console.log(`🔗 Registering token with backend for user: ${userId} (attempt ${attempt + 1}/${maxRetries})`);
        const result = await apiService.registerPushToken(userId, token);
        console.log(`✅ Token registration result:`, result);
        return result.tokenRegistered;
      } catch (error) {
        attempt++;
        console.warn(`⚠️ Registration attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          // Wait with exponential backoff before retrying
          const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('❌ Failed to register push token with backend after all retries:', error);
          return false;
        }
      }
    }
    
    return false;
  }

  handleForegroundNotification(notification: Notifications.Notification): void {
    const data = notification.request.content.data as unknown as NotificationData;
    const { title, body } = notification.request.content;
    
    console.log('📨 Foreground notification received:', data.type);
    
    // Show custom in-app notification or use the system one
    switch (data.type) {
      case 'friend_request':
        this.showFriendRequestAlert(data, title || undefined, body || undefined);
        break;
      case 'group_invitation':
        this.showGroupInvitationAlert(data, title || undefined, body || undefined);
        break;
      case 'group_post':
      case 'friends_post':
      case 'friend_post':
        this.showPostNotification(data, title || undefined, body || undefined);
        break;
      default:
        // Show default notification
        Alert.alert(title || 'New Notification', body || '');
    }
  }

  private showFriendRequestAlert(data: NotificationData, title?: string, body?: string): void {
    Alert.alert(
      title || 'Friend Request',
      body || `${data.requesterName || 'Someone'} sent you a friend request`,
      [
        { text: 'Later', style: 'cancel' },
        { 
          text: 'View', 
          onPress: () => this.navigationHandler?.navigateToFriendRequests() 
        }
      ]
    );
  }

  private showGroupInvitationAlert(data: NotificationData, title?: string, body?: string): void {
    Alert.alert(
      title || 'Group Invitation',
      body || `${data.inviterName || 'Someone'} invited you to join ${data.groupName || 'a group'}`,
      [
        { text: 'Later', style: 'cancel' },
        { 
          text: 'View', 
          onPress: () => this.navigationHandler?.navigateToGroups() 
        }
      ]
    );
  }

  private showPostNotification(data: NotificationData, title?: string, body?: string): void {
    Alert.alert(
      title || 'New Post',
      body || `${data.userFullName || 'Someone'} shared a new post`,
      [
        { text: 'Later', style: 'cancel' },
        { 
          text: 'View', 
          onPress: () => {
            if (data.postId && data.userId) {
              this.navigationHandler?.navigateToPost(data.postId, data.userId);
            }
          }
        }
      ]
    );
  }

  handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as unknown as NotificationData;
    
    console.log('👆 Notification response received:', data.type);
    
    // Navigate based on notification type
    switch (data.type) {
      case 'friend_request':
        this.navigationHandler?.navigateToFriendRequests();
        break;
        
      case 'friend_request_accepted':
        this.navigationHandler?.navigateToFriends();
        break;
        
      case 'group_invitation':
        this.navigationHandler?.navigateToGroups();
        break;
        
      case 'group_invitation_accepted':
        if (data.groupId) {
          this.navigationHandler?.navigateToGroupDetail(data.groupId);
        }
        break;
        
      case 'group_post':
      case 'friends_post':
      case 'friend_post':
        if (data.postId && data.userId) {
          this.navigationHandler?.navigateToPost(data.postId, data.userId);
        }
        break;
        
      default:
        console.log('🏠 Unknown notification type, navigating to home');
    }
  }

  async setupNotificationListeners(): Promise<() => void> {
    console.log('🎧 Setting up notification listeners...');
    
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📨 Notification received:', notification);
      this.handleForegroundNotification(notification);
    });
    
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification response received:', response);
      this.handleNotificationResponse(response);
    });

    // Listen for token updates
    const tokenListener = Notifications.addPushTokenListener((token) => {
      console.log('🔄 Push token updated:', token.data);
      this.expoPushToken = token.data;
      // Token updates should be handled by the context
    });

    console.log('✅ Notification listeners set up successfully');

    return () => {
      console.log('🧹 Cleaning up notification listeners...');
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      Notifications.removeNotificationSubscription(tokenListener);
    };
  }

  async updateBadgeCount(count?: number): Promise<void> {
    try {
      if (count !== undefined) {
        await Notifications.setBadgeCountAsync(count);
      } else {
        // Clear badge when app opens
        await Notifications.setBadgeCountAsync(0);
      }
    } catch (error) {
      console.error('❌ Error updating badge count:', error);
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  isRegistrationInProgress(): boolean {
    return this.registrationInProgress;
  }

  // Test method for local notifications
  async sendTestNotification(): Promise<void> {
    try {
      console.log('🧪 Sending test notification...');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification 🎉',
          body: 'This is a test notification from Friendlines! Everything is working correctly.',
          data: {
            type: 'test',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: null, // Send immediately
      });
      console.log('✅ Test notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }

  // Validation helper
  static isValidExpoPushToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      console.warn('❌ Invalid token: null/undefined or not a string:', { 
        token: token ? String(token).substring(0, 30) + '...' : 'null/undefined',
        type: typeof token
      });
      return false;
    }

    const isValid = token.startsWith('ExponentPushToken[') && token.endsWith(']');
    if (!isValid) {
      console.warn('❌ Invalid token format:', { 
        token: token.substring(0, 30) + '...',
        hasPrefix: token.startsWith('ExponentPushToken['),
        hasSuffix: token.endsWith(']')
      });
    }
    return isValid;
  }
}

export default NotificationService.getInstance(); 