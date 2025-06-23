import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader, NewsflashCard, FloatingActionButton } from '../components';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useFriends } from '../hooks/useFriends';
import { useGroups } from '../hooks/useGroups';
import type { Newsflash } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface UserFeedScreenProps {
  route?: {
    params?: {
      userId?: string;
    };
  };
}

type TabType = 'newsflashes' | 'profile' | 'stats';

const UserFeedScreen: React.FC<UserFeedScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('newsflashes');
  
  const { newsflashes = [], isLoading: newsflashesLoading, error: newsflashesError, refetch: refetchNewsflashes } = useNewsflashes(user!);
  const { friends = [], isLoading: friendsLoading, error: friendsError, refetchFriends } = useFriends(user?.id || '');
  const { 
    ownedGroups = [], 
    memberGroups = [], 
    invitedGroups = [], 
    isLoading: groupsLoading, 
    error: groupsError, 
    refetchGroups 
  } = useGroups(user?.id || '');

  // Filter newsflashes to show only user's own posts
  const userNewsflashes = (newsflashes || []).filter(newsflash => 
    newsflash.userId === user?.id || 
    newsflash.author?.id === user?.id ||
    newsflash.userFullName === user?.fullName
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleProfilePress = () => {
    // Already on profile, could open settings
    navigation.navigate('Settings');
  };

  const handleCreateNewsflash = () => {
    navigation.navigate('CreateNewsflash');
  };

  const handleRefresh = () => {
    refetchNewsflashes();
    refetchFriends();
    refetchGroups();
  };

  const handleNewsflashPress = (newsflash: Newsflash) => {
    navigation.navigate('NewsflashDetail', { newsflashId: newsflash.id });
  };

  const handleEditProfile = () => {
    navigation.navigate('Settings');
  };

  const renderTabButton = (tab: TabType, label: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon as any} 
        size={20} 
        color={activeTab === tab ? theme.colors.primary : theme.colors.textSecondary} 
      />
      <Text style={[
        styles.tabLabel,
        activeTab === tab && styles.activeTabLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <Avatar
          source={undefined}
          fallback={user?.fullName}
          size="xl"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.fullName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileMemberSince}>
            Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Ionicons name="create" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userNewsflashes.length}</Text>
          <Text style={styles.statLabel}>Newsflashes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{friends.length}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{(memberGroups || []).length + (ownedGroups || []).length}</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.followersCount || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'newsflashes':
        return (
          <FlatList
            data={userNewsflashes}
            renderItem={({ item }) => (
              <NewsflashCard 
                newsflash={item} 
                onPress={() => handleNewsflashPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={newsflashesLoading}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="newspaper" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Newsflashes Yet</Text>
                <Text style={styles.emptySubtext}>
                  Create your first newsflash to get started!
                </Text>
              </View>
            }
          />
        );
      case 'profile':
        return (
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderProfileSection()}
            {renderStatsSection()}
          </ScrollView>
        );
      case 'stats':
        return (
          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderStatsSection()}
            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityItem}>
                <Ionicons name="newspaper" size={20} color={theme.colors.primary} />
                <Text style={styles.activityText}>
                  Created {userNewsflashes.length} newsflashes
                </Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="people" size={20} color={theme.colors.success} />
                <Text style={styles.activityText}>
                  Connected with {(friends || []).length} friends
                </Text>
              </View>
              <View style={styles.activityItem}>
                <Ionicons name="people-circle" size={20} color={theme.colors.newsAccent} />
                <Text style={styles.activityText}>
                  Joined {(memberGroups || []).length + (ownedGroups || []).length} groups
                </Text>
              </View>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <NewsHeader 
        title="User Feed" 
        subtitle={activeTab === 'newsflashes' ? 'Your personal newsflashes' : 'Your profile and stats'}
        showBackButton
        onBackPress={handleBackPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      <View style={styles.tabContainer}>
        {renderTabButton('newsflashes', 'Newsflashes', 'newspaper')}
        {renderTabButton('profile', 'Profile', 'person')}
        {renderTabButton('stats', 'Stats', 'stats-chart')}
      </View>

      {renderContent()}

      {activeTab === 'newsflashes' && (
        <FloatingActionButton 
          onPress={handleCreateNewsflash}
          icon="add"
          size="lg"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary + '10',
  },
  tabLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for floating action button
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: theme.spacing.md,
  },
  profileSection: {
    marginBottom: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  profileName: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  profileMemberSince: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  editButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
  },
  statsSection: {
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.md,
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activityText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default UserFeedScreen; 