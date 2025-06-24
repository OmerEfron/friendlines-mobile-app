import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { NewsHeader, NotificationBanner } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  showChevron?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  rightComponent,
  showChevron = true,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View style={styles.settingsItemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    
    <View style={styles.settingsItemRight}>
      {rightComponent}
      {showChevron && onPress && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();
  const { registerForPushNotifications } = usePushNotifications(user?.id);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Privacy settings coming soon!');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notification Settings', 'Notification settings coming soon!');
  };

  const handleDataUsage = () => {
    Alert.alert('Data Usage', 'Data usage settings coming soon!');
  };

  const handleHelpSupport = () => {
    Alert.alert('Help & Support', 'Help and support coming soon!');
  };

  const handleAbout = () => {
    Alert.alert('About Friendlines', 'Friendlines v2.0\nYour personal news feed app');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
          }
        },
      ]
    );
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleToggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    try {
      // First, ensure we have permissions
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notification permissions to test notifications.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Enable', 
              onPress: async () => {
                await registerForPushNotifications();
                // Try the test again after registration
                setTimeout(handleTestNotification, 1000);
              }
            }
          ]
        );
        return;
      }

      // Send a test notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from Friendlines! 🎉',
          data: {
            type: 'test',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: null, // Send immediately
      });

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification. Please try again.');
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleRegisterNotifications = async () => {
    try {
      await registerForPushNotifications();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error registering notifications:', error);
      Alert.alert('Error', 'Failed to register notifications. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {showNotification && (
        <NotificationBanner
          type="success"
          title="Settings updated"
          message="Your preferences have been saved"
          onDismiss={() => setShowNotification(false)}
          autoDismiss={true}
          duration={3000}
        />
      )}
      
      <NewsHeader 
        title="Settings" 
        subtitle="App preferences and account"
        showBackButton
        onBackPress={handleBackPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            title="Edit Profile"
            subtitle="Update your personal information"
            icon="person"
            onPress={handleEditProfile}
          />
          
          <SettingsItem
            title="Privacy Settings"
            subtitle="Control your data and privacy"
            icon="shield-checkmark"
            onPress={handlePrivacySettings}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <SettingsItem
            title="Push Notifications"
            subtitle="Receive updates about new newsflashes"
            icon="notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
                thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.textSecondary}
              />
            }
            showChevron={false}
          />
          
          <SettingsItem
            title="Register for Notifications"
            subtitle="Set up push notification permissions"
            icon="notifications-circle"
            onPress={handleRegisterNotifications}
          />

          <SettingsItem
            title="Test Notification"
            subtitle="Send a test notification to verify setup"
            icon="flash"
            onPress={handleTestNotification}
            rightComponent={
              isTestingNotification ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Testing...</Text>
                </View>
              ) : undefined
            }
          />

          <SettingsItem
            title="Notification Testing"
            subtitle="Comprehensive notification testing tools"
            icon="flask"
            onPress={() => navigation.navigate('NotificationTest' as never)}
          />
          
          <SettingsItem
            title="Notification Settings"
            subtitle="Customize notification preferences"
            icon="settings"
            onPress={handleNotificationSettings}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <SettingsItem
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            icon="moon"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={handleToggleDarkMode}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
                thumbColor={darkModeEnabled ? theme.colors.primary : theme.colors.textSecondary}
              />
            }
            showChevron={false}
          />
        </SettingsSection>

        {/* Data & Storage Section */}
        <SettingsSection title="Data & Storage">
          <SettingsItem
            title="Auto Refresh"
            subtitle="Automatically refresh your feed"
            icon="refresh"
            rightComponent={
              <Switch
                value={autoRefreshEnabled}
                onValueChange={handleToggleAutoRefresh}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
                thumbColor={autoRefreshEnabled ? theme.colors.primary : theme.colors.textSecondary}
              />
            }
            showChevron={false}
          />
          
          <SettingsItem
            title="Data Usage"
            subtitle="Manage your data consumption"
            icon="cellular"
            onPress={handleDataUsage}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            title="Help & Support"
            subtitle="Get help and contact support"
            icon="help-circle"
            onPress={handleHelpSupport}
          />
          
          <SettingsItem
            title="About"
            subtitle="App version and information"
            icon="information-circle"
            onPress={handleAbout}
          />
        </SettingsSection>

        {/* Logout Section */}
        <SettingsSection title="Account Actions">
          <SettingsItem
            title="Logout"
            subtitle="Sign out of your account"
            icon="log-out"
            onPress={handleLogout}
            showChevron={false}
          />
        </SettingsSection>
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
  settingsItem: {
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
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    fontWeight: '500',
  },
  settingsItemSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  loadingText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default SettingsScreen; 