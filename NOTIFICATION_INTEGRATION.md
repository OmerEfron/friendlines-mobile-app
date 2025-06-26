# Friendlines v2.0 - Backend Notification Integration

## Overview

This document describes the backend notification integration that replaces the previous testing layer. The app now properly integrates with the Friendlines v2.0 backend notification system.

## Architecture

### Components

1. **NotificationService** (`src/services/notificationService.ts`)
   - Handles push token registration
   - Manages notification permissions
   - Integrates with backend API
   - Configures notification channels

2. **NotificationContext** (`src/contexts/NotificationContext.tsx`)
   - Provides notification state management
   - Handles notification listeners
   - Auto-registers tokens when user is available
   - Manages notification navigation

3. **NotificationBanner** (`src/components/NotificationBanner.tsx`)
   - Displays in-app notification banners
   - Animated notification display
   - Auto-dismiss functionality

4. **usePushNotifications Hook** (`src/hooks/usePushNotifications.ts`)
   - Simplified hook for token registration
   - Error handling and user feedback
   - Integration with notification service

## Features

### Backend Integration
- ✅ Automatic token registration with backend
- ✅ Real-time push notifications from server
- ✅ Proper error handling and retry logic
- ✅ User authentication integration

### Notification Types Supported
- **Post Notifications**: New posts from friends/groups
- **Friend Requests**: Incoming friend requests
- **Friend Acceptances**: Friend request acceptances
- **Group Invitations**: Group invitation notifications
- **Group Posts**: New posts in groups

### User Experience
- ✅ In-app notification banners
- ✅ Proper permission handling
- ✅ Background notification support
- ✅ Notification navigation handling
- ✅ Settings integration

## Configuration

### App Configuration (`app.json`)
```json
{
  "notification": {
    "icon": "./assets/icon.png",
    "color": "#ffffff",
    "iosDisplayInForeground": true,
    "androidMode": "default",
    "androidCollapsedTitle": "New Notification"
  },
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["remote-notification"]
    }
  }
}
```

### Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API URL
- `EXPO_PUBLIC_NOTIFICATION_ENABLED`: Enable/disable notifications

## Usage

### In Components
```typescript
import { useNotifications } from '../contexts/NotificationContext';

const MyComponent = () => {
  const { expoPushToken, registerForNotifications } = useNotifications();
  
  // Register for notifications
  const handleRegister = async () => {
    await registerForNotifications(userId);
  };
  
  return (
    // Component JSX
  );
};
```

### In Settings
```typescript
import { usePushNotifications } from '../hooks/usePushNotifications';

const SettingsScreen = () => {
  const { registerForPushNotifications, isRegistering } = usePushNotifications(userId);
  
  return (
    <SettingsItem
      title="Register for Notifications"
      onPress={registerForPushNotifications}
      rightComponent={
        isRegistering ? <LoadingIndicator /> : <SuccessIcon />
      }
    />
  );
};
```

## Backend API Integration

### Token Registration
```typescript
// POST /api/users/{userId}/push-token
{
  "expoPushToken": "ExponentPushToken[...]"
}
```

### Response
```typescript
{
  "userId": "user-id",
  "tokenRegistered": true,
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Manual Testing
1. **Register Token**: Go to Settings → Register for Notifications
2. **Test Local**: Go to Settings → Test Notification
3. **Backend Test**: Use backend API to send real notifications
4. **Navigation Test**: Tap notifications to verify navigation

### Backend Testing
```bash
# Send a test notification via backend
curl -X POST http://localhost:3000/api/users/{userId}/send-friend-request \
  -H "Content-Type: application/json" \
  -d '{"userId": "requester-id"}'
```

## Troubleshooting

### Common Issues

1. **Token Registration Fails**
   - Check backend server is running
   - Verify API URL in app configuration
   - Check network connectivity
   - Verify user authentication

2. **Notifications Not Showing**
   - Check device notification permissions
   - Verify notification channel setup (Android)
   - Check Do Not Disturb mode
   - Ensure app is properly configured

3. **Navigation Not Working**
   - Verify notification data structure
   - Check navigation setup
   - Ensure proper screen names

### Debug Information
- Check console logs for token registration
- Monitor notification listener events
- Verify backend API responses
- Check notification permissions status

## Migration from Testing Layer

### Removed Files
- `src/screens/NotificationTestScreen.tsx`
- `src/utils/notificationTest.ts`
- `scripts/test-notifications.js`
- `NOTIFICATION_TESTING.md`

### Updated Files
- `src/hooks/usePushNotifications.ts` - Simplified to use service
- `src/screens/SettingsScreen.tsx` - Removed testing UI
- `src/navigation/AppNavigator.tsx` - Removed test screen
- `src/types/index.ts` - Removed test navigation type

### New Files
- `src/services/notificationService.ts` - Backend integration service
- `src/contexts/NotificationContext.tsx` - Notification state management
- `src/components/NotificationBanner.tsx` - In-app notification display

## Future Enhancements

1. **Rich Notifications**
   - Image previews in notifications
   - Action buttons
   - Custom notification sounds

2. **Advanced Features**
   - Notification preferences
   - Notification history
   - Notification grouping
   - Analytics tracking

3. **Performance Optimizations**
   - Notification batching
   - Background processing
   - Offline notification queuing

## Support

For issues with the notification system:
1. Check the troubleshooting section above
2. Verify backend API documentation
3. Test with the provided debugging tools
4. Check console logs for detailed error information 