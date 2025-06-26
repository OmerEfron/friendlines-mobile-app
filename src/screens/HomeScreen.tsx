import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { 
  NewsHeader, 
  AnimatedNewsflashCard, 
  TrendingSection, 
  FloatingActionButton,
  NotificationBanner,
  EnhancedRefreshControl
} from '../components';
import { theme } from '../styles/theme';
import { useAppContext } from '../contexts/AppContext';
import { useNewsflashes } from '../hooks/useNewsflashes';
import type { Newsflash } from '../types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const { newsflashes, isLoading, error, refetch } = useNewsflashes(user!);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'playful' | 'proud' | 'nostalgic'>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  
  // Debug user context
  console.log('👤 HomeScreen - User context:', user?.id, user?.fullName);
  
  // Safety check - if no user, show loading or error state
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Filter newsflashes for the current user
  const filteredNewsflashes = useMemo(() => {
    if (!user) return [];
    
    return newsflashes.filter(newsflash => {
      // Show newsflashes from friends
      if (user.friends?.includes(newsflash.userId || '')) return true;
      
      // Show newsflashes where user is a recipient
      if (newsflash.recipients?.includes(user.id)) return true;
      
      // Show newsflashes from groups the user is in
      if (newsflash.groupIds && newsflash.groupIds.length > 0) {
        // This would need to be enhanced with actual group membership check
        return true;
      }
      
      return false;
    });
  }, [newsflashes, user]);

  // Get trending topics from newsflashes
  const trendingTopics = useMemo(() => {
    const topicCounts: Record<string, { count: number; sentiment: string }> = {};
    
    newsflashes.forEach(newsflash => {
      const text = newsflash.transformedText || newsflash.originalText || '';
      const words = text.toLowerCase().split(/\s+/);
      
      words.forEach(word => {
        if (word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that', 'have', 'from'].includes(word)) {
          if (!topicCounts[word]) {
            topicCounts[word] = { count: 0, sentiment: newsflash.sentiment || 'neutral' };
          }
          topicCounts[word].count++;
        }
      });
    });
    
    return Object.entries(topicCounts)
      .map(([topic, data]) => ({
        id: topic,
        topic,
        count: data.count,
        sentiment: data.sentiment,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [newsflashes]);

  // Get popular newsflashes (random selection for demo)
  const popularNewsflashes = useMemo(() => {
    return newsflashes
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, [newsflashes]);

  const handleBackPress = () => {
    // No back action on home screen
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserFeed', { userId: user?.id });
  };

  const handleMenuPress = () => {
    navigation.navigate('Menu');
  };

  const handleNewsflashPress = (newsflash: Newsflash) => {
    navigation.navigate('NewsflashDetail', { newsflashId: newsflash.id });
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateNewsflash');
  };

  const handleTopicPress = (topic: string) => {
    // Navigate to search with topic filter
    navigation.navigate('Search');
    // In a real app, you'd pass the topic as a parameter
  };

  const handleBookmark = (newsflash: Newsflash) => {
    // Bookmark functionality - notifications will be handled by the backend
    console.log('Bookmarking newsflash:', newsflash.id);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const renderNewsflash = ({ item, index }: { item: Newsflash; index: number }) => (
    <AnimatedNewsflashCard 
      newsflash={item} 
      onPress={() => handleNewsflashPress(item)}
      onBookmark={handleBookmark}
      index={index}
    />
  );

  const renderHeader = () => (
    <TrendingSection
      trendingTopics={trendingTopics}
      popularNewsflashes={popularNewsflashes}
      onTopicPress={handleTopicPress}
      onNewsflashPress={handleNewsflashPress}
    />
  );

  const getNotificationConfig = () => {
    switch (notificationType) {
      case 'success':
        return {
          title: 'Action completed',
          message: 'Your action was successful!',
        };
      case 'info':
        return {
          title: 'Information',
          message: 'Feature coming soon!',
        };
      case 'warning':
        return {
          title: 'Warning',
          message: 'Please check your input.',
        };
      case 'error':
        return {
          title: 'Error',
          message: 'Something went wrong.',
        };
      default:
        return {
          title: 'Notification',
          message: 'You have a new update.',
        };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NewsHeader 
        title="Friendlines" 
        subtitle="Your Personal News Feed"
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      <FlatList
        data={filteredNewsflashes}
        renderItem={renderNewsflash}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No newsflashes found</Text>
            <Text style={styles.emptySubtext}>Pull to refresh or create your first newsflash!</Text>
          </View>
        }
      />
      
      <FloatingActionButton
        icon="add"
        onPress={handleCreatePress}
        style={styles.fab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen; 