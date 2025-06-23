import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import type { Newsflash } from '../../types';

interface TrendingSectionProps {
  trendingTopics: Array<{
    id: string;
    topic: string;
    count: number;
    sentiment: string;
  }>;
  popularNewsflashes: Newsflash[];
  onTopicPress: (topic: string) => void;
  onNewsflashPress: (newsflash: Newsflash) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  trendingTopics,
  popularNewsflashes,
  onTopicPress,
  onNewsflashPress,
}) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'playful':
        return theme.colors.success;
      case 'proud':
        return theme.colors.warning;
      case 'nostalgic':
        return theme.colors.newsAccent;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'playful':
        return 'happy';
      case 'proud':
        return 'star';
      case 'nostalgic':
        return 'heart';
      default:
        return 'ellipse';
    }
  };

  return (
    <View style={styles.container}>
      {/* Trending Topics */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
          <Text style={styles.sectionTitle}>Trending Topics</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsContainer}
        >
          {trendingTopics.map((topic, index) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicChip}
              onPress={() => onTopicPress(topic.topic)}
              activeOpacity={0.7}
            >
              <View style={styles.topicContent}>
                <Text style={styles.topicText}>#{topic.topic}</Text>
                <View style={styles.topicMeta}>
                  <Ionicons 
                    name={getSentimentIcon(topic.sentiment) as any} 
                    size={12} 
                    color={getSentimentColor(topic.sentiment)} 
                  />
                  <Text style={styles.topicCount}>{topic.count}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Newsflashes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="flame" size={20} color={theme.colors.warning} />
          <Text style={styles.sectionTitle}>Popular Now</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsflashesContainer}
        >
          {popularNewsflashes.map((newsflash) => (
            <TouchableOpacity
              key={newsflash.id}
              style={styles.newsflashCard}
              onPress={() => onNewsflashPress(newsflash)}
              activeOpacity={0.7}
            >
              <View style={styles.newsflashHeader}>
                <Text style={styles.newsflashTitle} numberOfLines={2}>
                  {newsflash.headline || newsflash.generatedText?.substring(0, 60) || 'Untitled'}
                </Text>
                <View style={styles.newsflashMeta}>
                  <Ionicons 
                    name={getSentimentIcon(newsflash.sentiment || '') as any} 
                    size={12} 
                    color={getSentimentColor(newsflash.sentiment || '')} 
                  />
                  <Text style={styles.newsflashAuthor}>
                    {newsflash.userFullName || newsflash.author?.name || 'Anonymous'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.newsflashFooter}>
                <View style={styles.newsflashStats}>
                  <Ionicons name="eye" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.newsflashStatText}>
                    {Math.floor(Math.random() * 1000) + 100}
                  </Text>
                </View>
                <View style={styles.newsflashStats}>
                  <Ionicons name="heart" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.newsflashStatText}>
                    {Math.floor(Math.random() * 50) + 5}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  topicsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  topicChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topicContent: {
    alignItems: 'center',
  },
  topicText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicCount: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 2,
    fontSize: 10,
  },
  newsflashesContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  newsflashCard: {
    width: 200,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  newsflashHeader: {
    flex: 1,
  },
  newsflashTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  newsflashMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  newsflashAuthor: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  newsflashFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsflashStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsflashStatText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 2,
    fontSize: 10,
  },
});

export default TrendingSection; 