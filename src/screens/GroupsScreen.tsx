import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader, FloatingActionButton } from '../components';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useGroups } from '../hooks/useGroups';
import { usePushNotifications } from '../hooks/usePushNotifications';
import type { User, Group } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

type TabType = 'owned' | 'member' | 'invited';

const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('member');
  const { 
    ownedGroups, 
    memberGroups, 
    invitedGroups, 
    isLoading, 
    error, 
    refetchGroups 
  } = useGroups(user?.id || '');
  const { registerForPushNotifications } = usePushNotifications(user?.id);

  useEffect(() => {
    registerForPushNotifications();
  }, [registerForPushNotifications]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserFeed', { userId: user?.id });
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleGroupPress = (group: Group) => {
    navigation.navigate('GroupDetail', { groupId: group.id });
  };

  const handleRefresh = () => {
    refetchGroups();
  };

  const getActiveGroups = () => {
    switch (activeTab) {
      case 'owned':
        return ownedGroups;
      case 'member':
        return memberGroups;
      case 'invited':
        return invitedGroups;
      default:
        return [];
    }
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupHeader}>
        <Avatar
          source={undefined}
          fallback={item.name}
          size="md"
        />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupDescription}>
            {item.description || `${item.memberCount || item.members.length} members`}
          </Text>
        </View>
        <View style={styles.groupActions}>
          {activeTab === 'invited' && (
            <Badge variant="secondary" size="sm" style={styles.inviteBadge}>
              Invited
            </Badge>
          )}
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NewsHeader 
        title="Group Feeds" 
        subtitle="Newsflashes from your groups"
        showBackButton
        onBackPress={handleBackPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      <View style={styles.tabContainer}>
        {renderTabButton('member', 'Member', 'people')}
        {renderTabButton('owned', 'Owned', 'star')}
        {renderTabButton('invited', 'Invited', 'mail')}
      </View>

      <FlatList
        data={getActiveGroups()}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-circle" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'member' && 'No groups yet'}
              {activeTab === 'owned' && 'No owned groups'}
              {activeTab === 'invited' && 'No group invitations'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'member' && 'Join groups to see their newsflashes'}
              {activeTab === 'owned' && 'Create a group to get started'}
              {activeTab === 'invited' && 'You\'ll see group invitations here'}
            </Text>
            {activeTab === 'owned' && (
              <Button
                title="Create Group"
                onPress={handleCreateGroup}
                style={styles.createButton}
              />
            )}
          </View>
        }
      />

      <FloatingActionButton 
        onPress={handleCreateGroup}
        icon="add"
        size="lg"
      />
    </SafeAreaView>
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
  groupItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  groupName: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  groupDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteBadge: {
    marginRight: theme.spacing.sm,
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
    marginBottom: theme.spacing.lg,
  },
  createButton: {
    marginTop: theme.spacing.md,
  },
});

export default GroupsScreen; 