import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { theme } from '../../styles/theme';
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
      return theme.colors.warning;
    case 'proud':
      return theme.colors.success;
    case 'nostalgic':
      return '#8b5cf6'; // purple
    default:
      return theme.colors.secondary;
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
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [likeCount, setLikeCount] = useState(newsflash.likesCount || Math.floor(Math.random() * 50));
  const [commentCount, setCommentCount] = useState(newsflash.commentsCount || Math.floor(Math.random() * 20));
  const [shareCount, setShareCount] = useState(newsflash.sharesCount || Math.floor(Math.random() * 10));

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentPress = () => {
    // Navigate to comments or show comment modal
    Alert.alert('Comments', 'Comment functionality coming soon!');
  };

  const handleSharePress = () => {
    setIsShared(!isShared);
    setShareCount(prev => isShared ? prev - 1 : prev + 1);
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const handleBookmarkPress = () => {
    Alert.alert('Bookmark', 'Bookmark functionality coming soon!');
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.95}
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
              {formatTimeAgo(newsflash.timestamp || newsflash.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {newsflash.sentiment && (
            <Badge>
              {newsflash.sentiment}
            </Badge>
          )}
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={handleBookmarkPress}
          >
            <Ionicons 
              name="bookmark-outline" 
              size={20} 
              color={theme.colors.textSecondary} 
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
            <Ionicons name="people" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.groupsText}>
              Shared in {newsflash.groups.length} group{newsflash.groups.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={handleLikePress}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={18} 
              color={isLiked ? theme.colors.error : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.actionText,
              isLiked && styles.actionTextActive
            ]}>
              {likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCommentPress}
          >
            <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, isShared && styles.actionButtonActive]}
            onPress={handleSharePress}
          >
            <Ionicons 
              name={isShared ? "share" : "share-outline"} 
              size={18} 
              color={isShared ? theme.colors.newsAccent : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.actionText,
              isShared && styles.actionTextActive
            ]}>
              {shareCount}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
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
    color: theme.colors.text,
    fontWeight: '600',
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  headline: {
    ...theme.typography.headline,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  bodyText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  groupsText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.primary + '10',
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  actionTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
});

export default NewsflashCard; 