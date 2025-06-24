import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'playful' | 'proud' | 'nostalgic'>('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  
  const { newsflashes = [] } = useNewsflashes(user!);

  // Filter newsflashes based on selected filter
  const filteredNewsflashes = useMemo(() => {
    if (selectedFilter === 'all') {
      return newsflashes;
    }
    return newsflashes.filter(newsflash => newsflash.sentiment === selectedFilter);
  }, [newsflashes, selectedFilter]);

  // Generate trending topics from newsflashes
  const trendingTopics = useMemo(() => {
    const topicMap = new Map<string, { count: number; sentiment: string }>();
    
    newsflashes.forEach(newsflash => {
      const text = newsflash.headline || newsflash.generatedText || newsflash.originalText || '';
      const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
      
      words.forEach(word => {
        if (word.length > 3) {
          const existing = topicMap.get(word);
          if (existing) {
            existing.count++;
          } else {
            topicMap.set(word, { count: 1, sentiment: newsflash.sentiment || 'playful' });
          }
        }
      });
    });
    
    return Array.from(topicMap.entries())
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

  const handleLike = (newsflash: Newsflash) => {
    // Show success notification
    setNotificationType('success');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBookmark = (newsflash: Newsflash) => {
    // Show success notification
    setNotificationType('success');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      // Show refresh success notification
      setNotificationType('success');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 1000);
  };

  const renderNewsflash = ({ item, index }: { item: Newsflash; index: number }) => (
    <AnimatedNewsflashCard 
      newsflash={item} 
      onPress={() => handleNewsflashPress(item)}
      onLike={handleLike}
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
      {showNotification && (
        <NotificationBanner
          type={notificationType}
          title={getNotificationConfig().title}
          message={getNotificationConfig().message}
          onDismiss={() => setShowNotification(false)}
          autoDismiss={true}
          duration={3000}
        />
      )}
      
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
          <EnhancedRefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            title="Pull to refresh"
            subtitle="Release to update your feed"
          />
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
});

export default HomeScreen; 