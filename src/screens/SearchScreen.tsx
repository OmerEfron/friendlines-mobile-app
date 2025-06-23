import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader, NewsflashCard } from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { useNewsflashes } from '../hooks/useNewsflashes';
import { useFriends } from '../hooks/useFriends';
import { useGroups } from '../hooks/useGroups';
import type { Newsflash, User, Group } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

type SearchType = 'newsflashes' | 'people' | 'groups';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('newsflashes');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  
  const { newsflashes = [] } = useNewsflashes(user!);
  const { friends = [] } = useFriends(user?.id || '');
  const { 
    ownedGroups = [], 
    memberGroups = [], 
    invitedGroups = [] 
  } = useGroups(user?.id || '');

  const allGroups = [...memberGroups, ...ownedGroups, ...invitedGroups];

  // Filter and search logic
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        newsflashes: [],
        people: [],
        groups: []
      };
    }

    const query = searchQuery.toLowerCase().trim();

    // Search newsflashes
    const filteredNewsflashes = newsflashes.filter(newsflash => {
      const matchesQuery = 
        (newsflash.headline || '').toLowerCase().includes(query) ||
        (newsflash.generatedText || '').toLowerCase().includes(query) ||
        (newsflash.transformedText || '').toLowerCase().includes(query) ||
        (newsflash.originalText || '').toLowerCase().includes(query) ||
        (newsflash.userFullName || '').toLowerCase().includes(query) ||
        (newsflash.author?.name || '').toLowerCase().includes(query);

      const matchesSentiment = !selectedSentiment || newsflash.sentiment === selectedSentiment;

      return matchesQuery && matchesSentiment;
    });

    // Search people (friends)
    const filteredPeople = friends.filter(friend => 
      (friend.name || '').toLowerCase().includes(query) ||
      (friend.fullName || '').toLowerCase().includes(query) ||
      (friend.email || '').toLowerCase().includes(query)
    );

    // Search groups
    const filteredGroups = allGroups.filter(group => 
      (group.name || '').toLowerCase().includes(query) ||
      (group.description || '').toLowerCase().includes(query)
    );

    return {
      newsflashes: filteredNewsflashes,
      people: filteredPeople,
      groups: filteredGroups
    };
  }, [searchQuery, newsflashes, friends, allGroups, selectedSentiment]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    // Already on search screen
  };

  const handleProfilePress = () => {
    navigation.navigate('UserFeed', { userId: user?.id });
  };

  const handleNewsflashPress = (newsflash: Newsflash) => {
    navigation.navigate('NewsflashDetail', { newsflashId: newsflash.id });
  };

  const handlePersonPress = (person: User) => {
    navigation.navigate('FriendProfile', { userId: person.id });
  };

  const handleGroupPress = (group: Group) => {
    navigation.navigate('GroupDetail', { groupId: group.id });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedSentiment(null);
  };

  const renderTabButton = (tab: SearchType, label: string, icon: string, count: number) => (
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
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedSentiment && styles.activeFilterChip
          ]}
          onPress={() => setSelectedSentiment(null)}
        >
          <Text style={[
            styles.filterChipText,
            !selectedSentiment && styles.activeFilterChipText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {['playful', 'proud', 'nostalgic'].map(sentiment => (
          <TouchableOpacity
            key={sentiment}
            style={[
              styles.filterChip,
              selectedSentiment === sentiment && styles.activeFilterChip
            ]}
            onPress={() => setSelectedSentiment(sentiment)}
          >
            <Text style={[
              styles.filterChipText,
              selectedSentiment === sentiment && styles.activeFilterChipText
            ]}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSearchResults = () => {
    const results = filteredResults[activeTab];
    const count = results.length;

    if (!searchQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>Search for Newsflashes, People, or Groups</Text>
          <Text style={styles.emptySubtext}>
            Enter a search term above to find what you're looking for
          </Text>
        </View>
      );
    }

    if (count === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search terms or filters
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'newsflashes':
        return (
          <FlatList
            data={results as Newsflash[]}
            renderItem={({ item }) => (
              <NewsflashCard 
                newsflash={item} 
                onPress={() => handleNewsflashPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      
      case 'people':
        return (
          <FlatList
            data={results as User[]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.personItem}
                onPress={() => handlePersonPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{item.fullName || item.name}</Text>
                  <Text style={styles.personEmail}>{item.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      
      case 'groups':
        return (
          <FlatList
            data={results as Group[]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.groupItem}
                onPress={() => handleGroupPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{item.name}</Text>
                  <Text style={styles.groupDescription}>
                    {item.description || `${item.memberCount || (item.members || []).length} members`}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <NewsHeader 
        title="Search" 
        subtitle={`${filteredResults.newsflashes.length + filteredResults.people.length + filteredResults.groups.length} results`}
        showBackButton
        onBackPress={handleBackPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search newsflashes, people, or groups..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      {activeTab === 'newsflashes' && searchQuery.trim() && renderFilters()}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('newsflashes', 'Newsflashes', 'newspaper', filteredResults.newsflashes.length)}
        {renderTabButton('people', 'People', 'people', filteredResults.people.length)}
        {renderTabButton('groups', 'Groups', 'people-circle', filteredResults.groups.length)}
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {renderSearchResults()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  filtersContainer: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  filtersContent: {
    paddingHorizontal: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  activeFilterChipText: {
    color: theme.colors.background,
    fontWeight: '600',
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
  resultsContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  personEmail: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  groupInfo: {
    flex: 1,
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

export default SearchScreen; 