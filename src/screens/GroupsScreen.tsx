import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useGroups } from '../hooks/useGroups';
import type { Group } from '../types';

type TabType = 'owned' | 'member' | 'invited';

const GroupsScreen: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('owned');
  const [refreshing, setRefreshing] = useState(false);

  const {
    ownedGroups,
    memberGroups,
    invitedGroups,
    isLoading,
    error,
    createGroup,
    acceptGroupInvitation,
    leaveGroup,
    refetchGroups,
  } = useGroups(user?.id || '');

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      refetchGroups();
    } catch (error) {
      console.error('Error refreshing groups:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateGroup = () => {
    Alert.prompt(
      'Create Group',
      'Enter group name:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (groupName) => {
            if (groupName && groupName.trim()) {
              try {
                await createGroup({ name: groupName.trim() });
              } catch (error) {
                console.error('Error creating group:', error);
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleAcceptInvitation = async (groupId: string) => {
    try {
      await acceptGroupInvitation(groupId);
    } catch (error) {
      console.error('Error accepting group invitation:', error);
    }
  };

  const handleLeaveGroup = (group: Group) => {
    Alert.alert(
      'Leave Group',
      `Are you sure you want to leave "${group.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveGroup(group.id);
            } catch (error) {
              console.error('Error leaving group:', error);
            }
          },
        },
      ]
    );
  };

  const renderOwnedGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupItem}>
      <View style={styles.groupInfo}>
        <View style={styles.groupIcon}>
          <Ionicons name="people" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.groupName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.groupDescription}>{item.description}</Text>
          )}
          <Text style={styles.memberCount}>
            {item.memberCount || item.members.length} members
          </Text>
        </View>
      </View>
      <View style={styles.ownerBadge}>
        <Badge variant="secondary" size="sm">
          Owner
        </Badge>
      </View>
    </View>
  );

  const renderMemberGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupItem}>
      <View style={styles.groupInfo}>
        <View style={styles.groupIcon}>
          <Ionicons name="people" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.groupName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.groupDescription}>{item.description}</Text>
          )}
          <Text style={styles.memberCount}>
            {item.memberCount || item.members.length} members
          </Text>
        </View>
      </View>
      <Button
        title="Leave"
        onPress={() => handleLeaveGroup(item)}
        variant="secondary"
        style={styles.actionButton}
      />
    </View>
  );

  const renderInvitedGroupItem = ({ item }: { item: Group }) => (
    <View style={styles.groupItem}>
      <View style={styles.groupInfo}>
        <View style={styles.groupIcon}>
          <Ionicons name="people" size={24} color={theme.colors.secondary} />
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.groupName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.groupDescription}>{item.description}</Text>
          )}
          <Text style={styles.memberCount}>
            {item.memberCount || item.members.length} members
          </Text>
        </View>
      </View>
      <View style={styles.inviteActions}>
        <Button
          title="Accept"
          onPress={() => handleAcceptInvitation(item.id)}
          variant="primary"
          style={styles.acceptButton}
        />
      </View>
    </View>
  );

  const renderTabContent = () => {
    let data: Group[] = [];
    let renderItem: ({ item }: { item: Group }) => React.ReactElement;

    switch (activeTab) {
      case 'owned':
        data = ownedGroups;
        renderItem = renderOwnedGroupItem;
        break;
      case 'member':
        data = memberGroups;
        renderItem = renderMemberGroupItem;
        break;
      case 'invited':
        data = invitedGroups;
        renderItem = renderInvitedGroupItem;
        break;
    }

    if (isLoading && data.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error loading groups</Text>
          <Button title="Retry" onPress={handleRefresh} />
        </View>
      );
    }

    if (data.length === 0) {
      const emptyMessage = activeTab === 'owned' 
        ? 'No groups created yet' 
        : activeTab === 'member' 
        ? 'Not a member of any groups' 
        : 'No group invitations';
      
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
          {activeTab === 'owned' && (
            <Button
              title="Create Your First Group"
              onPress={handleCreateGroup}
              style={styles.createButton}
            />
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <Text style={styles.subtitle}>Organize your connections</Text>
        
        {activeTab === 'owned' && (
          <TouchableOpacity style={styles.createGroupButton} onPress={handleCreateGroup}>
            <Ionicons name="add" size={20} color={theme.colors.background} />
            <Text style={styles.createGroupText}>Create Group</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'owned' && styles.activeTab]}
          onPress={() => setActiveTab('owned')}
        >
          <Text style={[styles.tabText, activeTab === 'owned' && styles.activeTabText]}>
            Owned ({ownedGroups.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'member' && styles.activeTab]}
          onPress={() => setActiveTab('member')}
        >
          <Text style={[styles.tabText, activeTab === 'member' && styles.activeTabText]}>
            Member ({memberGroups.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'invited' && styles.activeTab]}
          onPress={() => setActiveTab('invited')}
        >
          <Text style={[styles.tabText, activeTab === 'invited' && styles.activeTabText]}>
            Invites
          </Text>
          {invitedGroups.length > 0 && (
            <Badge variant="secondary" size="sm" style={styles.badge}>
              {invitedGroups.length}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  createGroupText: {
    ...theme.typography.button,
    color: theme.colors.background,
    marginLeft: theme.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  badge: {
    marginLeft: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  groupName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  groupDescription: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  memberCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  ownerBadge: {
    alignItems: 'center',
  },
  actionButton: {
    minWidth: 80,
  },
  inviteActions: {
    alignItems: 'center',
  },
  acceptButton: {
    minWidth: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  createButton: {
    marginTop: theme.spacing.md,
  },
});

export default GroupsScreen; 