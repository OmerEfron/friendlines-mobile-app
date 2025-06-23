import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useFriends } from '../hooks/useFriends';
import { usePushNotifications } from '../hooks/usePushNotifications';
import type { User } from '../types';

type TabType = 'friends' | 'requests' | 'sent';

const FriendsScreen: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [refreshing, setRefreshing] = useState(false);

  const {
    friends,
    friendRequests,
    sentRequests,
    isLoading,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend,
    refetchFriends,
  } = useFriends(user?.id || '');

  const { registerForPushNotifications } = usePushNotifications(user?.id);

  useEffect(() => {
    // Register for push notifications when component mounts
    if (user?.id) {
      registerForPushNotifications();
    }
  }, [user?.id, registerForPushNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      refetchFriends();
    } catch (error) {
      console.error('Error refreshing friends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcceptRequest = async (userId: string) => {
    try {
      await acceptFriendRequest(userId);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      await rejectFriendRequest(userId);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleCancelRequest = async (userId: string) => {
    try {
      await cancelFriendRequest(userId);
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleUnfriend = async (userId: string) => {
    try {
      await unfriend(userId);
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  };

  const renderFriendItem = ({ item }: { item: User }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Avatar
          source={item.avatar}
          fallback={item.fullName || item.name}
          size="md"
        />
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.fullName || item.name}</Text>
          <Text style={styles.friendEmail}>{item.email}</Text>
          {item.friendsCount !== undefined && (
            <Text style={styles.friendsCount}>{item.friendsCount} friends</Text>
          )}
        </View>
      </View>
      <Button
        title="Unfriend"
        onPress={() => handleUnfriend(item.id)}
        variant="secondary"
        style={styles.actionButton}
      />
    </View>
  );

  const renderRequestItem = ({ item }: { item: User }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Avatar
          source={item.avatar}
          fallback={item.fullName || item.name}
          size="md"
        />
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.fullName || item.name}</Text>
          <Text style={styles.friendEmail}>{item.email}</Text>
          {item.friendsCount !== undefined && (
            <Text style={styles.friendsCount}>{item.friendsCount} friends</Text>
          )}
        </View>
      </View>
      <View style={styles.requestActions}>
        <Button
          title="Accept"
          onPress={() => handleAcceptRequest(item.id)}
          variant="primary"
          style={styles.acceptButton}
        />
        <Button
          title="Reject"
          onPress={() => handleRejectRequest(item.id)}
          variant="secondary"
          style={styles.rejectButton}
        />
      </View>
    </View>
  );

  const renderSentRequestItem = ({ item }: { item: User }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Avatar
          source={item.avatar}
          fallback={item.fullName || item.name}
          size="md"
        />
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.fullName || item.name}</Text>
          <Text style={styles.friendEmail}>{item.email}</Text>
          {item.friendsCount !== undefined && (
            <Text style={styles.friendsCount}>{item.friendsCount} friends</Text>
          )}
        </View>
      </View>
      <View style={styles.sentActions}>
        <Badge variant="secondary" size="sm">
          Pending
        </Badge>
        <Button
          title="Cancel"
          onPress={() => handleCancelRequest(item.id)}
          variant="secondary"
          style={styles.cancelButton}
        />
      </View>
    </View>
  );

  const renderTabContent = () => {
    const data = activeTab === 'friends' ? friends : activeTab === 'requests' ? friendRequests : sentRequests;
    const renderItem = activeTab === 'friends' ? renderFriendItem : activeTab === 'requests' ? renderRequestItem : renderSentRequestItem;

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
          <Text style={styles.errorText}>Error loading data</Text>
          <Button title="Retry" onPress={handleRefresh} />
        </View>
      );
    }

    if (data.length === 0) {
      const emptyMessage = activeTab === 'friends' 
        ? 'No friends yet' 
        : activeTab === 'requests' 
        ? 'No friend requests' 
        : 'No sent requests';
      
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
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
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.subtitle}>Manage your social connections</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
                     {friendRequests.length > 0 && (
             <Badge variant="secondary" size="sm" style={styles.badge}>
               {friendRequests.length}
             </Badge>
           )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
            Sent ({sentRequests.length})
          </Text>
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
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  friendName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  friendEmail: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  friendsCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    minWidth: 80,
  },
  requestActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  acceptButton: {
    minWidth: 70,
  },
  rejectButton: {
    minWidth: 70,
  },
  sentActions: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cancelButton: {
    minWidth: 70,
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
  },
});

export default FriendsScreen; 