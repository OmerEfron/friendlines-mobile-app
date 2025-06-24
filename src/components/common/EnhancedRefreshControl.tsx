import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface EnhancedRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  title?: string;
  subtitle?: string;
}

const EnhancedRefreshControl: React.FC<EnhancedRefreshControlProps> = ({
  refreshing,
  onRefresh,
  title = "Pull to refresh",
  subtitle = "Release to update your feed"
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (refreshing) {
      // Start spinning animation
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse scale animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animations
      spinAnim.stopAnimation();
      scaleAnim.stopAnimation();
      spinAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [refreshing]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.colors.primary]}
      tintColor={theme.colors.primary}
      title={title}
      titleColor={theme.colors.textSecondary}
      progressBackgroundColor={theme.colors.surface}
      style={styles.refreshControl}
    />
  );
};

const styles = StyleSheet.create({
  refreshControl: {
    backgroundColor: theme.colors.background,
  },
});

export default EnhancedRefreshControl; 