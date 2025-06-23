import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, getGradientColors } from '../../styles/theme';

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
      <LinearGradient
        colors={getGradientColors(1)}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {showBackButton ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onBackPress}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onMenuPress}
                accessibilityRole="button"
                accessibilityLabel="Menu"
              >
                <Ionicons name="menu" size={24} color={theme.colors.white} />
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
              <Ionicons name="search" size={24} color={theme.colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onProfilePress}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <Ionicons name="person-circle" size={28} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
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
    color: theme.colors.white,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 