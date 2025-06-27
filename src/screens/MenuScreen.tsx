import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { useFriends } from '../hooks/useFriends';
import { apiService } from '../services/api';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  color = theme.colors.primary 
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

const MenuScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const { friends, isLoading: friendsLoading } = useFriends(user?.id || '');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMainFeed = () => {
    navigation.navigate('MainFeed');
  };

  const handleGroupFeeds = () => {
    navigation.navigate('GroupFeeds');
  };

  const handleUserFeed = () => {
    navigation.navigate('UserFeed', { userId: user?.id });
  };

  const handleCreateNewsflash = () => {
    navigation.navigate('CreateNewsflash');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleTestNotification = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    if (friendsLoading) {
      Alert.alert('Loading', 'Please wait while loading friends...');
      return;
    }

    if (friends.length === 0) {
      Alert.alert('No Friends', 'You need at least one friend to test notifications. Add some friends first!');
      return;
    }

    // Pick a random friend
    const randomFriend = friends[Math.floor(Math.random() * friends.length)];
    
    try {
      Alert.alert(
        'Test Notification',
        `Creating a test post from ${randomFriend.fullName} to trigger a notification...`,
        [{ text: 'OK' }]
      );

      // Create a test newsflash from the friend
      const testNewsflash = await apiService.createPost({
        originalText: `Hey ${user.fullName}! This is a test notification from ${randomFriend.fullName}. Just checking if the notification system is working properly! 🎉`,
        rawText: `Hey ${user.fullName}! This is a test notification from ${randomFriend.fullName}. Just checking if the notification system is working properly! 🎉`,
        recipients: [user.id], // Send to current user
        groups: [], // No groups for this test
        userId: randomFriend.id,
        tone: 'friendly',
        length: 'short'
      });

      Alert.alert(
        'Success!',
        `Test post created from ${randomFriend.fullName}. You should receive a notification shortly if the system is working correctly.`,
        [{ text: 'OK' }]
      );

      console.log('✅ Test notification post created:', testNewsflash);
    } catch (error) {
      console.error('❌ Failed to create test notification:', error);
      Alert.alert(
        'Error',
        `Failed to create test notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NewsHeader 
        title="Menu" 
        subtitle="Navigation"
        showBackButton
        onBackPress={handleBackPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feeds</Text>
          
          <MenuItem
            title="Main Feed"
            subtitle="All newsflashes from friends and groups"
            icon="newspaper"
            onPress={handleMainFeed}
            color={theme.colors.primary}
          />
          
          <MenuItem
            title="Group Feeds"
            subtitle="Newsflashes from specific groups"
            icon="people-circle"
            onPress={handleGroupFeeds}
            color={theme.colors.newsAccent}
          />
          
          <MenuItem
            title="User Feed"
            subtitle="Your personal newsflashes and profile"
            icon="person"
            onPress={handleUserFeed}
            color={theme.colors.success}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <MenuItem
            title="Create Newsflash"
            subtitle="Share a new story with friends"
            icon="add-circle"
            onPress={handleCreateNewsflash}
            color={theme.colors.warning}
          />

          <MenuItem
            title="Test Notification"
            subtitle="Create a test post from a friend to test notifications"
            icon="notifications"
            onPress={handleTestNotification}
            color={theme.colors.error}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <MenuItem
            title="Settings"
            subtitle="App preferences and account settings"
            icon="settings"
            onPress={handleSettings}
            color={theme.colors.secondary}
          />
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
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});

export default MenuScreen; 