import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface DeviceInfo {
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  platform: 'ios' | 'android' | 'web';
}

interface UseDeviceReturn extends DeviceInfo {
  orientation: 'portrait' | 'landscape';
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  safeAreaMultiplier: number;
}

export const useDevice = (): UseDeviceReturn => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = dimensions;
  const isLandscape = screenWidth > screenHeight;
  const orientation = isLandscape ? 'landscape' : 'portrait';

  // Device type detection (basic heuristic)
  const isTablet = screenWidth >= 768 && screenHeight >= 1024;
  const isSmallScreen = screenWidth < 360; // Small phones
  const isLargeScreen = screenWidth >= 768; // Large phones/tablets

  // Platform information
  const platform = Platform.OS as 'ios' | 'android' | 'web';

  // Safe area multiplier for padding/margins
  const safeAreaMultiplier = isTablet ? 1.5 : 1;

  const deviceInfo: DeviceInfo = {
    isTablet,
    screenWidth,
    screenHeight,
    isLandscape,
    platform,
  };

  return {
    ...deviceInfo,
    orientation,
    isSmallScreen,
    isLargeScreen,
    safeAreaMultiplier,
  };
};

// Utility hooks for common checks
export const useIsTablet = (): boolean => {
  const { isTablet } = useDevice();
  return isTablet;
};

export const useIsLandscape = (): boolean => {
  const { isLandscape } = useDevice();
  return isLandscape;
};

export const useScreenDimensions = () => {
  const { screenWidth, screenHeight } = useDevice();
  return { width: screenWidth, height: screenHeight };
}; 