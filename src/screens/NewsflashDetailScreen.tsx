import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NewsHeader } from '../components';
import { theme } from '../styles/theme';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { useAppContext } from '../contexts/AppContext';
import { useNewsflashes } from '../hooks/useNewsflashes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NewsflashDetailScreenProps {
  route?: {
    params?: {
      newsflashId: string;
    };
  };
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

const NewsflashDetailScreen: React.FC<NewsflashDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAppContext();
  const { newsflashId } = route?.params || {};
  
  const { newsflashes = [] } = useNewsflashes(user!);
  const newsflash = (newsflashes || []).find(n => n.id === newsflashId);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSharePress = () => {
    // TODO: Implement share functionality
    console.log('Share newsflash:', newsflashId);
  };

  const handleLikePress = () => {
    // TODO: Implement like functionality
    console.log('Like newsflash:', newsflashId);
  };

  const handleCommentPress = () => {
    // TODO: Implement comment functionality
    console.log('Comment on newsflash:', newsflashId);
  };

  if (!newsflash) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <NewsHeader 
          title="Newsflash Detail" 
          subtitle="Not Found"
          showBackButton
          onBackPress={handleBackPress}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={styles.errorTitle}>Newsflash Not Found</Text>
          <Text style={styles.errorSubtext}>
            The newsflash you're looking for doesn't exist or has been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle both API format and current format
  const authorName = newsflash.userFullName || newsflash.author?.name || newsflash.author?.fullName || 'Unknown';
  const authorAvatar = newsflash.author?.avatar;
  const headline = newsflash.headline || 'Newsflash Update';
  const content = newsflash.generatedText || newsflash.transformedText || newsflash.rawText || newsflash.originalText;
  const timestamp = newsflash.timestamp || newsflash.createdAt;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NewsHeader 
        title="Newsflash Detail" 
        subtitle={headline}
        showBackButton
        onBackPress={handleBackPress}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Author Info */}
        <View style={styles.authorSection}>
          <Avatar
            source={authorAvatar}
            fallback={authorName}
            size="lg"
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(timestamp)}</Text>
          </View>
          {newsflash.sentiment && (
            <Badge
              variant="secondary"
              size="sm"
              style={[
                styles.sentimentBadge,
                { backgroundColor: getSentimentColor(newsflash.sentiment) }
              ]}
            >
              {getSentimentLabel(newsflash.sentiment)}
            </Badge>
          )}
        </View>

        {/* Headline */}
        <Text style={styles.headline}>{headline}</Text>

        {/* Content */}
        <Text style={styles.contentText}>{content}</Text>

        {/* Original Text (if different from content) */}
        {newsflash.originalText && newsflash.originalText !== content && (
          <View style={styles.originalSection}>
            <Text style={styles.originalLabel}>Original Text:</Text>
            <Text style={styles.originalText}>{newsflash.originalText}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataSection}>
          <View style={styles.metadataItem}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.metadataText}>
              {new Date(timestamp).toLocaleDateString()} at {new Date(timestamp).toLocaleTimeString()}
            </Text>
          </View>
          
          {(newsflash.recipients || []).length > 0 && (
            <View style={styles.metadataItem}>
              <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metadataText}>
                Shared with {(newsflash.recipients || []).length} recipient{(newsflash.recipients || []).length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          
          {(newsflash.groups || []).length > 0 && (
            <View style={styles.metadataItem}>
              <Ionicons name="people-circle" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metadataText}>
                Shared in {(newsflash.groups || []).length} group{(newsflash.groups || []).length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <Ionicons name="heart-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>
              {newsflash.likesCount || 0} Likes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCommentPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>
              {newsflash.commentsCount || 0} Comments
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSharePress}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={styles.actionText}>
              {newsflash.sharesCount || 0} Shares
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  authorInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  authorName: {
    ...theme.typography.subheadline,
    color: theme.colors.text,
    marginBottom: 2,
  },
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sentimentBadge: {
    alignSelf: 'flex-start',
  },
  headline: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 36,
  },
  contentText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    marginBottom: theme.spacing.xl,
  },
  originalSection: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.newsHighlight,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  originalLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  originalText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  metadataSection: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metadataText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.h4,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorSubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default NewsflashDetailScreen; 