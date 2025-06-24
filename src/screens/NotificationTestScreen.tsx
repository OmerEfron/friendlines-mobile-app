import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { NewsHeader, NotificationBanner } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { 
  testNotifications, 
  sendTestNotification, 
  sendAllTestNotifications, 
  getNotificationTypeName,
  TestNotificationData 
} from '../utils/notificationTest';

interface TestButtonProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const TestButton: React.FC<TestButtonProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  disabled = false,
  loading = false,
}) => (
  <TouchableOpacity
    style={[styles.testButton, disabled && styles.testButtonDisabled]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled || loading}
  >
    <View style={styles.testButtonLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.testButtonContent}>
        <Text style={styles.testButtonTitle}>{title}</Text>
        <Text style={styles.testButtonSubtitle}>{subtitle}</Text>
      </View>
    </View>
    
    <View style={styles.testButtonRight}>
      {loading ? (
        <Text style={styles.loadingText}>Testing...</Text>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </View>
  </TouchableOpacity>
);

const NotificationTestScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAppContext();
  const { registerForPushNotifications } = usePushNotifications(user?.id);
  
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const showSuccessMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleRegisterNotifications = async () => {
    setIsLoading(true);
    try {
      await registerForPushNotifications();
      showSuccessMessage('Notifications registered successfully!');
    } catch (error) {
      console.error('Error registering notifications:', error);
      Alert.alert('Error', 'Failed to register notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSingleNotification = async (notificationData: TestNotificationData) => {
    setActiveTest(notificationData.type);
    try {
      await sendTestNotification(notificationData);
      showSuccessMessage(`${getNotificationTypeName(notificationData.type)} sent successfully!`);
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification. Please check permissions.');
    } finally {
      setActiveTest(null);
    }
  };

  const handleTestAllNotifications = async () => {
    setActiveTest('all');
    try {
      await sendAllTestNotifications();
      showSuccessMessage('All test notifications sent successfully!');
    } catch (error) {
      console.error('Error sending all test notifications:', error);
      Alert.alert('Error', 'Failed to send some test notifications. Please check permissions.');
    } finally {
      setActiveTest(null);
    }
  };

  const handleCheckPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const statusText = status === 'granted' ? 'Granted' : status === 'denied' ? 'Denied' : 'Undetermined';
      Alert.alert('Notification Permissions', `Current status: ${statusText}`);
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert('Error', 'Failed to check notification permissions.');
    }
  };

  const handleClearNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      showSuccessMessage('All notifications cleared!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      Alert.alert('Error', 'Failed to clear notifications.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {showNotification && (
        <NotificationBanner
          type="success"
          title="Success"
          message={notificationMessage}
          onDismiss={() => setShowNotification(false)}
          autoDismiss={true}
          duration={3000}
        />
      )}
      
      <NewsHeader 
        title="Notification Testing" 
        subtitle="Test push notifications during development"
        showBackButton
        onBackPress={handleBackPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Setup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setup & Permissions</Text>
          
          <TestButton
            title="Register for Notifications"
            subtitle="Set up push notification permissions"
            icon="notifications-circle"
            onPress={handleRegisterNotifications}
            loading={isLoading}
          />

          <TestButton
            title="Check Permissions"
            subtitle="View current notification permission status"
            icon="shield-checkmark"
            onPress={handleCheckPermissions}
          />

          <TestButton
            title="Clear All Notifications"
            subtitle="Dismiss all pending notifications"
            icon="trash"
            onPress={handleClearNotifications}
          />
        </View>

        {/* Individual Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Individual Notifications</Text>
          
          {testNotifications.map((notification) => (
            <TestButton
              key={notification.type}
              title={getNotificationTypeName(notification.type)}
              subtitle={notification.body}
              icon="flash"
              onPress={() => handleTestSingleNotification(notification)}
              loading={activeTest === notification.type}
            />
          ))}
        </View>

        {/* Batch Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Batch Testing</Text>
          
          <TestButton
            title="Test All Notifications"
            subtitle="Send all notification types with 2-second delays"
            icon="layers"
            onPress={handleTestAllNotifications}
            loading={activeTest === 'all'}
          />
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testing Information</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              • Test notifications are sent locally and don't require a backend connection{'\n'}
              • Each notification type includes realistic data for testing{'\n'}
              • Notifications will trigger the same handlers as real push notifications{'\n'}
              • Use this screen to verify notification permissions and UI behavior{'\n'}
              • Check the console for detailed logging of notification events
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  testButtonDisabled: {
    opacity: 0.5,
  },
  testButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  testButtonContent: {
    flex: 1,
  },
  testButtonTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    fontWeight: '500',
  },
  testButtonSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  testButtonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default NotificationTestScreen; 