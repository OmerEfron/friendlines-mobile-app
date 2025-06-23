import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 'md',
  color = theme.colors.background,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 48;
      case 'lg':
        return 64;
      default:
        return 56;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 20;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: getSize(),
            height: getSize(),
            borderRadius: getSize() / 2,
          },
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Create newsflash"
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={color}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    zIndex: 1000,
  },
  button: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
}); 