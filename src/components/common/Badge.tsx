import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme, getRandomAccentColor } from '../../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'colorful';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  onPress,
  disabled = false,
  style,
  color,
}) => {
  const isInteractive = Boolean(onPress);
  
  const badgeVariant = selected ? 'default' : variant;
  
  const Container = isInteractive ? TouchableOpacity : View;
  
  const getBadgeColor = () => {
    if (color) return color;
    if (variant === 'colorful') return getRandomAccentColor();
    return theme.colors.primary;
  };
  
  const badgeColor = getBadgeColor();
  
  return (
    <Container
      style={[
        styles.badge,
        styles[badgeVariant],
        styles[size],
        disabled && styles.disabled,
        variant === 'colorful' && { backgroundColor: badgeColor + '20', borderColor: badgeColor },
        style,
      ]}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      activeOpacity={isInteractive ? 0.8 : 1}
      accessibilityRole={isInteractive ? "button" : "text"}
      accessibilityLabel={typeof children === 'string' ? children : 'Badge'}
      accessibilityState={{
        disabled,
        selected: isInteractive ? selected : undefined,
      }}
      accessibilityHint={isInteractive ? (selected ? 'Tap to deselect' : 'Tap to select') : undefined}
    >
      <Text style={[
        styles.text, 
        styles[`${badgeVariant}Text`], 
        styles[`${size}Text`],
        variant === 'colorful' && { color: badgeColor }
      ]}>
        {children}
      </Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
    ...theme.shadows.sm,
  },
  default: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: theme.colors.transparent,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.accent3 + '20',
    borderColor: theme.colors.accent3,
  },
  colorful: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    minHeight: 24,
  },
  md: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },
  lg: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
  },
  defaultText: {
    color: theme.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  outlineText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  secondaryText: {
    color: theme.colors.accent3,
    fontWeight: '600',
  },
  colorfulText: {
    fontWeight: '600',
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
}); 