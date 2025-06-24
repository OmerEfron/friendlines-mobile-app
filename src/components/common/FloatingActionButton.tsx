import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, getGradientColors } from '../../styles/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: any;
  gradientIndex?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 'md',
  color = theme.colors.white,
  style,
  gradientIndex = 2,
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
        <LinearGradient
          colors={getGradientColors(gradientIndex)}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={icon}
            size={getIconSize()}
            color={color}
          />
        </LinearGradient>
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
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 