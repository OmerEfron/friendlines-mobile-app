# Notification Testing Guide

This guide explains how to test push notifications in your Friendlines development build.

## Overview

Your app has a comprehensive notification system with:
- ✅ Push notification setup with `expo-notifications`
- ✅ Token registration with backend
- ✅ Notification handlers for different types
- ✅ Permission handling
- ✅ Android notification channel configuration
- ✅ Test notification utilities

## Testing Methods

### 1. In-App Testing (Recommended)

#### Access the Notification Test Screen
1. Open your app
2. Go to **Settings** (from the menu)
3. Scroll to the **Notifications** section
4. Tap **"Notification Testing"**

#### Available Test Features
- **Register for Notifications**: Set up permissions
- **Check Permissions**: View current permission status
- **Clear All Notifications**: Dismiss pending notifications
- **Test Individual Notifications**: Send specific notification types
- **Test All Notifications**: Send all types with delays

#### Notification Types Available for Testing
1. **Test Notification** - Basic test
2. **New Post** - New newsflash notification
3. **Friend Request** - Friend request received
4. **Friend Accepted** - Friend request accepted
5. **Group Invite** - Group invitation
6. **Group Post** - New post in group

### 2. Quick Test from Settings

You can also test notifications directly from the Settings screen:
1. Go to **Settings** → **Notifications**
2. Tap **"Test Notification"** for a quick test
3. Tap **"Register for Notifications"** to set up permissions

### 3. Command Line Testing

Use the provided script to test notifications from the command line:

```bash
# Get help
node scripts/test-notifications.js --help

# List all notification types
node scripts/test-notifications.js --list-types

# Send a test notification
node scripts/test-notifications.js <your-expo-push-token>

# Send all notification types
node scripts/test-notifications.js <your-expo-push-token> --all

# Send a specific notification type
node scripts/test-notifications.js <your-expo-push-token> --type new_post
```

#### Getting Your Expo Push Token
1. Open the app
2. Go to **Settings** → **Notifications**
3. Tap **"Register for Notifications"**
4. Check the console logs for your push token
5. Copy the token (starts with `ExponentPushToken[`)

## Testing Scenarios

### Basic Functionality
1. **Permission Request**: Test that permission dialog appears
2. **Token Registration**: Verify token is sent to backend
3. **Local Notifications**: Test immediate notification display
4. **Notification Tapping**: Test navigation when tapping notifications

### Different App States
1. **Foreground**: App is open and active
2. **Background**: App is minimized but running
3. **Killed**: App is completely closed

### Platform-Specific Testing
- **iOS**: Test on physical device (notifications don't work in simulator)
- **Android**: Test on physical device or emulator

## Troubleshooting

### Common Issues

#### "Permission Denied" Error
- **Solution**: Go to device Settings → Apps → Friendlines → Permissions → Notifications
- **Enable**: Allow notifications

#### "Failed to send test notification"
- **Check**: Ensure you're on a physical device (not simulator)
- **Check**: Verify notification permissions are granted
- **Check**: Ensure app is properly configured in app.json

#### Notifications not appearing
- **Check**: Device notification settings
- **Check**: App notification settings
- **Check**: Do Not Disturb mode is off
- **Check**: Console logs for errors

#### Token registration fails
- **Check**: Backend server is running
- **Check**: Network connectivity
- **Check**: API endpoint configuration

### Debug Information

#### Console Logs to Watch For
```
Push token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
Notification received: {...}
Notification response: {...}
Error setting up push notifications: ...
```

#### Testing Checklist
- [ ] Permission granted
- [ ] Token generated and logged
- [ ] Token registered with backend
- [ ] Local notifications work
- [ ] Notification handlers trigger
- [ ] Navigation works on tap
- [ ] Different notification types work
- [ ] Background notifications work

## Advanced Testing

### Testing with Real Backend
1. Ensure your backend server is running
2. Create a test user account
3. Register the push token via the app
4. Use the backend API to send real notifications
5. Test the complete flow from post creation to notification

### Testing Different Notification Types
Each notification type includes realistic data:
- **Post IDs**: `test-post-123`, `test-post-456`
- **User IDs**: `test-user-456`, `test-user-789`, `test-user-101`
- **Group IDs**: `test-group-123`
- **Timestamps**: Current ISO timestamp

### Performance Testing
- Test multiple notifications in sequence
- Test notification handling under load
- Monitor memory usage during notification processing
- Test notification clearing and management

## Development Notes

### Files Modified/Added
- `src/screens/SettingsScreen.tsx` - Added test notification buttons
- `src/screens/NotificationTestScreen.tsx` - New comprehensive test screen
- `src/utils/notificationTest.ts` - Test notification utilities
- `src/navigation/AppNavigator.tsx` - Added NotificationTest screen
- `src/types/index.ts` - Added NotificationTest to navigation types
- `scripts/test-notifications.js` - Command line testing script

### Key Features
- **Local Testing**: No backend required for basic testing
- **Realistic Data**: Test notifications include proper data structure
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during testing
- **Permission Management**: Automatic permission checking and requesting

### Future Enhancements
- Rich notifications with images
- Custom notification sounds
- Notification grouping
- Notification preferences
- Analytics tracking

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all dependencies are installed
3. Ensure you're testing on a physical device
4. Check that your development build is properly configured
5. Review the troubleshooting section above 