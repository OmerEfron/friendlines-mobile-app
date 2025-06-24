#!/usr/bin/env node

/**
 * Test Push Notifications Script
 * 
 * This script helps test push notifications during development.
 * It can send test notifications to a specific Expo push token.
 * 
 * Usage:
 *   node scripts/test-notifications.js <expo-push-token>
 *   node scripts/test-notifications.js --help
 */

const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

// Test notification data
const testNotifications = [
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

function showHelp() {
  console.log(`
Test Push Notifications Script

Usage:
  node scripts/test-notifications.js <expo-push-token>
  node scripts/test-notifications.js --help
  node scripts/test-notifications.js --list-types

Examples:
  node scripts/test-notifications.js ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
  node scripts/test-notifications.js --list-types

Options:
  --help        Show this help message
  --list-types  List all available notification types
  --all         Send all test notifications with delays
  --type <type> Send a specific notification type (test, new_post, friend_request, etc.)

Notification Types:
  test          - Basic test notification
  new_post      - New newsflash notification
  friend_request - Friend request notification
  friend_accepted - Friend request accepted notification
  group_invite  - Group invitation notification
  group_post    - Group post notification
`);
}

function listTypes() {
  console.log('\nAvailable notification types:\n');
  testNotifications.forEach((notification, index) => {
    console.log(`${index + 1}. ${notification.type}`);
    console.log(`   Title: ${notification.title}`);
    console.log(`   Body: ${notification.body}`);
    console.log('');
  });
}

function validateToken(token) {
  if (!Expo.isExpoPushToken(token)) {
    console.error('Error: Invalid Expo push token format');
    console.log('Token should start with "ExponentPushToken[" and end with "]"');
    process.exit(1);
  }
  return true;
}

async function sendNotification(token, notificationData) {
  const message = {
    to: token,
    sound: 'default',
    title: notificationData.title,
    body: notificationData.body,
    data: notificationData.data,
  };

  try {
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

async function sendAllNotifications(token) {
  console.log('Sending all test notifications...\n');
  
  for (let i = 0; i < testNotifications.length; i++) {
    const notification = testNotifications[i];
    console.log(`Sending ${notification.type} notification...`);
    
    try {
      await sendNotification(token, notification);
      console.log(`✅ ${notification.type} sent successfully`);
    } catch (error) {
      console.log(`❌ Failed to send ${notification.type}:`, error.message);
    }
    
    // Wait 2 seconds between notifications
    if (i < testNotifications.length - 1) {
      console.log('Waiting 2 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n🎉 All notifications sent!');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    showHelp();
    return;
  }
  
  if (args.includes('--list-types')) {
    listTypes();
    return;
  }
  
  const token = args[0];
  
  if (!token) {
    console.error('Error: No push token provided');
    showHelp();
    process.exit(1);
  }
  
  validateToken(token);
  
  if (args.includes('--all')) {
    await sendAllNotifications(token);
    return;
  }
  
  const typeIndex = args.indexOf('--type');
  if (typeIndex !== -1 && typeIndex + 1 < args.length) {
    const requestedType = args[typeIndex + 1];
    const notification = testNotifications.find(n => n.type === requestedType);
    
    if (!notification) {
      console.error(`Error: Unknown notification type "${requestedType}"`);
      listTypes();
      process.exit(1);
    }
    
    console.log(`Sending ${requestedType} notification...`);
    try {
      await sendNotification(token, notification);
      console.log(`✅ ${requestedType} sent successfully`);
    } catch (error) {
      console.log(`❌ Failed to send ${requestedType}:`, error.message);
    }
    return;
  }
  
  // Default: send test notification
  console.log('Sending test notification...');
  try {
    await sendNotification(token, testNotifications[0]);
    console.log('✅ Test notification sent successfully');
  } catch (error) {
    console.log('❌ Failed to send test notification:', error.message);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testNotifications,
  sendNotification,
  sendAllNotifications,
}; 