import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader, NewsflashCard, FloatingActionButton } from '../components';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useGroups } from '../hooks/useGroups';
import { useNewsflashes } from '../hooks/useNewsflashes';
import type { Group, Newsflash } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface GroupFeedsScreenProps {
  route?: {
    params?: {
      groupId?: string;
    };
  };
}

const GroupFeedsScreen: React.FC<GroupFeedsScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  
  const { 
    ownedGroups, 
    memberGroups, 
    invitedGroups, 
    isLoading: groupsLoading, 
    error: groupsError, 
    refetchGroups 
  } = useGroups(user?.id || '');

  const { newsflashes = [], isLoading: newsflashesLoading, error: newsflashesError, refetch: refetchNewsflashes } = useNewsflashes(user!);

  // Get all available groups
  const allGroups = [...(memberGroups || []), ...(ownedGroups || [])];

  // Filter newsflashes by selected group
  const filteredNewsflashes = selectedGroup 
    ? (newsflashes || []).filter(newsflash => 
        (newsflash.groups || []).includes(selectedGroup.id) || 
        (newsflash.groupIds || []).includes(selectedGroup.id)
      )
    : (newsflashes || []).filter(newsflash => 
        (newsflash.groups || []).length > 0 || (newsflash.groupIds || []).length > 0
      );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserFeed', { userId: user?.id });
  };

  const handleCreateNewsflash = () => {
    navigation.navigate('CreateNewsflash');
  };

  const handleGroupPress = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupSelector(false);
  };

  const handleRefresh = () => {
    refetchGroups();
    refetchNewsflashes();
  };

  const handleNewsflashPress = (newsflash: Newsflash) => {
    navigation.navigate('NewsflashDetail', { newsflashId: newsflash.id });
  };

  const renderGroupSelector = () => (
    <View style={styles.groupSelector}>
      <View style={styles.groupSelectorHeader}>
        <Text style={styles.groupSelectorTitle}>Select Group</Text>
        <TouchableOpacity
          onPress={() => setShowGroupSelector(false)}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={allGroups}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupOption}
            onPress={() => handleGroupPress(item)}
            activeOpacity={0.7}
          >
            <Avatar
              source={undefined}
              fallback={item.name}
              size="sm"
            />
            <View style={styles.groupOptionInfo}>
              <Text style={styles.groupOptionName}>{item.name}</Text>
              <Text style={styles.groupOptionMembers}>
                {(item.memberCount || (item.members || []).length)} members
              </Text>
            </View>
            {selectedGroup?.id === item.id && (
              <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderGroupHeader = () => (
    <View style={styles.groupHeader}>
      {selectedGroup ? (
        <TouchableOpacity
          style={styles.selectedGroup}
          onPress={() => setShowGroupSelector(true)}
          activeOpacity={0.7}
        >
          <Avatar
            source={undefined}
            fallback={selectedGroup.name}
            size="md"
          />
          <View style={styles.selectedGroupInfo}>
            <Text style={styles.selectedGroupName}>{selectedGroup.name}</Text>
            <Text style={styles.selectedGroupMembers}>
              {(selectedGroup.memberCount || (selectedGroup.members || []).length)} members
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.selectGroupButton}
          onPress={() => setShowGroupSelector(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="people-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.selectGroupText}>Select a group</Text>
          <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NewsHeader 
        title="Group Feeds" 
        subtitle={selectedGroup ? `Newsflashes from ${selectedGroup.name}` : "Select a group to view newsflashes"}
        showBackButton
        onBackPress={handleBackPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      {renderGroupHeader()}

      {showGroupSelector && renderGroupSelector()}

      <FlatList
        data={filteredNewsflashes}
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
            refreshing={groupsLoading || newsflashesLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {!selectedGroup ? (
              <>
                <Ionicons name="people-circle" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyTitle}>Select a Group</Text>
                <Text style={styles.emptySubtext}>
                  Choose a group to view their newsflashes
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="newspaper" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Newsflashes</Text>
                <Text style={styles.emptySubtext}>
                  This group doesn't have any newsflashes yet
                </Text>
              </>
            )}
          </View>
        }
      />

      <FloatingActionButton 
        onPress={handleCreateNewsflash}
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
  groupHeader: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  selectedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedGroupInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  selectedGroupName: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  selectedGroupMembers: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  selectGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectGroupText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  groupSelector: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    zIndex: 1000,
  },
  groupSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  groupSelectorTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  groupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  groupOptionInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  groupOptionName: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  groupOptionMembers: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100, // Space for floating action button
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

export default GroupFeedsScreen; 