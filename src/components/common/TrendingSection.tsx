import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, getGradientColors, getRandomAccentColor } from '../../styles/theme';
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
        return theme.colors.accent6; // Yellow
      case 'proud':
        return theme.colors.accent3; // Green
      case 'nostalgic':
        return theme.colors.accent5; // Hot pink
      default:
        return theme.colors.accent1; // Bright blue
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
          <LinearGradient
            colors={getGradientColors(4)}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="trending-up" size={20} color={theme.colors.white} />
          </LinearGradient>
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
              <LinearGradient
                colors={getGradientColors((index % 8) + 1)}
                style={styles.topicGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.topicContent}>
                  <Text style={styles.topicText}>#{topic.topic}</Text>
                  <View style={styles.topicMeta}>
                    <Ionicons 
                      name={getSentimentIcon(topic.sentiment) as any} 
                      size={12} 
                      color={theme.colors.white} 
                    />
                    <Text style={styles.topicCount}>{topic.count}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Newsflashes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <LinearGradient
            colors={getGradientColors(5)}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="flame" size={20} color={theme.colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Popular Now</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsflashesContainer}
        >
          {popularNewsflashes.map((newsflash, index) => (
            <TouchableOpacity
              key={newsflash.id}
              style={styles.newsflashCard}
              onPress={() => onNewsflashPress(newsflash)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={getGradientColors((index % 8) + 1)}
                style={styles.newsflashGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.newsflashHeader}>
                  <Text style={styles.newsflashTitle} numberOfLines={2}>
                    {newsflash.headline || newsflash.generatedText?.substring(0, 60) || 'Untitled'}
                  </Text>
                  <View style={styles.newsflashMeta}>
                    <Ionicons 
                      name={getSentimentIcon(newsflash.sentiment || '') as any} 
                      size={12} 
                      color={theme.colors.white} 
                    />
                    <Text style={styles.newsflashAuthor}>
                      {newsflash.userFullName || newsflash.author?.name || 'Anonymous'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.newsflashFooter}>
                  <View style={styles.newsflashStats}>
                    <Ionicons name="eye" size={12} color={theme.colors.white} />
                    <Text style={styles.newsflashStatText}>
                      {Math.floor(Math.random() * 1000) + 100}
                    </Text>
                  </View>
                  <View style={styles.newsflashStats}>
                    <Ionicons name="heart" size={12} color={theme.colors.white} />
                    <Text style={styles.newsflashStatText}>
                      {Math.floor(Math.random() * 50) + 5}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
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
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    ...theme.shadows.md,
  },
  topicGradient: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  topicContent: {
    alignItems: 'center',
  },
  topicText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicCount: {
    ...theme.typography.caption,
    color: theme.colors.white,
    marginLeft: 2,
    fontSize: 10,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  newsflashesContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  newsflashCard: {
    width: 200,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    ...theme.shadows.lg,
  },
  newsflashGradient: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newsflashHeader: {
    flex: 1,
  },
  newsflashTitle: {
    ...theme.typography.subheadline,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  newsflashMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  newsflashAuthor: {
    ...theme.typography.caption,
    color: theme.colors.white,
    marginLeft: 4,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    color: theme.colors.white,
    marginLeft: 2,
    fontSize: 10,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default TrendingSection; 