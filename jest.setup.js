// Gesture handler not needed for current tests

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      canGoBack: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://192.168.1.132',
    },
  },
}));

jest.mock('expo-sqlite', () => ({
  KVStore: jest.fn().mockImplementation(() => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    setItemSync: jest.fn(),
    getItemSync: jest.fn(),
  })),
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock('expo-audio', () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock React Native modules
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default || {}),
  Version: 15,
  isPad: false,
  isTesting: true,
};

jest.mock('react-native/Libraries/Utilities/Platform', () => mockPlatform);

// Platform mock handled above

// AsyncStorage not used in our app (we use expo-sqlite/kv-store)

// Silence console warnings during tests
console.warn = jest.fn();
console.error = jest.fn();

// Mock timers (disabled for React Query compatibility)
// jest.useFakeTimers(); 