import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { theme, getGradientColors, getRandomAccentColor } from '../../styles/theme';
import type { Newsflash } from '../../types';

interface NewsflashCardProps {
  newsflash: Newsflash;
  onPress?: () => void;
  showActions?: boolean;
}

const formatTimeAgo = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays}d ago`;
  }
};

const getSentimentColor = (sentiment?: string): string => {
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

const getSentimentLabel = (sentiment?: string): string => {
  switch (sentiment) {
    case 'playful':
      return 'Playful';
    case 'proud':
      return 'Proud';
    case 'nostalgic':
      return 'Nostalgic';
    default:
      return 'News';
  }
};

const getSentimentIcon = (sentiment?: string) => {
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

const NewsflashCard: React.FC<NewsflashCardProps> = ({ 
  newsflash, 
  onPress,
  showActions = true 
}) => {
  const handleBookmarkPress = () => {
    Alert.alert('Bookmark', 'Bookmark functionality coming soon!');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={getGradientColors(3)}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <Avatar 
              size="sm" 
              source={newsflash.author?.avatar}
              fallback={newsflash.userFullName || newsflash.author?.name || 'Anonymous'}
            />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>
                {newsflash.userFullName || newsflash.author?.name || 'Anonymous'}
              </Text>
              <Text style={styles.timestamp}>
                {formatTimeAgo(newsflash.timestamp || newsflash.createdAt || new Date())}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            {newsflash.sentiment && (
              <View style={[styles.sentimentBadge, { backgroundColor: getSentimentColor(newsflash.sentiment) + '20' }]}>
                <Ionicons 
                  name={getSentimentIcon(newsflash.sentiment) as any} 
                  size={12} 
                  color={getSentimentColor(newsflash.sentiment)} 
                />
                <Text style={[styles.sentimentText, { color: getSentimentColor(newsflash.sentiment) }]}>
                  {getSentimentLabel(newsflash.sentiment)}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={handleBookmarkPress}
            >
              <Ionicons 
                name="bookmark-outline" 
                size={20} 
                color={theme.colors.white} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {newsflash.headline && (
            <Text style={styles.headline} numberOfLines={3}>
              {newsflash.headline}
            </Text>
          )}
          
          <Text style={styles.bodyText} numberOfLines={4}>
            {newsflash.generatedText || newsflash.transformedText || newsflash.originalText}
          </Text>
          
          {newsflash.groups && newsflash.groups.length > 0 && (
            <View style={styles.groupsContainer}>
              <Ionicons name="people" size={14} color={theme.colors.white} />
              <Text style={styles.groupsText}>
                Shared in {newsflash.groups.length} group{newsflash.groups.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {showActions && (
          <View style={styles.actions}>
            <View style={styles.spacer} />

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  cardGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorDetails: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  authorName: {
    ...theme.typography.subheadline,
    color: theme.colors.white,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.white,
    marginTop: 2,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  sentimentText: {
    ...theme.typography.caption,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  bookmarkButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  headline: {
    ...theme.typography.headline,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.white,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  groupsText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  spacer: {
    flex: 1,
  },
});

export default NewsflashCard; 