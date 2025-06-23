import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface NewsHeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const NewsHeader: React.FC<NewsHeaderProps> = ({
  title,
  subtitle,
  onMenuPress,
  onSearchPress,
  onProfilePress,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onMenuPress}
              accessibilityRole="button"
              accessibilityLabel="Menu"
            >
              <Ionicons name="menu" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Ionicons name="search" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onProfilePress}
            accessibilityRole="button"
            accessibilityLabel="Profile"
          >
            <Ionicons name="person-circle" size={28} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginHorizontal: 2,
  },
}); 