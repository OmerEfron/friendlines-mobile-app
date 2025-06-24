import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { theme } from '../../styles/theme';
import type { Newsflash } from '../../types';

interface AnimatedNewsflashCardProps {
  newsflash: Newsflash;
  onPress?: () => void;
  onBookmark?: (newsflash: Newsflash) => void;
  showActions?: boolean;
  index?: number;
}

const AnimatedNewsflashCard: React.FC<AnimatedNewsflashCardProps> = ({ 
  newsflash, 
  onPress,
  onBookmark,
  showActions = true,
  index = 0
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Start entrance animation
  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTimestamp = (timestamp?: string | Date) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(newsflash);
    Alert.alert('Bookmark', 'Bookmark functionality coming soon!');
  };

  const getSentimentColor = (sentiment?: string) => {
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })},
          ],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
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
                {formatTimestamp(newsflash.timestamp || newsflash.createdAt)}
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
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isBookmarked ? theme.colors.primary : theme.colors.textSecondary} 
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
            <View style={styles.spacer} />

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  touchable: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
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
  spacer: {
    flex: 1,
  },
});

export default AnimatedNewsflashCard; 