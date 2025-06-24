import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface NotificationBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  onPress?: () => void;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
  showIcon?: boolean;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type = 'info',
  title,
  message,
  onPress,
  onDismiss,
  autoDismiss = true,
  duration = 5000,
  showIcon = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success + '15',
          borderColor: theme.colors.success,
          iconColor: theme.colors.success,
          icon: 'checkmark-circle',
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning + '15',
          borderColor: theme.colors.warning,
          iconColor: theme.colors.warning,
          icon: 'warning',
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error + '15',
          borderColor: theme.colors.error,
          iconColor: theme.colors.error,
          icon: 'alert-circle',
        };
      default:
        return {
          backgroundColor: theme.colors.newsAccent + '15',
          borderColor: theme.colors.newsAccent,
          iconColor: theme.colors.newsAccent,
          icon: 'information-circle',
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: typeStyles.backgroundColor,
          borderColor: typeStyles.borderColor,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress}
      >
        {showIcon && (
          <Ionicons
            name={typeStyles.icon as any}
            size={24}
            color={typeStyles.iconColor}
            style={styles.icon}
          />
        )}
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: typeStyles.iconColor }]}>
            {title}
          </Text>
          {message && (
            <Text style={styles.message}>
              {message}
            </Text>
          )}
        </View>

        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    ...theme.shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 60,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.subheadline,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  dismissButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default NotificationBanner; 