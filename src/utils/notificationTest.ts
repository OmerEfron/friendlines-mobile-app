import * as Notifications from 'expo-notifications';

export interface TestNotificationData {
  type: 'test' | 'new_post' | 'friend_request' | 'friend_accepted' | 'group_invite' | 'group_post';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export const testNotifications: TestNotificationData[] = [
  {
    type: 'test',
    title: 'Test Notification',
    body: 'This is a test notification from Friendlines! 🎉',
    data: {
      type: 'test',
      timestamp: new Date().toISOString(),
    },
  },
  {
    type: 'new_post',
    title: 'New Newsflash!',
    body: 'John Doe: BREAKING: Just announced big news! Sources confirm...',
    data: {
      type: 'new_post',
      postId: 'test-post-123',
      userId: 'test-user-456',
      userFullName: 'John Doe',
      timestamp: new Date().toISOString(),
    },
  },
  {
    type: 'friend_request',
    title: 'New Friend Request',
    body: 'Jane Smith sent you a friend request',
    data: {
      type: 'friend_request',
      userId: 'test-user-789',
      userFullName: 'Jane Smith',
      timestamp: new Date().toISOString(),
    },
  },
  {
    type: 'friend_accepted',
    title: 'Friend Request Accepted',
    body: 'Jane Smith accepted your friend request',
    data: {
      type: 'friend_accepted',
      userId: 'test-user-789',
      userFullName: 'Jane Smith',
      timestamp: new Date().toISOString(),
    },
  },
  {
    type: 'group_invite',
    title: 'Group Invitation',
    body: 'You\'ve been invited to join "Tech News Group"',
    data: {
      type: 'group_invite',
      groupId: 'test-group-123',
      groupName: 'Tech News Group',
      timestamp: new Date().toISOString(),
    },
  },
  {
    type: 'group_post',
    title: 'New Group Post',
    body: 'Mike Johnson posted in "Tech News Group": New AI breakthrough announced...',
    data: {
      type: 'group_post',
      postId: 'test-post-456',
      userId: 'test-user-101',
      userFullName: 'Mike Johnson',
      groupId: 'test-group-123',
      groupName: 'Tech News Group',
      timestamp: new Date().toISOString(),
    },
  },
];

export const sendTestNotification = async (notificationData: TestNotificationData): Promise<void> => {
  try {
    // Check permissions first
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Notification permissions not granted');
    }

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
      },
      trigger: null, // Send immediately
    });

    console.log('Test notification sent:', notificationData.type);
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

export const sendAllTestNotifications = async (): Promise<void> => {
  for (const notification of testNotifications) {
    try {
      await sendTestNotification(notification);
      // Wait 2 seconds between notifications
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to send ${notification.type} notification:`, error);
    }
  }
};

export const getNotificationTypeName = (type: string): string => {
  const typeNames: Record<string, string> = {
    test: 'Test Notification',
    new_post: 'New Post',
    friend_request: 'Friend Request',
    friend_accepted: 'Friend Accepted',
    group_invite: 'Group Invite',
    group_post: 'Group Post',
  };
  return typeNames[type] || type;
}; 