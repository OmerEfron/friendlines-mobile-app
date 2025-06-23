import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { theme } from '../../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  onPress,
  disabled = false,
  style,
}) => {
  const isInteractive = Boolean(onPress);
  
  const badgeVariant = selected ? 'default' : variant;
  
  const Container = isInteractive ? TouchableOpacity : View;
  
  return (
    <Container
      style={[
        styles.badge,
        styles[badgeVariant],
        styles[size],
        disabled && styles.disabled,
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
      <Text style={[styles.text, styles[`${badgeVariant}Text`], styles[`${size}Text`]]}>
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
  },
  default: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
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
  },
  outlineText: {
    color: theme.colors.text,
  },
  secondaryText: {
    color: theme.colors.text,
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