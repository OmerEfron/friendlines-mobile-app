# Push Notification Registration Error Fix

## Issue Summary
The app was experiencing multiple concurrent push notification registration attempts, causing "Invalid Expo push token format" errors in the logs. While the final registration succeeded, the error was caused by race conditions between different registration triggers.

## Root Cause Analysis
The error occurred due to multiple simultaneous registration attempts:

1. **NotificationManager** auto-registers when user becomes available
2. **NotificationContext** token update listener auto-registers when token changes  
3. **Settings screen** allows manual registration
4. **Race condition**: Token generation is asynchronous, causing the first attempt to send an incomplete token

## Fixes Implemented

### 1. **Added Registration Lock** (`src/services/notificationService.ts`)
```typescript
private registrationInProgress: boolean = false;

async registerForPushNotifications(): Promise<string | null> {
  // Prevent concurrent registrations
  if (this.registrationInProgress) {
    console.log('🔒 Registration already in progress, skipping...');
    return this.expoPushToken;
  }
  
  this.registrationInProgress = true;
  try {
    // ... registration logic
  } finally {
    this.registrationInProgress = false; // Always reset flag
  }
}
```

### 2. **Enhanced Token Validation**
```typescript
// Get Expo push token with validation
const { data: pushTokenString } = await Notifications.getExpoPushTokenAsync({ projectId });

// Validate token format before proceeding
if (!pushTokenString || !NotificationService.isValidExpoPushToken(pushTokenString)) {
  console.warn('⚠️ Invalid token format received, retrying...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Retry token generation once
}
```

### 3. **Retry Logic with Exponential Backoff**
```typescript
async registerTokenWithBackend(userId: string, token: string): Promise<boolean> {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      // Registration attempt
    } catch (error) {
      const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 4. **Fixed Token Update Listener** (`src/contexts/NotificationContext.tsx`)
```typescript
// Only re-register with backend if this is a genuine token update
// (not part of initial registration process)
if (user?.id && expoPushToken && expoPushToken !== token.data) {
  console.log('🔄 Token changed, re-registering with backend...');
  notificationService.registerTokenWithBackend(user.id, token.data);
}
```

### 5. **Prevented Race Conditions** (`src/components/NotificationManager.tsx`)
```typescript
// Use setTimeout to prevent race conditions with other registration attempts
const timeoutId = setTimeout(() => {
  registerForNotifications(user.id);
}, 100);
```

### 6. **Improved Error Logging**
- Added detailed token validation logging
- Better error messages for debugging
- Registration attempt tracking

## Expected Results

### Before Fix:
```
❌ API Error Response: "Invalid Expo push token format"
💥 API Request Failed: [ApiError: HTTP error! status: 400]
❌ Failed to register push token with backend
✅ Successfully obtained Expo push token: ExponentPushToken[...]
✅ API Success Response: Token registered successfully
```

### After Fix:
```
🔧 Starting push notification registration...
✅ Successfully obtained Expo push token: ExponentPushToken[...]
🔗 Registering token with backend for user: utest123456789 (attempt 1/3)
✅ Token registration result: {"tokenRegistered": true}
```

## Testing Steps

1. **Install updated app** on physical device
2. **Clear app data** to reset notification state
3. **Login** and observe logs during automatic registration
4. **Check Settings screen** - should show "Registered" status
5. **Test notification** using "Test Notification" button
6. **Monitor logs** - should see no error messages

## Impact Assessment

- ✅ **Notifications work correctly** - Final registration always succeeded
- ✅ **No functional impact** - This was a cosmetic error only  
- ✅ **Improved reliability** - Prevents multiple concurrent registrations
- ✅ **Better error handling** - Retry logic handles temporary failures
- ✅ **Cleaner logs** - Eliminates confusing error messages

## Technical Notes

- **Physical device required** - Push notifications don't work on simulators
- **Project ID required** - Must be configured in `app.json`
- **EAS development build recommended** - For proper credential handling
- **Token format**: `ExponentPushToken[...]` - 22-character base64 string inside brackets

The fixes ensure robust, error-free push notification registration while maintaining backward compatibility and improving the overall user experience. 