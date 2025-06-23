import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../../styles/theme';

interface AvatarProps {
  source?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  fallback,
  size = 'md',
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  
  const showFallback = !source || hasError;
  
  const handleError = () => {
    setHasError(true);
  };

  return (
    <View 
      style={[styles.container, styles[size], style]}
      accessibilityRole="image"
      accessibilityLabel={fallback ? `Avatar for ${fallback}` : 'User avatar'}
    >
      {showFallback ? (
        <Text style={[styles.fallbackText, styles[`${size}Text`]]}>
          {fallback?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      ) : (
        <Image
          source={{ uri: source }}
          style={[styles.image, styles[size]]}
          resizeMode="cover"
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    borderRadius: theme.borderRadius.full,
  },
  sm: {
    width: 32,
    height: 32,
  },
  md: {
    width: 40,
    height: 40,
  },
  lg: {
    width: 56,
    height: 56,
  },
  xl: {
    width: 80,
    height: 80,
  },
  fallbackText: {
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 20,
  },
  xlText: {
    fontSize: 28,
  },
}); 