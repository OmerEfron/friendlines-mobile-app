import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary colors
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    primaryLight: '#60a5fa',
    
    // Secondary colors
    secondary: '#6b7280',
    secondaryDark: '#4b5563',
    secondaryLight: '#9ca3af',
    
    // Background colors
    background: '#ffffff',
    backgroundDark: '#1f2937',
    surface: '#f9fafb',
    surfaceDark: '#374151',
    
    // Text colors
    text: '#111827',
    textDark: '#f9fafb',
    textSecondary: '#6b7280',
    textSecondaryDark: '#9ca3af',
    
    // Border colors
    border: '#e5e7eb',
    borderDark: '#4b5563',
    
    // Status colors
    success: '#10b981',
    successDark: '#047857',
    warning: '#f59e0b',
    warningDark: '#d97706',
    error: '#ef4444',
    errorDark: '#dc2626',
    
    // Utility colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  typography: {
    h1: { 
      fontSize: 28, 
      fontWeight: 'bold' as const,
      lineHeight: 34,
    },
    h2: { 
      fontSize: 24, 
      fontWeight: 'bold' as const,
      lineHeight: 30,
    },
    h3: { 
      fontSize: 20, 
      fontWeight: '600' as const,
      lineHeight: 26,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: { 
      fontSize: 16, 
      fontWeight: 'normal' as const,
      lineHeight: 24,
    },
    bodySmall: { 
      fontSize: 14, 
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    caption: { 
      fontSize: 12, 
      fontWeight: 'normal' as const,
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  
  shadows: {
    none: {},
    sm: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Screen dimensions and safe areas
  layout: {
    minTouchTarget: 44,
    screenPadding: 16,
    cardPadding: 16,
    buttonHeight: 44,
    inputHeight: 44,
  },
};

export type Theme = typeof theme;

// Helper function to get colors based on color scheme
export const getThemedColors = (isDark: boolean) => ({
  background: isDark ? theme.colors.backgroundDark : theme.colors.background,
  surface: isDark ? theme.colors.surfaceDark : theme.colors.surface,
  text: isDark ? theme.colors.textDark : theme.colors.text,
  textSecondary: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary,
  border: isDark ? theme.colors.borderDark : theme.colors.border,
}); 