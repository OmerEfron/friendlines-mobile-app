import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary colors - News website style
    primary: '#1a365d', // Deep blue for news
    primaryDark: '#0f2027',
    primaryLight: '#2d5a87',
    
    // Secondary colors
    secondary: '#4a5568', // Muted gray
    secondaryDark: '#2d3748',
    secondaryLight: '#718096',
    
    // Background colors - Clean news layout
    background: '#ffffff',
    backgroundDark: '#1a202c',
    surface: '#f7fafc',
    surfaceDark: '#2d3748',
    
    // Text colors - High contrast for readability
    text: '#1a202c', // Dark gray for headlines
    textDark: '#f7fafc',
    textSecondary: '#4a5568', // Medium gray for body text
    textSecondaryDark: '#a0aec0',
    textMuted: '#718096', // Light gray for captions
    
    // Border colors
    border: '#e2e8f0',
    borderDark: '#4a5568',
    
    // Status colors - News-style
    success: '#38a169', // Green for positive news
    successDark: '#2f855a',
    warning: '#d69e2e', // Amber for alerts
    warningDark: '#b7791f',
    error: '#e53e3e', // Red for breaking news
    errorDark: '#c53030',
    
    // News-specific colors
    newsAccent: '#3182ce', // Blue accent for links
    newsHighlight: '#fef5e7', // Light yellow for highlights
    newsBreaking: '#fed7d7', // Light red for breaking news
    
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
    // News website typography
    h1: { 
      fontSize: 32, 
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: { 
      fontSize: 28, 
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.3,
    },
    h3: { 
      fontSize: 24, 
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: -0.1,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    // News body text
    body: { 
      fontSize: 16, 
      fontWeight: '400' as const,
      lineHeight: 26,
      letterSpacing: 0.1,
    },
    bodySmall: { 
      fontSize: 14, 
      fontWeight: '400' as const,
      lineHeight: 22,
      letterSpacing: 0.1,
    },
    // News captions and metadata
    caption: { 
      fontSize: 12, 
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    // News button text
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    // News headline styles
    headline: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
      letterSpacing: -0.2,
    },
    subheadline: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22,
      letterSpacing: 0,
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
        shadowOpacity: 0.08,
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
        shadowOpacity: 0.12,
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
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
    xl: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
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
    // News-specific layout
    headerHeight: 64,
    cardSpacing: 16,
    contentMaxWidth: 800,
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