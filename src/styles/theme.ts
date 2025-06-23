import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary colors - Vibrant gradient-inspired
    primary: '#667eea', // Modern purple-blue
    primaryDark: '#4c63d2',
    primaryLight: '#8b9ff8',
    
    // Secondary colors - Complementary vibrant palette
    secondary: '#f093fb', // Pink
    secondaryDark: '#d55fdf',
    secondaryLight: '#f4b5ff',
    
    // Accent colors - Modern social media inspired
    accent1: '#4facfe', // Bright blue
    accent2: '#00f2fe', // Cyan
    accent3: '#43e97b', // Green
    accent4: '#38f9d7', // Teal
    accent5: '#fa709a', // Hot pink
    accent6: '#fee140', // Yellow
    accent7: '#a8edea', // Mint
    accent8: '#fed6e3', // Light pink
    
    // Background colors - Clean with subtle gradients
    background: '#ffffff',
    backgroundDark: '#0f0f23',
    surface: '#f8fafc',
    surfaceDark: '#1a1a2e',
    surfaceVariant: '#f1f5f9',
    surfaceVariantDark: '#16213e',
    
    // Text colors - High contrast for readability
    text: '#1e293b', // Slate 800
    textDark: '#f1f5f9',
    textSecondary: '#64748b', // Slate 500
    textSecondaryDark: '#94a3b8',
    textMuted: '#94a3b8', // Slate 400
    textMutedDark: '#64748b',
    
    // Border colors
    border: '#e2e8f0',
    borderDark: '#334155',
    borderLight: '#f1f5f9',
    borderLightDark: '#1e293b',
    
    // Status colors - Vibrant and modern
    success: '#10b981', // Emerald 500
    successDark: '#059669',
    successLight: '#34d399',
    warning: '#f59e0b', // Amber 500
    warningDark: '#d97706',
    warningLight: '#fbbf24',
    error: '#ef4444', // Red 500
    errorDark: '#dc2626',
    errorLight: '#f87171',
    info: '#3b82f6', // Blue 500
    infoDark: '#2563eb',
    infoLight: '#60a5fa',
    
    // News-specific colors - Colorful and engaging
    newsAccent: '#8b5cf6', // Violet 500
    newsHighlight: '#fef3c7', // Amber 100
    newsBreaking: '#fecaca', // Red 100
    newsTrending: '#dbeafe', // Blue 100
    newsPopular: '#f3e8ff', // Purple 100
    newsExclusive: '#fef2f2', // Red 50
    
    // Social media inspired colors
    socialBlue: '#1877f2', // Facebook blue
    socialPurple: '#833ab4', // Instagram purple
    socialPink: '#fd1d1d', // Instagram pink
    socialYellow: '#fcb045', // Instagram yellow
    socialGreen: '#25d366', // WhatsApp green
    socialRed: '#ff0000', // YouTube red
    
    // Gradient colors for cards and buttons
    gradient1: ['#667eea', '#764ba2'], // Purple to purple
    gradient2: ['#f093fb', '#f5576c'], // Pink to red
    gradient3: ['#4facfe', '#00f2fe'], // Blue to cyan
    gradient4: ['#43e97b', '#38f9d7'], // Green to teal
    gradient5: ['#fa709a', '#fee140'], // Pink to yellow
    gradient6: ['#a8edea', '#fed6e3'], // Mint to pink
    gradient7: ['#ffecd2', '#fcb69f'], // Orange gradient
    gradient8: ['#a8caba', '#5d4e75'], // Green to purple
    
    // Utility colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(255, 255, 255, 0.8)',
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
  surfaceVariant: isDark ? theme.colors.surfaceVariantDark : theme.colors.surfaceVariant,
  text: isDark ? theme.colors.textDark : theme.colors.text,
  textSecondary: isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondary,
  textMuted: isDark ? theme.colors.textMutedDark : theme.colors.textMuted,
  border: isDark ? theme.colors.borderDark : theme.colors.border,
  borderLight: isDark ? theme.colors.borderLightDark : theme.colors.borderLight,
});

// Helper function to get random accent color for variety
export const getRandomAccentColor = (): string => {
  const accentColors = [
    theme.colors.accent1,
    theme.colors.accent2,
    theme.colors.accent3,
    theme.colors.accent4,
    theme.colors.accent5,
    theme.colors.accent6,
    theme.colors.accent7,
    theme.colors.accent8,
  ];
  return accentColors[Math.floor(Math.random() * accentColors.length)];
};

// Helper function to get gradient colors
export const getGradientColors = (gradientIndex: number = 1): [string, string] => {
  const gradients = [
    theme.colors.gradient1,
    theme.colors.gradient2,
    theme.colors.gradient3,
    theme.colors.gradient4,
    theme.colors.gradient5,
    theme.colors.gradient6,
    theme.colors.gradient7,
    theme.colors.gradient8,
  ];
  const selectedGradient = gradients[(gradientIndex - 1) % gradients.length];
  return [selectedGradient[0], selectedGradient[1]] as [string, string];
}; 