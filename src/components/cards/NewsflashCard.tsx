import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, CardHeader, CardContent } from './Card';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { theme } from '../../styles/theme';
import type { Newsflash } from '../../types';

interface NewsflashCardProps {
  newsflash: Newsflash;
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

export const NewsflashCard: React.FC<NewsflashCardProps> = ({ newsflash }) => {
  // Handle both API format and current format
  const authorName = newsflash.userFullName || newsflash.author?.name || newsflash.author?.fullName || 'Unknown';
  const authorAvatar = newsflash.author?.avatar;
  const headline = newsflash.headline || 'Newsflash Update';
  const content = newsflash.generatedText || newsflash.transformedText || newsflash.rawText || newsflash.originalText;
  const timestamp = newsflash.timestamp || newsflash.createdAt;

  return (
    <Card
      borderColor={theme.colors.primary}
      borderWidth={2}
      style={styles.card}
    >
      <CardHeader>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar
              source={authorAvatar}
              fallback={authorName}
              size="sm"
            />
            <View style={styles.textInfo}>
              <Text style={styles.headline} numberOfLines={2}>
                {headline}
              </Text>
              <Text style={styles.timeAgo}>
                {formatTimeAgo(timestamp)}
              </Text>
            </View>
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
              {newsflash.sentiment}
            </Badge>
          )}
        </View>
      </CardHeader>
      
      <CardContent>
        <Text style={styles.transformedText}>
          {content}
        </Text>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  textInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  headline: {
    ...theme.typography.h4,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  timeAgo: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  sentimentBadge: {
    alignSelf: 'flex-start',
  },
  transformedText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
}); 